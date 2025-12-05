# Deploy de Alertas Automáticos

## O Que Foi Implementado

✅ **Edge Function**: `check-maintenance-alerts`
- Verifica ativos que precisam de manutenção nos próximos 7 dias
- Identifica manutenções atrasadas
- Envia emails automáticos via `send-email-notification`

✅ **Template de Email**: Adicionado tipo `MAINTENANCE_ALERT`
- Email diferenciado para alertas normais (🔔 laranja)
- Email urgente para manutenções atrasadas (🚨 vermelho)

## Como Fazer o Deploy

### Opção 1: Via Dashboard do Supabase (Mais Fácil)

1. Acesse: https://supabase.com/dashboard/project/omrodclevaidlijnnqeq/functions

2. **Atualizar função existente** `send-email-notification`:
   - Copie o conteúdo de: `supabase/functions/send-email-notification/index.ts`
   - Cole no editor do dashboard
   - Clique em "Deploy"

3. **Criar nova função** `check-maintenance-alerts`:
   - Clique em "New Edge Function"
   - Nome: `check-maintenance-alerts`
   - Copie o conteúdo de: `supabase/functions/check-maintenance-alerts/index.ts`
   - Cole no editor
   - Clique em "Deploy"

### Opção 2: Via Supabase CLI

```bash
cd /home/ubuntu/Plataforma-de-inteligencia-operacional

# Login (se ainda não fez)
supabase login

# Link do projeto
supabase link --project-ref omrodclevaidlijnnqeq

# Deploy das funções
supabase functions deploy send-email-notification
supabase functions deploy check-maintenance-alerts
```

## Configurar Cron Job (Execução Diária)

### Via Dashboard

1. Acesse: https://supabase.com/dashboard/project/omrodclevaidlijnnqeq/database/extensions

2. Habilite a extensão `pg_cron` (se ainda não estiver habilitada)

3. Execute este SQL no SQL Editor:

```sql
-- Executar alertas todos os dias às 8h da manhã (horário de Brasília = UTC-3)
SELECT cron.schedule(
    'check-maintenance-alerts-daily',
    '0 11 * * *', -- 11h UTC = 8h BRT
    $$
    SELECT net.http_post(
        url := 'https://omrodclevaidlijnnqeq.supabase.co/functions/v1/check-maintenance-alerts',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
        ),
        body := '{}'::jsonb
    );
    $$
);
```

### Verificar Cron Jobs Ativos

```sql
SELECT * FROM cron.job;
```

### Remover Cron Job (se necessário)

```sql
SELECT cron.unschedule('check-maintenance-alerts-daily');
```

## Testar Manualmente

### Via Dashboard

1. Acesse: https://supabase.com/dashboard/project/omrodclevaidlijnnqeq/functions
2. Selecione `check-maintenance-alerts`
3. Clique em "Invoke Function"
4. Body: `{}`
5. Clique em "Send Request"

### Via cURL

```bash
curl -X POST \
  https://omrodclevaidlijnnqeq.supabase.co/functions/v1/check-maintenance-alerts \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tcm9kY2xldmFpZGxpam5ucWVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MjUwNjUsImV4cCI6MjA4MDIwMTA2NX0.J_Xwh_0aju6-bxGGAk7PxkfIs_5Vr4_01EVFECcpOpE" \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Variáveis de Ambiente Necessárias

Certifique-se de que estas variáveis estão configuradas nas Edge Functions:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY` (para envio de emails)

## Email de Destino

Atualmente configurado para: `tiagosantosr59@gmail.com`

Para alterar, edite a linha 75 em `check-maintenance-alerts/index.ts`:

```typescript
to: 'seu-email@dominio.com',
```

## Próximos Passos

1. ✅ Deploy das edge functions
2. ✅ Configurar cron job diário
3. ⏳ Testar com dados reais
4. ⏳ Adicionar múltiplos destinatários (admin emails)
5. ⏳ Integrar com WhatsApp (opcional)

## Logs e Monitoramento

Acesse os logs em:
https://supabase.com/dashboard/project/omrodclevaidlijnnqeq/logs/edge-functions

Filtre por:
- `check-maintenance-alerts`
- `send-email-notification`
