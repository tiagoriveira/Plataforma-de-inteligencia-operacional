# Guia de Testes - Sprint 1

## Op.Intel - Plataforma de Inteligência Operacional

**Data:** 04 de Dezembro de 2025**Versão:** 1.2 + Sprint 1 Fixes

---

## 🚀 Como Executar o Projeto

### 1. Iniciar Servidor de Desenvolvimento

```bash
cd /home/ubuntu/Plataforma-de-inteligencia-operacional
pnpm dev
```

O servidor estará disponível em: `http://localhost:5173` (ou porta indicada no terminal )

### 2. Credenciais de Teste

**Usuário Administrador:**

- Email: `tiagosantosr59@gmail.com`

- Senha: (sua senha cadastrada)

- PIN: `1234`

- Role: `admin`

---

## 🧪 Testes de Autenticação via PIN

### Teste 1.1: Acesso Inicial

**Objetivo:** Verificar redirecionamento correto ao acessar a aplicação

**Passos:**

1. Abrir navegador em modo anônimo

1. Acessar `http://localhost:5173/`

1. **Resultado esperado:** Redireciona para `/pin-login`

1. **Resultado esperado:** Como não há sessão, redireciona para `/login`

**Status:** [ ] Passou [ ] Falhou

---

### Teste 1.2: Login com Email/Senha

**Objetivo:** Verificar autenticação tradicional

**Passos:**

1. Na página `/login`, inserir:
  - Email: `tiagosantosr59@gmail.com`
  - Senha: (sua senha )

1. Clicar em "Entrar"

1. **Resultado esperado:** Redireciona para `/pin-login`

1. **Resultado esperado:** Tela de PIN com 4 campos vazios

**Status:** [ ] Passou [ ] Falhou

---

### Teste 1.3: Autenticação via PIN Correto

**Objetivo:** Verificar login com PIN correto

**Passos:**

1. Na tela `/pin-login`, digitar PIN: `1234`

1. **Resultado esperado:** Auto-login ao completar 4 dígitos

1. **Resultado esperado:** Toast "Acesso autorizado!"

1. **Resultado esperado:** Redireciona para `/` (dashboard)

**Status:** [ ] Passou [ ] Falhou

---

### Teste 1.4: Autenticação via PIN Incorreto

**Objetivo:** Verificar rejeição de PIN incorreto

**Passos:**

1. Fazer logout

1. Fazer login novamente com email/senha

1. Na tela `/pin-login`, digitar PIN: `9999`

1. **Resultado esperado:** Toast "PIN incorreto"

1. **Resultado esperado:** Campos de PIN limpos

1. **Resultado esperado:** Permanece em `/pin-login`

**Status:** [ ] Passou [ ] Falhou

---

### Teste 1.5: Logout

**Objetivo:** Verificar redirecionamento após logout

**Passos:**

1. Estando autenticado no dashboard

1. Clicar no botão "Sair" (sidebar desktop)

1. **Resultado esperado:** Toast "Logout realizado com sucesso!"

1. **Resultado esperado:** Redireciona para `/pin-login`

**Status:** [ ] Passou [ ] Falhou

---

## 🔐 Testes de Sistema de Roles

### Teste 2.1: Acesso Admin ao Dashboard Administrativo

**Objetivo:** Verificar que admin pode acessar área administrativa

**Passos:**

1. Fazer login como admin ([tiagosantosr59@gmail.com](mailto:tiagosantosr59@gmail.com))

1. Autenticar com PIN 1234

1. Acessar `/admin` via sidebar ou URL direta

1. **Resultado esperado:** Dashboard administrativo carrega

1. **Resultado esperado:** Sem redirecionamentos

1. **Resultado esperado:** Conteúdo administrativo visível

**Status:** [ ] Passou [ ] Falhou

---

### Teste 2.2: Criar Usuário Operador

**Objetivo:** Verificar criação de novo usuário com role='operator'

**Passos:**

1. Fazer logout

1. Acessar `/register`

1. Preencher formulário:
  - Email: `operador@teste.com`
  - Senha: `teste123`
  - Confirmar Senha: `teste123`
  - PIN: `5678`
  - Confirmar PIN: `5678`

