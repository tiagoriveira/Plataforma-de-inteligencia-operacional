# Guia de Onboarding - Op.Intel
## Plataforma de Inteligência Operacional

**Versão:** 1.0  
**Última Atualização:** 04 de Dezembro de 2025  
**Objetivo:** Preparar o sistema para uso em produção com dados reais

---

## 📋 Pré-requisitos

Antes de iniciar o processo de onboarding, certifique-se de ter:

- [ ] Acesso ao Supabase Dashboard do projeto
- [ ] Credenciais de administrador do sistema
- [ ] API Key do Resend configurada (para emails)
- [ ] URLs e domínios definidos
- [ ] Lista de ativos físicos a serem cadastrados
- [ ] Lista de operadores que terão acesso ao sistema

---

## 🚀 Passo 1: Limpar Dados Demo

⚠️ **ATENÇÃO:** Esta operação é **IRREVERSÍVEL** e deleta **TODOS** os dados do sistema. Execute apenas uma vez ao preparar o sistema para produção.

### Opção 1: Via Supabase Dashboard (Recomendado)

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Navegue até **SQL Editor**
4. Execute o seguinte comando:

```sql
SELECT * FROM clean_demo_data();
```

5. Verifique o resultado:
   - `deleted_events`: Número de eventos removidos
   - `deleted_assets`: Número de ativos removidos
   - `deleted_logs`: Número de logs removidos
   - `message`: Mensagem de confirmação

### Opção 2: Via Interface Admin (em desenvolvimento)

1. Faça login como administrador
2. Acesse `/admin/settings`
3. Role até a seção "Gerenciamento de Dados"
4. Clique em "Limpar Dados Demo"
5. Digite `DELETAR TUDO` para confirmar
6. Aguarde a confirmação

### Verificação

Execute para confirmar que as tabelas estão vazias:

```sql
SELECT COUNT(*) FROM events;   -- Deve retornar 0
SELECT COUNT(*) FROM assets;   -- Deve retornar 0
```

---

## 👤 Passo 2: Criar Primeiro Usuário Admin

### 2.1 Registrar Novo Usuário

1. Acesse a URL do sistema: `https://seu-dominio.com/register`
2. Preencha o formulário de registro:
   - **Email:** email-do-admin@empresa.com
   - **Senha:** (senha forte com pelo menos 8 caracteres)
   - **Confirmar Senha:** (mesma senha)
   - **PIN:** 4 dígitos únicos (ex: 1234)
   - **Confirmar PIN:** (mesmo PIN)

3. Clique em "Criar Conta"
4. Verifique o email de confirmação (se configurado)

### 2.2 Atualizar Role para Admin

Como o sistema define novos usuários como `operator` por padrão, você precisa atualizar manualmente o primeiro usuário para `admin`:

1. Acesse **Supabase Dashboard** → **SQL Editor**
2. Execute o comando:

```sql
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'email-do-admin@empresa.com';
```

3. Verifique se foi atualizado:

```sql
SELECT email, raw_user_meta_data->>'role' as role
FROM auth.users
WHERE email = 'email-do-admin@empresa.com';
```

### 2.3 Testar Login Admin

1. Acesse `/login`
2. Faça login com o email e senha cadastrados
3. Insira o PIN de 4 dígitos
4. Confirme que você foi redirecionado para o dashboard
5. Teste acesso a `/admin` (deve funcionar)

---

## ⚙️ Passo 3: Configurar Sistema

### 3.1 Configurações Globais

1. Faça login como administrador
2. Acesse `/admin/settings`
3. Configure as seguintes opções:

| Configuração | Valor Recomendado | Descrição |
|--------------|-------------------|-----------|
| **Email de Notificações** | admin@empresa.com | Email que receberá alertas de não conformidades |
| **Intervalo de Manutenção Padrão** | 90 dias | Intervalo padrão para manutenções preventivas |
| **Dias até Negligenciado** | 30 dias | Ativos sem uso por este período serão sinalizados |
| **Nome da Empresa** | Sua Empresa Ltda | Nome exibido nos relatórios |

4. Clique em "Salvar Configurações"

### 3.2 Configurar Email (Resend)

Se você ainda não configurou o Resend:

