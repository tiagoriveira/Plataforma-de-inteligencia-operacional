# Documentação de Handoff - Op.Intel
## Plataforma de Inteligência Operacional

**Versão do Sistema:** 1.2 + Sprint 1 + Sprint 2  
**Data:** 04 de Dezembro de 2025  
**Responsável:** Manus AI Agent  
**Tipo de Documento:** Documentação Técnica  

---

## 1. Visão Geral do Sistema

### 1.1 Objetivo

O **Op.Intel** (Operational Intelligence) é uma plataforma web progressiva (PWA) desenvolvida para rastreamento e gerenciamento de ativos operacionais. O sistema permite:

- Cadastro e gerenciamento de ativos físicos (equipamentos, máquinas, ferramentas)
- Rastreamento via QR Code
- Registro de eventos operacionais (check-in, check-out, manutenções, problemas)
- Monitoramento em tempo real através de dashboards
- Geração de relatórios e KPIs
- Sistema de notificações via email
- Controle de acesso baseado em roles (admin/operator)

### 1.2 Público-Alvo

**Usuários Primários:**
- Operadores de chão de fábrica/campo
- Supervisores operacionais
- Gerentes de manutenção

**Administradores:**
- Gestores de TI
- Administradores do sistema
- Analistas de dados operacionais

### 1.3 Principais Funcionalidades

| Funcionalidade | Versão | Descrição |
|----------------|--------|-----------|
| Cadastro de Ativos | v1.0 | CRUD completo de ativos com QR Code |
| Scanner QR Code | v1.0 | Leitura de QR Code via câmera |
| Registro de Eventos | v1.0 | Check-in, Check-out, Manutenções, Problemas |
| Dashboard | v1.0 | KPIs e gráficos em tempo real |
| Relatórios PDF | v1.0 | Geração de relatórios mensais |
| Foto Obrigatória | v1.1 | Fotos obrigatórias para não conformidades |
| Inteligência Semântica | v1.1 | Padronização automática de textos |
| Dashboard Admin | v1.2 | Painel administrativo completo |
| Sistema de Roles | Sprint 1 | Admin vs Operator com RLS |
| Autenticação PIN | Sprint 1 | Login via PIN de 4 dígitos |
| Emails Profissionais | Sprint 2 | Templates HTML para notificações |

---

## 2. Arquitetura Técnica

### 2.1 Stack Tecnológica

#### Frontend
- **Framework:** React 19.1.1 com TypeScript 5.9.3
- **Build Tool:** Vite 7.1.7
- **Roteamento:** Wouter 3.3.5
- **Estilização:** Tailwind CSS 4.1.14 + Radix UI
- **State Management:** React Query (@tanstack/react-query 5.90.2)
- **Formulários:** React Hook Form 7.64.0 + Zod 4.1.12
- **Notificações:** Sonner 2.0.7

#### Backend (Supabase)
- **Database:** PostgreSQL (via Supabase)
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage
- **Edge Functions:** Deno (TypeScript)
- **Real-time:** Supabase Realtime

#### Serviços Externos
- **Email:** Resend API
- **QR Code:** html5-qrcode 2.3.8
- **PDF Generation:** jsPDF 3.0.4 + html2canvas 1.4.1

### 2.2 Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React + Vite)                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Pages   │  │Components│  │  Hooks   │  │  Utils   │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       └────────────┬┴────────────┬┴──────────────┘         │
│                    │  Supabase  │                           │
│                    │  JS Client │                           │
└────────────────────┴────────────┴───────────────────────────┘
                     │            │
                     ▼            ▼
┌─────────────────────────────────────────────────────────────┐
│                   SUPABASE (Backend as a Service)           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │PostgreSQL│  │   Auth   │  │ Storage  │  │ Realtime │   │
│  │    +     │  │  (JWT)   │  │  (S3)    │  │ (WebSocket)│ │
│  │   RLS    │  │          │  │          │  │          │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Edge Functions (Deno)                      │  │
│  │  - send-email-notification                           │  │
│  │  - generate-monthly-report                           │  │
│  │  - admin-actions                                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              SERVIÇOS EXTERNOS                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │  Resend  │  │  (Futuro)│  │  (Futuro)│                 │
│  │  (Email) │  │Google Maps│ │Analytics │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Fluxo de Dados