1. Clicar em "Criar Conta"

1. **Resultado esperado:** Toast "Conta criada! Verifique seu email para confirmar."

1. **Resultado esperado:** Redireciona para `/login`

**Status:** [ ] Passou [ ] Falhou

---

### Teste 2.3: Verificar Role do Operador no Banco

**Objetivo:** Confirmar que novo usuário tem role='operator'

**Passos:**

1. Executar query no Supabase:

```sql
SELECT email, raw_user_meta_data->>'role' as role, raw_user_meta_data->>'pin' as pin 
FROM auth.users 
WHERE email = 'operador@teste.com';
```

1. **Resultado esperado:**
  - email: `operador@teste.com`
  - role: `operator`
  - pin: `5678`

**Status:** [ ] Passou [ ] Falhou

---

### Teste 2.4: Operador Tenta Acessar Área Admin

**Objetivo:** Verificar que operador é bloqueado de acessar `/admin`

**Passos:**

1. Fazer login como operador ([operador@teste.com](mailto:operador@teste.com))

1. Autenticar com PIN 5678

1. Tentar acessar `/admin` via URL direta

1. **Resultado esperado:** Redireciona para `/` (dashboard)

1. **Resultado esperado:** Não exibe conteúdo administrativo

**Status:** [ ] Passou [ ] Falhou

---

### Teste 2.5: Operador Tenta Chamar get_all_users()

**Objetivo:** Verificar proteção da função RPC

**Passos:**

1. Logado como operador, abrir DevTools (F12)

1. No Console, executar:

```javascript
const { data, error } = await supabase.rpc('get_all_users');
console.log({ data, error });
```

1. **Resultado esperado:** `error` contém "Access denied: Admin role required"

1. **Resultado esperado:** `data` é null

**Status:** [ ] Passou [ ] Falhou

---

### Teste 2.6: Admin Chama get_all_users()

**Objetivo:** Verificar que admin pode listar usuários

**Passos:**

1. Fazer login como admin

1. Acessar `/admin/users`

1. **Resultado esperado:** Lista de usuários carrega

1. **Resultado esperado:** Exibe pelo menos 2 usuários (admin + operador)

1. **Resultado esperado:** Exibe emails, datas de criação

**Status:** [ ] Passou [ ] Falhou

---

## 📊 Testes de Dados Reais

### Teste 3.1: Dashboard Exibe KPIs do Supabase

**Objetivo:** Verificar que dashboard usa dados reais

**Passos:**

1. Fazer login e acessar `/` (dashboard)

1. Verificar cards de KPIs:
  - Total de Eventos (mês atual)
  - Ativos Saudáveis
  - Ativos Negligenciados

1. **Resultado esperado:** Números correspondem aos dados do Supabase

1. **Resultado esperado:** Nenhum valor mockado (ex: 999, 123, etc.)

**Verificação no Banco:**

```sql
-- Total de eventos do mês atual
SELECT COUNT(*) FROM events 
WHERE created_at >= date_trunc('month', CURRENT_DATE);

-- Total de ativos
SELECT COUNT(*) FROM assets;
```

**Status:** [ ] Passou [ ] Falhou

---

### Teste 3.2: Relatórios Exibem Dados Reais

**Objetivo:** Verificar que relatórios usam dados do Supabase

**Passos:**

1. Acessar `/reports`

1. Verificar seções:
  - Período (mês/ano atual)
  - Total de Eventos
  - Ativos Saudáveis
  - Top 5 Ativos Mais Utilizados
  - Não Conformidades

1. **Resultado esperado:** Dados correspondem ao banco

1. **Resultado esperado:** Nenhum dado hardcoded

**Status:** [ ] Passou [ ] Falhou

---

### Teste 3.3: Geração de PDF

**Objetivo:** Verificar geração de relatório em PDF

**Passos:**

1. Na página `/reports`, clicar em "Baixar PDF"

1. **Resultado esperado:** Toast "Gerando relatório PDF..."

1. **Resultado esperado:** Download inicia após processamento

