// @ts-expect-error - Deno runtime imports
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-expect-error - Deno runtime imports
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
    // @ts-expect-error - Deno global
    Deno.env.get('SUPABASE_URL') ?? '',
    // @ts-expect-error - Deno global
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (_req: any) => {
    try {
        const now = new Date();
        const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        // Buscar emails cadastrados para receber alertas
        const { data: alertSettings, error: settingsError } = await supabase
            .from('alert_settings')
            .select('email')
            .eq('receive_maintenance_alerts', true);

        if (settingsError) throw settingsError;

        const recipientEmails = alertSettings?.map(s => s.email) || ['tiagosantosr59@gmail.com'];

        // Buscar ativos que precisam de manutenção nos próximos 7 dias
        const { data: assets, error: assetsError } = await supabase
            .from('assets')
            .select('id, code, name, manufacturer, model, last_maintenance_date, maintenance_interval_days')
            .not('maintenance_interval_days', 'is', null)
            .not('last_maintenance_date', 'is', null);

        if (assetsError) throw assetsError;

        const alertsToSend = [];

        for (const asset of assets || []) {
            if (!asset.last_maintenance_date || !asset.maintenance_interval_days) continue;

            const lastMaintenance = new Date(asset.last_maintenance_date);
            const nextMaintenance = new Date(
                lastMaintenance.getTime() + asset.maintenance_interval_days * 24 * 60 * 60 * 1000
            );

            // Verificar se a próxima manutenção está nos próximos 7 dias
            if (nextMaintenance >= now && nextMaintenance <= sevenDaysFromNow) {
                const daysUntilMaintenance = Math.ceil(
                    (nextMaintenance.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)
                );

                alertsToSend.push({
                    asset,
                    nextMaintenance,
                    daysUntilMaintenance,
                    alertType: 'preventive'
                });
            }

            // Verificar se já passou da data de manutenção
            if (nextMaintenance < now) {
                const daysOverdue = Math.ceil(
                    (now.getTime() - nextMaintenance.getTime()) / (24 * 60 * 60 * 1000)
                );

                alertsToSend.push({
                    asset,
                    nextMaintenance,
                    daysOverdue,
                    isOverdue: true,
                    alertType: 'overdue'
                });
            }
        }

        // Enviar emails para cada alerta
        const emailResults = [];
        for (const alert of alertsToSend) {
            const subject = alert.isOverdue
                ? `⚠️ URGENTE: Manutenção Atrasada - ${alert.asset.code}`
                : `🔔 Alerta: Manutenção Próxima - ${alert.asset.code}`;

            const message = alert.isOverdue
                ? `O ativo ${alert.asset.code} (${alert.asset.name}) está com manutenção atrasada há ${alert.daysOverdue} dias.`
                : `O ativo ${alert.asset.code} (${alert.asset.name}) precisa de manutenção em ${alert.daysUntilMaintenance} dias.`;

            const emailData = {
                assetCode: alert.asset.code,
                assetName: alert.asset.name,
                manufacturer: alert.asset.manufacturer,
                model: alert.asset.model,
                nextMaintenanceDate: alert.nextMaintenance.toLocaleDateString('pt-BR'),
                daysUntilMaintenance: alert.daysUntilMaintenance,
                daysOverdue: alert.daysOverdue,
                isOverdue: alert.isOverdue,
                message
            };

            // Enviar para todos os destinatários cadastrados
            for (const email of recipientEmails) {
                try {
                    const { data: emailResult } = await supabase.functions.invoke('send-email-notification', {
                        body: {
                            to: email,
                            subject,
                            type: 'MAINTENANCE_ALERT',
                            data: emailData
                        }
                    });
                    emailResults.push({ success: true, asset: alert.asset.code, email, emailResult });
                } catch (emailError: any) {
                    emailResults.push({ success: false, asset: alert.asset.code, email, error: emailError.message });
                }
            }

            // Salvar no histórico de alertas
            await supabase.from('maintenance_alerts').insert({
                asset_id: alert.asset.id,
                alert_type: alert.alertType,
                next_maintenance_date: alert.nextMaintenance.toISOString().split('T')[0],
                days_until_maintenance: alert.daysUntilMaintenance || null,
                days_overdue: alert.daysOverdue || null,
                email_sent_to: recipientEmails
            });
        }

        return new Response(JSON.stringify({
            success: true,
            alertsChecked: assets?.length || 0,
            alertsSent: alertsToSend.length,
            recipientsCount: recipientEmails.length,
            emailResults
        }), {
            headers: { "Content-Type": "application/json" },
        });

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});
