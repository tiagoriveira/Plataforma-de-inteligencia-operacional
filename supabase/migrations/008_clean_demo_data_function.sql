-- Migration: Clean demo data function
-- Description: Creates SQL function to clean all demo data from the system
-- Date: 2025-12-04
-- Author: Manus AI Agent

-- =====================================================
-- FUNÇÃO: clean_demo_data()
-- DESCRIÇÃO: Remove todos os dados demo do sistema
-- SEGURANÇA: Apenas admins podem executar
-- =====================================================

CREATE OR REPLACE FUNCTION clean_demo_data()
RETURNS TABLE(
  deleted_events INTEGER,
  deleted_assets INTEGER,
  deleted_logs INTEGER,
  message TEXT
) AS $$
DECLARE
  v_events_count INTEGER;
  v_assets_count INTEGER;
  v_logs_count INTEGER;
BEGIN
  -- ⚠️ VERIFICAÇÃO DE SEGURANÇA: Apenas admins podem executar esta função
  IF (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) != 'admin' THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  -- Deletar todos os eventos
  DELETE FROM events WHERE id IS NOT NULL;
  GET DIAGNOSTICS v_events_count = ROW_COUNT;

  -- Deletar todos os ativos
  DELETE FROM assets WHERE id IS NOT NULL;
  GET DIAGNOSTICS v_assets_count = ROW_COUNT;

  -- Deletar todos os audit logs
  DELETE FROM audit_logs WHERE id IS NOT NULL;
  GET DIAGNOSTICS v_logs_count = ROW_COUNT;

  -- Log da operação (criar novo log de auditoria)
  INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata)
  VALUES (
    auth.uid(),
    'CLEAN_DEMO_DATA',
    'SYSTEM',
    NULL,
    jsonb_build_object(
      'deleted_events', v_events_count,
      'deleted_assets', v_assets_count,
      'deleted_logs', v_logs_count
    )
  );

  -- Retornar resultados
  RETURN QUERY SELECT 
    v_events_count,
    v_assets_count,
    v_logs_count,
    'Demo data cleaned successfully'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- COMENTÁRIOS
-- =====================================================

COMMENT ON FUNCTION clean_demo_data() IS 
'Remove todos os dados demo do sistema. Apenas administradores podem executar esta função.
Uso: SELECT * FROM clean_demo_data();
⚠️ ATENÇÃO: Esta operação é IRREVERSÍVEL e deleta TODOS os dados de eventos, ativos e logs.';
