# TODO - Migração para Supabase

## FASE 1: Configuração Supabase
- [x] Listar projetos Supabase via MCP
- [x] Usar projeto existente: Plataforma-operacional-industrial (omrodclevaidlijnnqeq)
- [x] Obter credenciais (URL + anon key)
- [x] Configurar variáveis de ambiente no projeto

## FASE 2: Schema de Banco de Dados
- [x] Criar tabela `assets` (17 campos)
- [x] Criar tabela `events` (7 campos)
- [x] Configurar foreign key (events.asset_id → assets.id ON DELETE CASCADE)
- [x] Criar índices para otimização (6 índices totais)

## FASE 3: Integração Frontend
- [x] Instalar @supabase/supabase-js no projeto
- [x] Criar cliente Supabase em client/src/lib/supabase.ts
- [x] Criar helper functions (getAssets, createAsset, getEvents, createEvent, getKPIs)
- [x] Substituir localStorage por queries Supabase em Home.tsx
- [x] Substituir localStorage por queries Supabase em AssetsList.tsx
- [x] Substituir localStorage por queries Supabase em AssetDetail.tsx
- [x] Substituir localStorage por queries Supabase em QuickEvent.tsx
- [x] Substituir localStorage por queries Supabase em AuditLog.tsx
- [ ] Substituir localStorage por queries Supabase em Reports.tsx

## FASE 4: Migração de Dados
- [x] Popular tabela assets com dados iniciais (25 ativos)
- [x] Popular tabela events com histórico simulado (342 eventos)
- [x] Ajustar seed para 70% eventos no mês atual

## FASE 5: Row Level Security (RLS)
- [x] Habilitar RLS em assets e events
- [x] Criar políticas de leitura pública
- [x] Criar políticas de inserção pública
- [x] Criar políticas de atualização pública
- [ ] Validar integridade dos dados

## FASE 5: Autenticação
- [ ] Configurar Supabase Auth (email/password)
- [ ] Implementar tela de login
- [ ] Proteger rotas com autenticação
- [ ] Configurar Row Level Security (RLS)

## FASE 6: Validação
- [ ] Testar CRUD de ativos
- [ ] Testar registro de eventos
- [ ] Testar filtros e buscas
- [ ] Testar export CSV
- [ ] Testar geração de PDF
- [ ] Checkpoint final
