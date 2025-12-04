// @ts-expect-error - Deno runtime imports
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-expect-error - Deno runtime imports
import { Resend } from "npm:resend@2.0.0";

// @ts-expect-error - Deno global
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req: any) => {
    try {
        const { to, subject, body } = await req.json();

        const data = await resend.emails.send({
            from: 'Op.Intel <onboarding@resend.dev>',
            to: [to],
            subject: subject,
            html: body.replace(/\n/g, '<br>'),
        });

        return new Response(JSON.stringify(data), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});