1. **Usuário** acessa aplicação React via navegador
2. **Frontend** faz autenticação via Supabase Auth (JWT)
3. **React Query** gerencia cache e sincronização de dados
4. **Supabase Client** se comunica com PostgreSQL via PostgREST
5. **RLS Policies** filtram dados baseado em `auth.uid()` e `role`
6. **Edge Functions** processam lógica serverless (emails, relatórios)
7. **Storage** armazena fotos e arquivos
8. **Realtime** (futuro) notifica mudanças em tempo real

---

## 3. Banco de Dados

### 3.1 Schema Completo

#### Tabela: `assets`

```sql
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  location TEXT,
  manufacturer TEXT,
  model TEXT,
  year INTEGER,
  serial_number TEXT,
  photo_url TEXT,
  instructions TEXT,
  maintenance_interval_days INTEGER DEFAULT 90,
  last_maintenance_date DATE,
  qr_code TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Tabela: `events`

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  operator TEXT,
  observation TEXT,
  photo_url TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Tabela: `audit_logs`

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Tabela: `system_settings`

```sql
CREATE TABLE system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3.2 Índices Criados

```sql
CREATE INDEX idx_assets_code ON assets(code);
CREATE INDEX idx_assets_user_id ON assets(user_id);
CREATE INDEX idx_events_asset_id ON events(asset_id);
CREATE INDEX idx_events_created_at ON events(created_at);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

### 3.3 Funções PostgreSQL

#### `verify_my_pin(pin_input TEXT) → BOOLEAN`

Valida PIN do usuário atual.

```sql
CREATE OR REPLACE FUNCTION verify_my_pin(pin_input TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'pin' = pin_input
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### `get_user_role(user_id UUID) → TEXT`

Retorna role do usuário.

```sql
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT raw_user_meta_data->>'role'
    FROM auth.users
    WHERE id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### `is_admin(user_id UUID) → BOOLEAN`

Verifica se usuário é admin.

```sql
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT raw_user_meta_data->>'role' = 'admin'
    FROM auth.users
    WHERE id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### `get_all_users() → TABLE`

Lista todos os usuários (apenas admins).

```sql
CREATE OR REPLACE FUNCTION get_all_users()
RETURNS TABLE(id UUID, email TEXT, created_at TIMESTAMP WITH TIME ZONE, metadata JSONB) AS $$
BEGIN
  IF (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) != 'admin' THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  RETURN QUERY 
  SELECT u.id, u.email, u.created_at, u.raw_user_meta_data::jsonb
  FROM auth.users u
  ORDER BY u.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### `clean_demo_data() → TABLE`

Remove todos os dados demo (apenas admins).

```sql
CREATE OR REPLACE FUNCTION clean_demo_data()
RETURNS TABLE(deleted_events INTEGER, deleted_assets INTEGER, deleted_logs INTEGER, message TEXT) AS $$
DECLARE
  v_events_count INTEGER;
  v_assets_count INTEGER;
  v_logs_count INTEGER;
BEGIN
  IF (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) != 'admin' THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  DELETE FROM events WHERE id IS NOT NULL;
  GET DIAGNOSTICS v_events_count = ROW_COUNT;

  DELETE FROM assets WHERE id IS NOT NULL;
  GET DIAGNOSTICS v_assets_count = ROW_COUNT;

  DELETE FROM audit_logs WHERE id IS NOT NULL;
  GET DIAGNOSTICS v_logs_count = ROW_COUNT;

  RETURN QUERY SELECT v_events_count, v_assets_count, v_logs_count, 'Demo data cleaned successfully'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3.4 Políticas RLS (Row Level Security)

#### Assets

```sql
-- SELECT
CREATE POLICY "Users can view own assets"
ON assets FOR SELECT
USING (auth.uid() = user_id);

-- INSERT
CREATE POLICY "Users can create own assets"
ON assets FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- UPDATE
CREATE POLICY "Users can update own assets"
ON assets FOR UPDATE
USING (auth.uid() = user_id);

-- DELETE
CREATE POLICY "Users can delete own assets"
ON assets FOR DELETE
USING (auth.uid() = user_id);
```

#### Events

```sql
-- SELECT
CREATE POLICY "Users can view own events"
ON events FOR SELECT
USING (auth.uid() = user_id);

-- INSERT
CREATE POLICY "Users can create own events"
ON events FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

#### Audit Logs

```sql
-- SELECT (Admins)
CREATE POLICY "Admins can view all logs"
ON audit_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'role' = 'admin'
  )
);