1. **Resultado esperado:** PDF contém dados reais do relatório

1. **Resultado esperado:** Nome do arquivo: `relatorio-mensal-{mes}-{ano}.pdf`

**Status:** [ ] Passou [ ] Falhou

---

## 🔍 Testes de Políticas RLS

### Teste 4.1: Admin Vê Todos os Logs

**Objetivo:** Verificar que admin acessa todos os audit_logs

**Passos:**

1. Fazer login como admin

1. Acessar `/admin/logs`

1. **Resultado esperado:** Exibe logs de todos os usuários

1. **Resultado esperado:** Logs de diferentes user_id visíveis

**Status:** [ ] Passou [ ] Falhou

---

### Teste 4.2: Operador Vê Apenas Seus Logs

**Objetivo:** Verificar RLS filtra logs por user_id

**Passos:**

1. Fazer login como operador

1. Acessar `/audit-log` (logs do usuário)

1. **Resultado esperado:** Exibe apenas logs do operador

1. **Resultado esperado:** Não exibe logs de outros usuários

**Verificação no Banco:**

```sql
-- Como admin, ver todos os logs
SELECT * FROM audit_logs;

-- Como operador, ver apenas seus logs (simulação)
SELECT * FROM audit_logs WHERE user_id = '{operador_uuid}';
```

**Status:** [ ] Passou [ ] Falhou

---

### Teste 4.3: Admin Modifica System Settings

**Objetivo:** Verificar que admin pode alterar configurações

**Passos:**

1. Fazer login como admin

1. Acessar `/admin/settings`

1. Modificar configuração (ex: "Dias até negligenciado")

1. Salvar alterações

1. **Resultado esperado:** Toast "Configurações salvas com sucesso!"

1. **Resultado esperado:** Valor atualizado no banco

**Verificação no Banco:**

```sql
SELECT * FROM system_settings WHERE key = 'days_until_neglected';
```

**Status:** [ ] Passou [ ] Falhou

---

### Teste 4.4: Operador Não Pode Modificar Settings

**Objetivo:** Verificar RLS bloqueia UPDATE de operador

**Passos:**

1. Fazer login como operador

1. Tentar acessar `/admin/settings` (deve redirecionar)

1. Alternativamente, via DevTools:

```javascript
const { error } = await supabase
  .from('system_settings')

  .update({ value: '999' })
  .eq('key', 'days_until_neglected');
console.log(error);
```

1. **Resultado esperado:** Erro de permissão RLS

1. **Resultado esperado:** Valor não alterado no banco

**Status:** [ ] Passou [ ] Falhou

---

## 📋 Checklist Final

### Autenticação ✅

- [ ] Redirecionamento para `/pin-login` funciona

- [ ] Login com email/senha funciona

- [ ] PIN correto autentica

- [ ] PIN incorreto é rejeitado

- [ ] Logout redireciona corretamente

### Sistema de Roles ✅

- [ ] Admin acessa `/admin`

- [ ] Operador é bloqueado de `/admin`

- [ ] Novo usuário recebe role='operator'

- [ ] Função `get_all_users()` protegida

- [ ] AdminRoute verifica role corretamente

### Dados Reais ✅

- [ ] Dashboard exibe KPIs do Supabase

- [ ] Relatórios exibem dados reais

- [ ] PDF gerado com dados corretos

- [ ] Nenhum dado mockado visível

### Políticas RLS ✅

- [ ] Admin vê todos os logs

- [ ] Operador vê apenas seus logs

- [ ] Admin modifica system_settings

- [ ] Operador não modifica system_settings

---

## 🐛 Registro de Bugs

### Bug #1

**Descrição:****Passos para reproduzir:****Resultado esperado:****Resultado obtido:****Severidade:** [ ] Crítico [ ] Alto [ ] Médio [ ] Baixo

---

## 📊 Resumo dos Testes

**Total de testes:** 17**Testes passados:** ___**Testes falhados:** ___**Taxa de sucesso:** ____%

**Observações:**

---

**Testado por:** _________________**Data:** _________________**Assinatura:** _________________

