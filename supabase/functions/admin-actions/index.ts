// @ts-expect-error - Deno runtime imports
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-expect-error - Deno runtime imports
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseAdmin = createClient(
    // @ts-expect-error - Deno global
    Deno.env.get('SUPABASE_URL') ?? '',
    // @ts-expect-error - Deno global
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req: any) => {
    try {
        // 1. Verify Admin Role
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'No authorization header' }), { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

        if (authError || !user) {
            return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
        }

        if (user.user_metadata?.role !== 'admin') {
            return new Response(JSON.stringify({ error: 'Unauthorized: Admin role required' }), { status: 403 });
        }

        // 2. Handle Action
        const { action, ...params } = await req.json();
        let result;

        switch (action) {
            case 'createUser':
                result = await supabaseAdmin.auth.admin.createUser({
                    email: params.email,
                    password: params.password,
                    user_metadata: { ...params.metadata, role: params.role || 'user' },
                    email_confirm: true
                });
                break;

            case 'updateUser':
                const updateAttributes: any = {
                    user_metadata: params.metadata
                };
                if (params.email) updateAttributes.email = params.email;
                if (params.password) updateAttributes.password = params.password;

                result = await supabaseAdmin.auth.admin.updateUserById(params.id, updateAttributes);
                break;

            case 'deleteUser':
                // Soft delete (ban)
                result = await supabaseAdmin.auth.admin.updateUserById(params.id, {
                    ban_duration: '876000h' // ~100 years
                });
                break;

            case 'restoreUser':
                result = await supabaseAdmin.auth.admin.updateUserById(params.id, {
                    ban_duration: '0s'
                });
                break;

            default:
                throw new Error(`Invalid action: ${action}`);
        }

        if (result.error) throw result.error;

        return new Response(JSON.stringify(result.data), {
            headers: { "Content-Type": "application/json" },
        });

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});