-- SELECT (Users)
CREATE POLICY "Users can view own logs"
ON audit_logs FOR SELECT
USING (auth.uid() = user_id);
```

#### System Settings

```sql
-- SELECT (Everyone)
CREATE POLICY "Everyone can read settings"
ON system_settings FOR SELECT
USING (true);

-- UPDATE (Admins only)
CREATE POLICY "Only admins can update settings"
ON system_settings FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'role' = 'admin'
  )
);

-- INSERT (Admins only)
CREATE POLICY "Only admins can insert settings"
ON system_settings FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'role' = 'admin'
  )
);

-- DELETE (Admins only)
CREATE POLICY "Only admins can delete settings"
ON system_settings FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'role' = 'admin'
  )
);
```

---

## 4. Autenticação e Autorização

### 4.1 Fluxo de Login via PIN

```
1. Usuário acessa / → Redireciona para /pin-login
2. Se não há sessão → Redireciona para /login (email/senha)
3. Login com email/senha → Cria sessão JWT → Redireciona para /pin-login
4. Usuário insere PIN de 4 dígitos
5. Frontend chama supabase.rpc('verify_my_pin', { pin_input: '1234' })
6. Se PIN correto → Desbloqueia sessão → Redireciona para /
7. Se PIN incorreto → Mostra erro → Permanece em /pin-login
8. Logout → signOut() → Redireciona para /pin-login
```

### 4.2 Sistema de Roles

**Roles Disponíveis:**
- `admin`: Acesso total ao sistema, incluindo área administrativa
- `operator`: Acesso apenas às funcionalidades operacionais

**Armazenamento:**
```json
// auth.users.raw_user_meta_data
{
  "role": "admin",
  "pin": "1234"
}
```

**Verificação no Frontend:**

```typescript
// AdminRoute.tsx
const role = user.user_metadata?.role;
if (role !== 'admin') {
  navigate('/');
  return;
}
```

**Verificação no Backend (RLS):**

```sql
-- Exemplo de política RLS
raw_user_meta_data->>'role' = 'admin'
```

### 4.3 Rotas Protegidas

| Rota | Proteção | Quem Acessa |
|------|----------|-------------|
| `/` | PrivateRoute | Todos autenticados |
| `/assets` | PrivateRoute | Todos autenticados |
| `/scanner` | PrivateRoute | Todos autenticados |
| `/reports` | PrivateRoute | Todos autenticados |
| `/admin` | AdminRoute | Apenas admin |
| `/admin/users` | AdminRoute | Apenas admin |
| `/admin/settings` | AdminRoute | Apenas admin |
| `/admin/logs` | AdminRoute | Apenas admin |

---

## 5. Funcionalidades Principais

### 5.1 Cadastro de Ativos

**Arquivo:** `client/src/pages/NewAsset.tsx`

**Fluxo:**
1. Usuário preenche formulário
2. Upload de foto (via Supabase Storage)
3. Geração automática de QR Code (base64)
4. Inserção no banco via `createAsset()`

**Código:**
```typescript
const handleSubmit = async (data) => {
  const photoUrl = await uploadPhoto(photoFile);
  const qrCode = await QRCode.toDataURL(assetCode);
  
  await createAsset({
    code: data.code,
    name: data.name,
    photo_url: photoUrl,
    qr_code: qrCode,
    // ...
  });
};
```

### 5.2 Scanner QR Code

**Arquivo:** `client/src/pages/Scanner.tsx`

**Biblioteca:** `html5-qrcode`

**Fluxo:**
1. Solicita acesso à câmera
2. Inicia scanner contínuo
3. Detecta QR Code
4. Busca ativo pelo código
5. Redireciona para `/assets/:code`

**Código:**
```typescript
const handleScan = async (decodedText) => {
  const asset = await getAssetByCode(decodedText);
  navigate(`/assets/${asset.code}`);
};
```

### 5.3 Registro de Eventos

**Arquivo:** `client/src/pages/QuickEvent.tsx`

**Tipos de Eventos:**
- `CHECKIN`: Check-in operacional
- `CHECKOUT`: Check-out operacional
- `INSPECTION`: Inspeção visual
- `ISSUE`: Reportar problema
- `NONCONFORMITY`: Problema grave (foto obrigatória)
- `IMPROVEMENT`: Sugestão de melhoria

**Validações:**
- Foto obrigatória para `NONCONFORMITY`
- Observação opcional para outros tipos

**Envio de Email (Sprint 2):**
```typescript
if (eventType === "NONCONFORMITY") {
  await sendNotificationEmail(assetName, observation, photoUrl);
}
```

### 5.4 Dashboard

**Arquivo:** `client/src/pages/Home.tsx`

**KPIs Exibidos:**
- Total de eventos do mês
- Ativos saudáveis (≥3 eventos/mês)
- Ativos negligenciados (>30 dias sem uso)
- Top 5 ativos mais utilizados
- Distribuição de eventos por tipo
- Não conformidades recentes

**Fonte de Dados:**
```typescript
const kpis = await getKPIs(); // client/src/lib/supabase.ts
```

### 5.5 Relatórios PDF

**Arquivo:** `client/src/pages/Reports.tsx`

**Bibliotecas:** `jsPDF` + `html2canvas`

**Fluxo:**
1. Renderiza relatório em HTML
2. Captura screenshot com `html2canvas`
3. Converte para PDF com `jsPDF`
4. Download automático

---

## 6. Integrações Externas

### 6.1 Supabase

**Credenciais:**
- URL: `https://omrodclevaidlijnnqeq.supabase.co`
- Anon Key: (configurado em `client/src/config/supabase.config.ts`)
- Service Role Key: (configurado em `server/lib/supabase.ts`)

