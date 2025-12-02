# TODO - Simplificação UX para Usuários Leigos

## PRIORIDADE CRÍTICA

### Layout Mobile - Home.tsx
- [x] Reduzir altura dos cards de KPIs (mais compactos)
- [x] Exibir KPIs + Acesso Rápido na mesma viewport (sem scroll)
- [x] Grid 2x2 de ações principais visível imediatamente

### Botões Voltar
- [x] Adicionar botão "Voltar" em QuickEvent.tsx (já existia)
- [x] Adicionar botão "Voltar" em Scanner.tsx
- [x] Adicionar botão "Voltar" em AuditLog.tsx
- [x] Adicionar botão "Voltar" em Reports.tsx
- [x] Adicionar botão "Voltar" em Settings.tsx

### Simplificar Linguagem
- [x] Home.tsx: "Ativos Saudáveis" → "Em Dia"
- [x] Home.tsx: "Ativos Negligenciados" → "Parados"
- [x] Home.tsx: "Distribuição de Eventos" → "Tipos de Registro"
- [x] Home.tsx: "INDICADORES DO MÊS" → "RESUMO DO MÊS"
- [x] QuickEvent.tsx: "Não Conformidade" → "Problema Grave"
- [x] QuickEvent.tsx: "Registro Rápido" → "REGISTRAR EVENTO"
- [ ] AssetDetail.tsx: "Especificações" → "Informações Técnicas"
- [ ] Reports.tsx: "Resumo Executivo" → "Resumo do Mês"
- [x] AuditLog.tsx: Título da página → "Histórico Completo"

## PRIORIDADE MÉDIA

### Labels em Botões
- [ ] Adicionar texto "Voltar" ao lado do ícone de seta
- [ ] Aumentar tamanho de fonte dos botões principais (mobile)

### Feedback Visual
- [ ] Adicionar toast "Gerando PDF..." em Reports.tsx
- [ ] Adicionar toast "Exportando..." ao clicar em Export CSV
- [ ] Adicionar loading ao escanear QR Code

## VALIDAÇÃO FINAL

- [ ] Testar com usuário leigo (não técnico)
- [ ] Verificar se todas as telas têm botão voltar
- [ ] Verificar se Home mobile não precisa de scroll para ver ações principais
- [ ] Checkpoint final após correções