1. Crie uma conta em [Resend.com](https://resend.com)
2. Obtenha sua API Key
3. No Supabase Dashboard:
   - Navegue até **Edge Functions** → **Secrets**
   - Adicione: `RESEND_API_KEY` = `sua_api_key`
4. Teste enviando uma não conformidade e verificando se o email chegou

---

## 📦 Passo 4: Cadastrar Ativos Reais

### 4.1 Preparar Lista de Ativos

Antes de cadastrar, prepare uma planilha com:
- Nome do ativo
- Código único (ex: TOR-001, FRE-001)
- Localização física
- Fabricante e modelo
- Instruções de operação
- Intervalo de manutenção (em dias)

### 4.2 Cadastrar no Sistema

1. Acesse `/assets`
2. Clique em "Novo Ativo"
3. Preencha os campos:
   - **Código:** Código único alfanumérico (ex: TOR-001)
   - **Nome:** Nome descritivo (ex: Torno CNC Modelo X)
   - **Categoria:** Selecione ou crie categoria
   - **Localização:** Local físico (ex: Galpão A - Setor 2)
   - **Fabricante:** Nome do fabricante
   - **Modelo:** Modelo exato
   - **Ano:** Ano de fabricação
   - **Instruções:** Instruções de operação e segurança
   - **Intervalo de Manutenção:** Dias entre manutenções (ex: 90)
   - **Foto:** (opcional) Foto do ativo

4. Clique em "Salvar"

### 4.3 Gerar e Imprimir QR Codes

1. Após cadastrar o ativo, acesse a página do ativo
2. Clique em "Imprimir Etiqueta QR"
3. Imprima a etiqueta em papel adesivo resistente
4. Cole a etiqueta no ativo físico em local visível
5. Teste o QR Code com o scanner do sistema

### 4.4 Dica: Cadastro em Lote

Para cadastrar vários ativos de uma vez:
1. Prepare uma planilha CSV com os dados
2. Use a ferramenta de importação (em desenvolvimento)
3. Ou cadastre manualmente os ativos mais críticos primeiro

---

## 👥 Passo 5: Criar Usuários Operadores

### 5.1 Via Interface Admin

1. Acesse `/admin/users`
2. Clique em "Novo Usuário"
3. Preencha:
   - **Nome completo:** Nome do operador
   - **Email corporativo:** email@empresa.com
   - **PIN:** 4 dígitos únicos para cada operador
   - **Role:** Deixe como "Operator" (padrão)

4. Clique em "Criar Usuário"
5. O operador receberá um email com credenciais

### 5.2 Via Registro Direto

Alternativamente, cada operador pode:
1. Acessar `/register`
2. Preencher o formulário
3. Aguardar aprovação do admin (se configurado)

### 5.3 Gerenciar PINs

⚠️ **IMPORTANTE:** Cada operador deve ter um PIN único de 4 dígitos.

Mantenha uma lista segura de PINs:
| Nome | Email | PIN |
|------|-------|-----|
| João Silva | joao@empresa.com | 1234 |
| Maria Santos | maria@empresa.com | 5678 |

---

## 🎓 Passo 6: Treinamento de Operadores

### 6.1 Apresentação Inicial (15 min)

1. **Objetivo do sistema:**
   - Rastreamento de ativos
   - Registro de eventos
   - Prevenção de problemas

2. **Demonstração do fluxo:**
   - Login via PIN (mostrar tela de PIN)
   - Scanner de QR Code
   - Registro de eventos

### 6.2 Tutorial Prático (30 min)

Para cada operador, demonstre:

**1. Login:**
   - Acessar o sistema
   - Inserir PIN de 4 dígitos
   - Navegar pelo dashboard

**2. Scanner QR Code:**
   - Acessar scanner (`/scanner`)
   - Escanear QR Code de um ativo
   - Visualizar informações do ativo

**3. Registrar Evento:**
   - Selecionar tipo de evento:
     - **Check-in:** Início de uso do ativo
     - **Check-out:** Fim de uso do ativo
     - **Inspeção:** Inspeção visual
     - **Manutenção:** Manutenção preventiva/corretiva
     - **Problema:** Reportar problema
     - **Problema Grave (Não Conformidade):** Requer foto obrigatória
   - Tirar foto (se aplicável)
   - Adicionar observação
   - Confirmar registro

**4. Não Conformidade (Importante!):**
   - Foto é **obrigatória**
   - Descrição clara do problema
   - Sistema enviará email automático para admin

### 6.3 Material de Apoio

Crie e distribua:
- Guia rápido impresso (1 página)
- Vídeo tutorial (5 min)
- FAQ de dúvidas comuns
- Contato para suporte

### 6.4 Teste Final

Peça para cada operador:
1. Fazer login
2. Escanear QR Code
3. Registrar evento de teste
4. Fazer logout

---

## 📊 Passo 7: Monitoramento e Manutenção

### 7.1 Monitoramento Diário

Como administrador, verifique diariamente:

1. **Dashboard Principal** (`/`)
   - Total de eventos do mês
   - Ativos saudáveis vs. negligenciados
   - Gráficos de distribuição

2. **Não Conformidades**
   - Revisar alertas por email
   - Acessar `/reports` para detalhes
   - Acompanhar resolução

3. **Logs de Auditoria** (`/admin/logs`)
   - Atividades suspeitas
   - Mudanças em configurações
   - Padrões de uso

### 7.2 KPIs Importantes

Acompanhe semanalmente:

| KPI | Meta | Como Acompanhar |
|-----|------|-----------------|
| Taxa de Conformidade | > 95% | Dashboard principal |
| Ativos Negligenciados | < 5% | Dashboard principal |
| Tempo Médio de Resposta | < 24h | Relatórios mensais |
| Eventos por Ativo | ≥ 3/mês | Top 5 ativos |

### 7.3 Relatórios Mensais

1. No dia 1º de cada mês:
   - Verificar email com relatório automático
   - Acessar `/reports` para visualização detalhada
   - Baixar PDF para arquivo

2. Revisar:
   - Total de eventos
   - Ativos mais/menos utilizados
   - Não conformidades
   - Tendências

3. Compartilhar com stakeholders

### 7.4 Manutenção Preventiva

Mensalmente:
- [ ] Revisar lista de ativos negligenciados
- [ ] Verificar necessidade de manutenções preventivas
- [ ] Atualizar instruções de ativos se necessário
- [ ] Treinar novos operadores
- [ ] Backup de dados (automático no Supabase)

---

## 🆘 Suporte e Troubleshooting

### Problemas Comuns

**1. Operador esqueceu o PIN**
- Admin acessa `/admin/users`
- Reseta PIN do operador
- Enviado novo PIN por email

**2. QR Code não funciona**
- Verificar se etiqueta está legível
- Reimprimir etiqueta
- Testar com diferentes câmeras

**3. Email não chega**
- Verificar configuração do Resend
- Checar spam
- Verificar email em system_settings

**4. Foto não faz upload**
- Verificar conexão de internet
- Reduzir tamanho da foto (< 5MB)
- Tentar novamente

### Contatos

**Documentação Técnica:** 
- [HANDOFF-DOCUMENTATION.md](./HANDOFF-DOCUMENTATION.md) (em desenvolvimento)
- [ACTION-PLAN.md](./ACTION-PLAN.md)
- [AUDIT-REPORT.md](./AUDIT-REPORT.md)

**Suporte Técnico:**
- Email: suporte@empresa.com
- Slack: #op-intel-suporte
- Telefone: (XX) XXXX-XXXX

**Repository:**
- GitHub: https://github.com/tiagoriveira/Plataforma-de-inteligencia-operacional
- Issues: https://github.com/tiagoriveira/Plataforma-de-inteligencia-operacional/issues

---

## ✅ Checklist Final de Onboarding

Antes de considerar o onboarding completo, confirme:

### Configuração
- [ ] Dados demo foram limpos
- [ ] Primeiro usuário admin criado e testado
- [ ] Configurações globais definidas
- [ ] Resend configurado e testando
- [ ] Domínio/URL configurado

### Ativos
- [ ] Pelo menos 5 ativos reais cadastrados
- [ ] QR Codes impressos e colados
- [ ] QR Codes testados com scanner

### Usuários
- [ ] Todos os operadores cadastrados
- [ ] PINs únicos definidos
- [ ] Treinamento realizado
- [ ] Teste prático concluído

### Monitoramento
- [ ] Dashboard acessível e funcionando
- [ ] Primeiro evento real registrado
- [ ] Email de não conformidade testado
- [ ] Relatório mensal configurado

### Documentação
- [ ] Guia rápido impresso distribuído
- [ ] Contatos de suporte definidos
- [ ] FAQ criado

---

**Onboarding concluído em:** ____ / ____ / ________  
**Admin responsável:** _________________________________  
**Próxima revisão:** Após 30 dias de uso

---

🎉 **Parabéns!** Seu sistema Op.Intel está pronto para uso em produção!