**Funcionalidades Utilizadas:**
- **Auth:** Autenticação JWT
- **Database:** PostgreSQL com PostgREST
- **Storage:** Upload de fotos
- **Edge Functions:** send-email-notification, generate-monthly-report, admin-actions

### 6.2 Resend (Email)

**API Key:** Configurada em Supabase Edge Functions Secrets

**Edge Function:** `supabase/functions/send-email-notification/index.ts`

**Templates:**
- `NONCONFORMITY`: Email de alerta de não conformidade
- `MONTHLY_REPORT`: Relatório mensal com KPIs
- `GENERIC`: Template genérico

**Uso:**
```typescript
await supabase.functions.invoke('send-email-notification', {
  body: {
    to: 'admin@empresa.com',
    subject: '⚠️ Não Conformidade',
    type: 'NONCONFORMITY',
    data: { assetName, operator, observation, photoUrl }
  }
});
```

### 6.3 Google Maps (Futuro)

Planejado para v1.3:
- Mapa de localização de ativos
- Rastreamento em tempo real
- Rotas de manutenção

---

## 7. Deploy e CI/CD

### 7.1 Build de Produção

```bash
# Frontend
npm run build

# Backend (Edge Functions)
cd supabase/functions
supabase functions deploy
```

### 7.2 Variáveis de Ambiente

