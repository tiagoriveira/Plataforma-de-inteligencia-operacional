/**
 * Configuração centralizada do Supabase
 * 
 * Este arquivo contém todas as credenciais e configurações necessárias
 * para conectar ao Supabase em todo o projeto.
 */

export const supabaseConfig = {
    // URL do projeto Supabase
    url: 'https://omrodclevaidlijnnqeq.supabase.co',

    // Chave pública (anon key) - usada no frontend
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tcm9kY2xldmFpZGxpam5ucWVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MjUwNjUsImV4cCI6MjA4MDIwMTA2NX0.J_Xwh_0aju6-bxGGAk7PxkfIs_5Vr4_01EVFECcpOpE',

    // Chave de serviço (service role) - NUNCA use no frontend, apenas no backend
    serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tcm9kY2xldmFpZGxpam5ucWVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDYyNTA2NSwiZXhwIjoyMDgwMjAxMDY1fQ.y-bo0689SC9hGx8MxPkWupiD2mL_fbv5gjjiAZp8DCE',
} as const;

// Validação das configurações
if (!supabaseConfig.url || !supabaseConfig.anonKey) {
    throw new Error('Configurações do Supabase incompletas. Verifique supabase.config.ts');
}
