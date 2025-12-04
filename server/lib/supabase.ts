/**
 * Cliente Supabase para uso no servidor (backend)
 * 
 * Este cliente usa a service_role_key que tem permissões administrativas.
 * NUNCA exponha este cliente no frontend!
 */

import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '../../client/src/config/supabase.config';

// Cliente com permissões administrativas (service role)
export const supabaseAdmin = createClient(
    supabaseConfig.url,
    supabaseConfig.serviceRoleKey,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

// Cliente padrão (anon key) para operações normais no servidor
export const supabase = createClient(
    supabaseConfig.url,
    supabaseConfig.anonKey
);

export default supabaseAdmin;
