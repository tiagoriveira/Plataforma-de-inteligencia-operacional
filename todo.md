# TODO - Correção de Escopo e Implementação v1.0 + v1.1 + v1.2

## FASE 1: REMOVER FUNCIONALIDADES FORA DO ESCOPO

### Remover Telas e Rotas
- [x] Remover tela AuditLog.tsx (histórico global) - MANTIDA conforme escopo MVP
- [x] Remover tela MaintenanceKanban.tsx
- [x] Remover tela MaintenanceKPIs.tsx
- [x] Remover tela Maintenance.tsx (lista de manutenção)
- [x] Simplificar Home.tsx (remover insights IA, estatísticas complexas)
- [x] Atualizar App.tsx removendo rotas fora do escopo

### Simplificar Navegação
- [x] Atualizar Layout.tsx removendo links para telas removidas
- [x] Manter apenas: Dashboard, Ativos, Scanner, Histórico (Log), Relatórios, Configurações

## FASE 2: IMPLEMENTAR PENDÊNCIAS V1.1

### Backend - Schema
- [x] Adicionar campo `instructions` (TEXT) em assets
- [x] Adicionar campos `maintenanceIntervalDays`, `lastMaintenanceDate` em assets
- [ ] Adicionar tipo "NÃO_CONFORME" ao enum event_type
- [ ] Criar constraint: foto obrigatória para NÃO_CONFORME
- [ ] Executar migration

### Backend - API
- [ ] Atualizar router assets para aceitar campo instructions
- [ ] Atualizar validação events: foto obrigatória se tipo = NÃO_CONFORME
- [ ] Criar endpoint export CSV: /api/export/csv?asset_id=X
- [ ] Criar query para detectar ativos precisando manutenção

### Frontend - Formulários
- [ ] Adicionar campo "Instruções" (textarea 500 chars) em NewAsset.tsx
- [ ] Adicionar campos "Intervalo de Manutenção (dias)" em NewAsset.tsx
- [ ] Adicionar tipo "Não Conforme" no dropdown de eventos
- [ ] Validar foto obrigatória quando tipo = "Não Conforme"
- [ ] Exibir instruções na ficha do ativo (AssetDetail.tsx)

### Frontend - Export
- [x] Adicionar botão "Exportar CSV" no histórico do ativo
- [x] Implementar download automático do CSV
- [x] Criar endpoint backend events.exportCSV

## FASE 3: IMPLEMENTAR V1.2

### Relatórios Automáticos
- [ ] Ler v1.2.txt para entender requisitos completos
- [ ] Implementar geração automática de relatórios semanais
- [ ] Implementar envio por email/notificação

## FASE 4: VALIDAÇÃO FINAL

- [ ] Testar fluxo operador: escanear QR → registrar ação < 10s
- [ ] Testar fluxo admin: cadastrar ativo → gerar QR → imprimir
- [ ] Testar histórico imutável por ativo
- [ ] Testar checklists executáveis
- [ ] Testar export CSV
- [ ] Validar conformidade total com documentação CTO
- [ ] Checkpoint final auditado

### Frontend - Formulários
- [x] Adicionar campo "Instruções" (textarea 500 chars) em NewAsset.tsx
- [x] Adicionar campos "Intervalo de Manutenção (dias)" em NewAsset.tsx
- [x] Adicionar tipo "Não Conforme" no dropdown de eventos (QuickEvent.tsx)
- [x] Validar foto obrigatória quando tipo = "Não Conforme" (client-side)
- [x] Atualizar AuditLog.tsx para suportar NONCONFORMITY
- [ ] Exibir instruções na ficha do ativo (AssetDetail.tsx)

### Frontend - Export
- [x] Adicionar botão "Exportar CSV" no histórico do ativo
- [x] Implementar download automático do CSV
- [x] Criar endpoint backend events.exportCSV

## FASE 3: IMPLEMENTAR V1.2

### Backend - Dashboard KPIs
- [ ] Criar endpoint /api/dashboard/kpis (3 KPIs principais)
- [ ] Implementar query para ativos negligenciados (>30 dias sem evento)
- [ ] Implementar query para distribuição de tipos de evento

### Frontend - Dashboard Minimalista
- [ ] Atualizar Home.tsx com 3 KPIs principais
- [ ] Adicionar gráfico de distribuição de eventos (últimos 30 dias)
- [ ] Adicionar lista de ativos negligenciados

### Backend - Relatórios PDF
- [ ] Criar endpoint /api/reports/generate-monthly
- [ ] Implementar geração de PDF com template HTML
- [ ] Configurar envio automático por email (1º dia útil do mês)
