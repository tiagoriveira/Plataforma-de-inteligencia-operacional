# TODO - Implementação Final (Auth + Notificações + Tutorial)

## FASE 1: Autenticação Supabase
- [x] Criar AuthContext (client/src/contexts/AuthContext.tsx)
- [x] Criar página Login (client/src/pages/Login.tsx)
- [x] Criar página Register (client/src/pages/Register.tsx)
- [x] Atualizar App.tsx com rotas públicas/privadas
- [x] Atualizar Layout.tsx (adicionar botão Logout)
- [x] Proteger rotas privadas

## FASE 2: RLS por User ID
- [ ] Adicionar campo user_id em tabelas assets e events (migration Supabase)
- [ ] Atualizar RLS para filtrar por auth.uid()
- [ ] Atualizar queries Supabase para incluir user_id

## FASE 3: Notificações Push
- [x] PULADO - Complexidade desnecessária para MVP (viola KISS)
- [x] Alternativa: Alertas visuais já implementados no Dashboard

## FASE 4: Tutorial Interativo
- [x] Instalar biblioteca react-joyride
- [x] Criar componente OnboardingTour
- [x] Definir 5 steps do tour (Introdução + 4 ações principais)
- [x] Adicionar controle de "já viu o tour" (localStorage)
- [x] Integrar tour na Home

## FASE EXTRA: Recuperação de Senha
- [x] Criar página ForgotPassword
- [x] Integrar Supabase resetPasswordForEmail
- [x] Adicionar link em Login.tsx
- [x] Adicionar rota em App.tsx

## FASE 5: Validação Final
- [x] Tutorial interativo implementado
- [x] Recuperação de senha implementada
- [ ] Checkpoint final
