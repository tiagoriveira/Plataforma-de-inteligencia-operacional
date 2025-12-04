# Op.Intel - Plataforma de Inteligência Operacional

Sistema de rastreamento e inteligência operacional para gestão de ativos industriais.

## 🏗️ Arquitetura

**Frontend:** React 19 + TypeScript + Vite + TailwindCSS  
**Backend:** Supabase (PostgreSQL + Auth + Storage + Edge Functions)  
**Hospedagem:** Vercel (frontend) + Supabase (backend)

### ⚠️ Importante: Backend Exclusivamente Supabase

Este projeto **NÃO utiliza servidor Node.js customizado**. Toda a lógica de backend é implementada através de:

- **Supabase Database (PostgreSQL):** Tabelas, views, índices
- **Supabase Auth:** Autenticação e gerenciamento de usuários
- **Supabase Storage:** Armazenamento de arquivos (fotos, PDFs)
- **Supabase Edge Functions (Deno):** Lógica serverless
- **Supabase RLS (Row Level Security):** Controle de acesso

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 22+
- pnpm 10+
- Conta Supabase

### Instalação

```bash
# Clonar repositório
git clone https://github.com/tiagoriveira/Plataforma-de-inteligencia-operacional.git
cd Plataforma-de-inteligencia-operacional

# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais Supabase

# Iniciar servidor de desenvolvimento
pnpm dev
```

### Variáveis de Ambiente

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
```

## 📁 Estrutura do Projeto

```
Plataforma-de-inteligencia-operacional/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── contexts/         # Context API (Auth, etc)
│   │   ├── lib/              # Utilitários e configurações
│   │   ├── pages/            # Páginas da aplicação
│   │   └── App.tsx           # Componente raiz
│   └── index.html
├── supabase/                  # Backend Supabase
│   ├── functions/            # Edge Functions (Deno)
│   └── migrations/           # Migrações SQL
├── docs/                      # Documentação
│   ├── GUIA_DE_TESTES.md
│   ├── SPRINT1_REPORT.md
│   └── RESUMO_EXECUTIVO.md
├── ACTION-PLAN.md            # Plano de ação e roadmap
├── AUDIT-REPORT.md           # Relatório de auditoria
└── package.json
```

## 🗄️ Banco de Dados

### Tabelas Principais

- **assets** - Ativos industriais cadastrados
- **events** - Eventos de manutenção e operação
- **audit_logs** - Logs de auditoria do sistema
- **system_settings** - Configurações globais

### Migrações Aplicadas

1. `001_create_assets_table.sql` - Criação da tabela de ativos
2. `002_create_events_table.sql` - Criação da tabela de eventos
3. `003_enable_rls_policies.sql` - Habilitação de RLS
4. `004_admin_dashboard_setup.sql` - Setup do dashboard admin
5. `005_add_user_roles.sql` - Sistema de roles (admin/operator)
6. `006_fix_rls_policies.sql` - Correção de políticas RLS
7. `007_protect_get_all_users.sql` - Proteção de funções RPC
8. `008_clean_demo_data_function.sql` - Função de limpeza

## 👥 Sistema de Roles

### Admin
- Acesso completo ao sistema
- Gerenciamento de usuários
- Configurações globais
- Logs de auditoria

### Operator
- Registro de eventos
- Visualização de ativos
- Relatórios operacionais

## 🔐 Autenticação

O sistema utiliza **autenticação dupla**:

1. **Login tradicional** (email/senha) via Supabase Auth
2. **PIN de 4 dígitos** para acesso rápido em ambiente industrial

### Credenciais Padrão

**Admin:**
- Email: tiagosantosr59@gmail.com
- PIN: 1234

## 📊 Funcionalidades

### V1.0 - MVP
- ✅ Cadastro e gestão de ativos
- ✅ Registro de eventos (manutenção, inspeção, não conformidade)
- ✅ Scanner QR Code para identificação rápida
- ✅ Upload de fotos
- ✅ Dashboard com KPIs dinâmicos

### V1.1 - Melhorias
- ✅ Busca avançada e filtros
- ✅ Paginação de resultados
- ✅ Export para CSV
- ✅ Tutorial interativo (onboarding)

### V1.2 - Dashboard Admin
- ✅ Painel administrativo
- ✅ Gerenciamento de usuários
- ✅ Configurações globais
- ✅ Logs de auditoria

### Sprint 1 - Correções Críticas ✅
- ✅ Autenticação via PIN corrigida
- ✅ Sistema de Roles implementado
- ✅ Políticas RLS atualizadas

### Sprint 2 - Melhorias (Em Progresso)
- 🔄 Sistema de emails (Resend)
- 🔄 Onboarding para novos usuários
- 🔄 Documentação expandida

## 🧪 Testes

```bash
# Executar testes unitários
pnpm test

# Verificar tipos TypeScript
pnpm check

# Formatar código
pnpm format
```

### Testes de Validação

Consulte `docs/GUIA_DE_TESTES.md` para o guia completo com 18 testes documentados.

## 📦 Build e Deploy

```bash
# Build para produção
pnpm build

# Preview do build
pnpm preview
```

### Deploy Automático

O projeto está configurado para deploy automático via Vercel:
- Push para `main` → Deploy em produção
- Pull requests → Preview deployments

## 📚 Documentação

- **ACTION-PLAN.md** - Plano de ação e roadmap
- **AUDIT-REPORT.md** - Relatório de auditoria técnica
- **docs/GUIA_DE_TESTES.md** - Guia de testes (18 testes)
- **docs/SPRINT1_REPORT.md** - Relatório técnico Sprint 1
- **docs/RESUMO_EXECUTIVO.md** - Resumo executivo
- **docs/ONBOARDING.md** - Guia de onboarding

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.

## 👨‍💻 Autor

**Tiago Riveira**  
GitHub: [@tiagoriveira](https://github.com/tiagoriveira)

## 🆘 Suporte

Para dúvidas ou problemas:
1. Consulte a documentação em `docs/`
2. Abra uma issue no GitHub
3. Entre em contato via email

---

**Versão:** 1.2  
**Última atualização:** 04 de Dezembro de 2025
