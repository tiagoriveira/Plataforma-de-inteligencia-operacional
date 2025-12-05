// @ts-expect-error - Deno runtime imports
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-expect-error - Deno runtime imports
import { Resend } from "npm:resend@2.0.0";

// @ts-expect-error - Deno global
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Template HTML profissional para notificações
function getEmailTemplate(type: string, data: any): string {
    const baseStyle = `
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        .container { 
            max-width: 600px;
            margin: 0 auto;
            background: white;
        }
        .header { 
            background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
        }
        .content { 
            padding: 30px 20px;
        }
        .info-box {
            background: #f9fafb;
            border-left: 4px solid #dc2626;
            padding: 15px;
            margin: 20px 0;
        }
        .info-box strong {
            color: #dc2626;
        }
        .footer { 
            background: #f3f4f6;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
        }
        .button {
            display: inline-block;
            background: #dc2626;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            margin: 20px 0;
        }
        .alert-icon {
            font-size: 48px;
            margin-bottom: 10px;
        }
    `;

    if (type === 'NONCONFORMITY') {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>${baseStyle}</style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="alert-icon">⚠️</div>
                        <h1>Alerta: Não Conformidade Detectada</h1>
                    </div>
                    <div class="content">
                        <p>Uma não conformidade foi registrada no sistema Op.Intel e requer atenção imediata.</p>
                        
                        <div class="info-box">
                            <p><strong>Ativo:</strong> ${data.assetName || 'N/A'}</p>
                            <p><strong>Operador:</strong> ${data.operator || 'N/A'}</p>
                            <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
                        </div>

                        ${data.observation ? `
                            <h3>Observação:</h3>
                            <p>${data.observation}</p>
                        ` : ''}

                        ${data.photoUrl ? `
                            <h3>Evidência Fotográfica:</h3>
                            <p><a href="${data.photoUrl}" target="_blank">Ver Foto</a></p>
                        ` : ''}

                        <p style="margin-top: 30px;">
                            <a href="${data.systemUrl || 'https://seu-dominio.com'}" class="button">
                                Acessar Sistema
                            </a>
                        </p>
                    </div>
                    <div class="footer">
                        <p><strong>Op.Intel</strong> - Plataforma de Inteligência Operacional</p>
                        <p>Este é um email automático. Por favor, não responda.</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    if (type === 'MAINTENANCE_ALERT') {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    ${baseStyle}
                    .header { background: linear-gradient(135deg, ${data.isOverdue ? '#dc2626' : '#f59e0b'} 0%, ${data.isOverdue ? '#991b1b' : '#d97706'} 100%); }
                    .info-box { border-left-color: ${data.isOverdue ? '#dc2626' : '#f59e0b'}; }
                    .info-box strong { color: ${data.isOverdue ? '#dc2626' : '#f59e0b'}; }
                    .button { background: ${data.isOverdue ? '#dc2626' : '#f59e0b'}; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="alert-icon">${data.isOverdue ? '🚨' : '🔔'}</div>
                        <h1>${data.isOverdue ? 'URGENTE: Manutenção Atrasada' : 'Alerta: Manutenção Próxima'}</h1>
                    </div>
                    <div class="content">
                        <p>${data.message}</p>
                        
                        <div class="info-box">
                            <p><strong>Código do Ativo:</strong> ${data.assetCode}</p>
                            <p><strong>Nome:</strong> ${data.assetName}</p>
                            ${data.manufacturer ? `<p><strong>Fabricante:</strong> ${data.manufacturer}</p>` : ''}
                            ${data.model ? `<p><strong>Modelo:</strong> ${data.model}</p>` : ''}
                            <p><strong>Próxima Manutenção:</strong> ${data.nextMaintenanceDate}</p>
                            ${data.isOverdue ? `<p style="color: #dc2626; font-weight: bold;">⚠️ Atrasada há ${data.daysOverdue} dias</p>` : `<p><strong>Faltam:</strong> ${data.daysUntilMaintenance} dias</p>`}
                        </div>

                        <p style="margin-top: 30px;">
                            <a href="${data.systemUrl || 'https://seu-dominio.com'}" class="button">
                                Acessar Sistema
                            </a>
                        </p>
                    </div>
                    <div class="footer">
                        <p><strong>Op.Intel</strong> - Plataforma de Inteligência Operacional</p>
                        <p>Este é um email automático. Por favor, não responda.</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    if (type === 'MONTHLY_REPORT') {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    ${baseStyle}
                    .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); }
                    .info-box { border-left-color: #2563eb; }
                    .info-box strong { color: #2563eb; }
                    .button { background: #2563eb; }
                    .stats-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 15px;
                        margin: 20px 0;
                    }
                    .stat-card {
                        background: #f9fafb;
                        padding: 15px;
                        border-radius: 8px;
                        text-align: center;
                    }
                    .stat-number {
                        font-size: 32px;
                        font-weight: bold;
                        color: #2563eb;
                    }
                    .stat-label {
                        font-size: 14px;
                        color: #6b7280;
                        margin-top: 5px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="alert-icon">📊</div>
                        <h1>Relatório Mensal - Op.Intel</h1>
                        <p style="margin: 5px 0 0 0; opacity: 0.9;">${data.period || new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div class="content">
                        <h2>Resumo Executivo</h2>
                        
                        <div class="stats-grid">
                            <div class="stat-card">
                                <div class="stat-number">${data.totalEvents || 0}</div>
                                <div class="stat-label">Total de Eventos</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-number">${data.totalAssets || 0}</div>
                                <div class="stat-label">Ativos Cadastrados</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-number">${data.healthyAssets || 0}</div>
                                <div class="stat-label">Ativos Saudáveis</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-number">${data.nonConformities || 0}</div>
                                <div class="stat-label">Não Conformidades</div>
                            </div>
                        </div>

                        <p style="margin-top: 30px;">
                            <a href="${data.reportUrl || data.systemUrl || 'https://seu-dominio.com'}" class="button">
                                Ver Relatório Completo
                            </a>
                        </p>
                    </div>
                    <div class="footer">
                        <p><strong>Op.Intel</strong> - Plataforma de Inteligência Operacional</p>
                        <p>Este é um email automático. Por favor, não responda.</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    // Template genérico
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>${baseStyle}</style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Op.Intel</h1>
                </div>
                <div class="content">
                    ${data.body || data.html || ''}
                </div>
                <div class="footer">
                    <p><strong>Op.Intel</strong> - Plataforma de Inteligência Operacional</p>
                    <p>Este é um email automático. Por favor, não responda.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

serve(async (req: any) => {
    try {
        const { to, subject, type, data } = await req.json();

        // Validação de entrada
        if (!to || !subject) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields: to, subject' }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Gerar HTML baseado no tipo
        const emailHtml = getEmailTemplate(type || 'GENERIC', data || {});

        // Enviar email via Resend
        const result = await resend.emails.send({
            from: 'Op.Intel <onboarding@resend.dev>',
            to: Array.isArray(to) ? to : [to],
            subject: subject,
            html: emailHtml,
        });

        console.log('Email sent successfully:', { to, subject, type });

        return new Response(JSON.stringify({ success: true, data: result }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: any) {
        console.error('Error sending email:', error);

        return new Response(JSON.stringify({
            error: error.message || 'Failed to send email',
            details: error.toString()
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});
