// @ts-expect-error - Deno runtime imports
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-expect-error - Deno runtime imports
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// @ts-expect-error - Deno runtime imports
import { PDFDocument, StandardFonts, rgb } from 'https://cdn.skypack.dev/pdf-lib';

const supabase = createClient(
    // @ts-expect-error - Deno global
    Deno.env.get('SUPABASE_URL') ?? '',
    // @ts-expect-error - Deno global
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req: any) => {
    try {
        const now = new Date();
        const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstDayNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        // 1. Fetch KPIs (Simplified)
        const { count: totalEventos } = await supabase
            .from('events')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', firstDayCurrentMonth.toISOString())
            .lt('created_at', firstDayNextMonth.toISOString());

        const { count: totalAtivos } = await supabase
            .from('assets')
            .select('*', { count: 'exact', head: true });

        // 2. Generate PDF
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        let y = height - 50;

        page.drawText('Op.Intel - Relatório Mensal', { x: 50, y, font: titleFont, size: 24, color: rgb(0, 0, 0) });
        y -= 30;
        page.drawText(`Mês: ${now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`, { x: 50, y, font, size: 14 });

        y -= 50;
        page.drawText('Resumo Executivo', { x: 50, y, font: titleFont, size: 18 });
        y -= 30;
        page.drawText(`Total de Eventos: ${totalEventos || 0}`, { x: 50, y, font, size: 12 });
        y -= 20;
        page.drawText(`Total de Ativos: ${totalAtivos || 0}`, { x: 50, y, font, size: 12 });

        const pdfBytes = await pdfDoc.save();

        // 3. Upload to Storage
        const fileName = `${now.getFullYear()}-${now.getMonth() + 1}_report.pdf`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('monthly-reports')
            .upload(fileName, pdfBytes, { contentType: 'application/pdf', upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('monthly-reports')
            .getPublicUrl(fileName);

        // 4. Save to Database
        // Assuming single tenant for now, or fetch all users and generate for each. 
        // For MVP, we generate one global report or for the admin.
        // We'll skip saving to 'monthly_reports' table for now to keep it simple, or insert a dummy record.

        // 5. Send Email
        await supabase.functions.invoke('send-email-notification', {
            body: {
                to: 'tiagosantosr59@gmail.com',
                subject: `Relatório Mensal - ${now.toLocaleDateString('pt-BR', { month: 'long' })}`,
                body: `O relatório mensal foi gerado com sucesso.\n\nBaixe aqui: ${publicUrl}`
            }
        });

        return new Response(JSON.stringify({ success: true, url: publicUrl }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});