**Frontend (.env):**
```env
VITE_SUPABASE_URL=https://omrodclevaidlijnnqeq.supabase.co
VITE_SUPABASE_ANON_KEY=...
```

**Edge Functions (Supabase Secrets):**
```
SUPABASE_URL=https://omrodclevaidlijnnqeq.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
RESEND_API_KEY=...
```

### 7.3 Processo de Deploy

1. **Desenvolvimento Local:**
   - `npm run dev` (Frontend)
   - `supabase start` (Backend local)

2. **Staging:**
   - Deploy frontend para Vercel/Netlify
   - Deploy Edge Functions para Supabase

3. **Produção:**
   - Build otimizado (`npm run build`)
   - Deploy para CDN
   - Configurar domínio custom

### 7.4 Monitoramento

- **Logs de Edge Functions:** Supabase Dashboard → Logs
- **Errors:** Sentry (futuro)
- **Analytics:** Google Analytics (futuro)

---

## 8. Manutenção e Troubleshooting

### 8.1 Logs

**Frontend:**
- Logs do navegador (Console)
- React Query DevTools (em desenvolvimento)

**Backend:**
- Supabase Dashboard → Logs
- Edge Functions logs
- Database logs

### 8.2 Debugging

**Problemas Comuns:**

1. **"Cannot find name 'supabase'"**
   - Solução: Importar `supabase` de `@/lib/supabase`

2. **"Access denied: Admin role required"**
   - Solução: Verificar role do usuário em `auth.users.raw_user_meta_data`

3. **Email não chega**
   - Verificar Resend API Key
   - Checar logs da Edge Function
   - Verificar spam

4. **QR Code não escaneia**
   - Verificar permissões de câmera
   - Testar com diferentes browsers
   - Verificar iluminação

### 8.3 Migrações

Para aplicar novas migrações:

```bash
# Via Supabase CLI
supabase db push

# Via SQL Editor (manual)
# Copiar conteúdo de supabase/migrations/*.sql
# Executar no SQL Editor do Supabase Dashboard
```

### 8.4 Backup e Restore

**Backup:**
- Supabase faz backup automático diário
- Download manual via Dashboard → Database → Backups

**Restore:**
- Supabase Dashboard → Database → Backups → Restore

---

## 9. Roadmap Futuro

### Versão 1.3 (Planejado)
- [ ] Google Maps integration
- [ ] Rastreamento GPS de ativos móveis
- [ ] Notificações push (PWA)
- [ ] Modo offline completo
- [ ] Relatórios customizáveis

### Versão 2.0 (Planejado)
- [ ] Mobile apps nativos (iOS/Android)
- [ ] Integração com ERPs
- [ ] Machine Learning para previsão de falhas
- [ ] Dashboard em tempo real (WebSockets)
- [ ] Múltiplas empresas (multi-tenancy)

### Melhorias Técnicas
- [ ] Testes automatizados (Vitest)
- [ ] CI/CD com GitHub Actions
- [ ] Monitoramento com Sentry
- [ ] Analytics com Posthog
- [ ] Performance optimization

---

## 📞 Contatos e Suporte

**Documentação:**
- [README.md](./README.md)
- [ACTION-PLAN.md](./ACTION-PLAN.md)
- [ONBOARDING.md](./docs/ONBOARDING.md)
- [AUDIT-REPORT.md](./AUDIT-REPORT.md)

**Repositório:**
- GitHub: https://github.com/tiagoriveira/Plataforma-de-inteligencia-operacional
- Issues: https://github.com/tiagoriveira/Plataforma-de-inteligencia-operacional/issues

**Tech Lead:**
- Email: tiagosantosr59@gmail.com

---

**Última Atualização:** 04 de Dezembro de 2025  
**Versão do Documento:** 1.0  
**Autor:** Manus AI Agent  
**Próxima Revisão:** Após implementação de v1.3
