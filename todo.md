# TODO - Preparação para Produção

## FASE 1: Scanner QR Code Real
- [x] Instalar biblioteca html5-qrcode
- [x] Implementar Scanner.tsx com câmera funcional
- [x] Adicionar permissões de câmera
- [x] Testar redirecionamento automático para ficha do ativo

## FASE 2: Autenticação Multi-Usuário
- [ ] Configurar Supabase Auth (email/senha)
- [ ] Criar página de Login/Registro
- [ ] Atualizar RLS para filtrar por user_id
- [ ] Adicionar campo user_id em assets e events
- [ ] Implementar logout e gerenciamento de sessão

## FASE 3: Service Worker Offline (PWA)
- [ ] Configurar Workbox para cache de assets
- [ ] Implementar estratégia offline-first
- [ ] Adicionar manifest.json (PWA)
- [ ] Implementar sincronização de eventos pendentes
- [ ] Adicionar ícones PWA

## FASE 4: Reports.tsx com Dados Reais
- [x] Integrar getKPIs() em Reports.tsx
- [x] Atualizar geração de PDF com dados dinâmicos
- [x] Testar export de relatórios

## FASE 5: Otimizações de Produção
- [x] Adicionar meta tags SEO (Open Graph, Twitter Cards)
- [x] Configurar lang="pt-BR" no HTML
- [x] Adicionar Apple Touch Icon
- [ ] Otimizar imagens e assets
- [ ] Implementar lazy loading
- [ ] Adicionar error boundaries

## FASE 6: Validação Final
- [ ] Testar todos os fluxos em produção
- [ ] Validar performance (Lighthouse)
- [ ] Checkpoint final
