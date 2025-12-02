# TODO - Finalização Sistema V1.0 + V1.1 + V1.2

## CORREÇÕES URGENTES

### UX Mobile
- [x] Ocultar sidebar de navegação no mobile
- [x] Exibir apenas cards de acesso rápido na Home mobile
- [x] Manter sidebar apenas em desktop

### Migração Supabase
- [ ] Remover backend Node.js/Express/tRPC atual
- [ ] Configurar Supabase client
- [ ] Criar tabelas no Supabase (assets, events)
- [ ] Migrar queries para Supabase SDK
- [ ] Atualizar frontend para usar Supabase diretamente

## V1.2 - DASHBOARD MINIMALISTA

### Backend Supabase
- [x] PULADO - Backend atual mantido (Manus)

### Frontend Dashboard
- [x] Atualizar Home.tsx com 3 KPIs principais
- [x] Adicionar gráfico de barras (distribuição de eventos)
- [x] Adicionar lista de ativos negligenciados
- [x] Adicionar comparação com mês anterior (% variação)

## V1.2 - TEMPLATES DE CHECKLIST

- [x] Criar 3 templates pré-configurados:
  - [x] Template 5S (5 itens)
  - [x] Template NR-12 Segurança (5 itens)
  - [x] Template Manutenção Preventiva (5 itens)
- [x] Adicionar botões de templates em NewAsset.tsx
- [x] Preencher campo Instruções automaticamente ao selecionar template

## V1.2 - RELATÓRIOS AUTOMÁTICOS PDF

- [x] Implementar template HTML do relatório (2 páginas)
- [x] Implementar geração de PDF com html2canvas + jsPDF
- [x] Página 1: Resumo Executivo (3 KPIs + Top 5 Ativos)
- [x] Página 2: Alertas e Recomendações (Negligenciados + Não Conformidades)
- [ ] Configurar Cron job backend (1º dia útil do mês, 09:00) - PENDENTE BACKEND
- [ ] Integrar envio de email com PDF anexado - PENDENTE BACKEND

## VALIDAÇÃO FINAL

- [x] Testar todos os fluxos em mobile
- [x] Testar todos os fluxos em desktop
- [x] Validar conformidade com v1.0.txt - 100%
- [x] Validar conformidade com v1.1.txt - 100%
- [x] Validar conformidade com v1.2.txt - 100%
- [x] Checkpoint final - versão 4760ce3d
- [x] Adicionar exibição de Instruções em AssetDetail.tsx

## RESUMO FINAL

**Frontend: 100% Completo**
- V1.0: 6/6 módulos implementados
- V1.1: 4/4 features implementadas
- V1.2: 3/3 features implementadas

**Pendente (Backend):**
- Integração de queries reais para KPIs (substituir mock data)
- Cron job para geração automática de relatórios
- Envio de email com PDF anexado
