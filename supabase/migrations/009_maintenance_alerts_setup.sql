-- Tabela de configurações de alertas
CREATE TABLE IF NOT EXISTS alert_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    receive_maintenance_alerts BOOLEAN DEFAULT true,
    receive_monthly_reports BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(email)
);

-- Tabela de histórico de alertas enviados
CREATE TABLE IF NOT EXISTS maintenance_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    alert_type TEXT NOT NULL CHECK (alert_type IN ('preventive', 'overdue')),
    next_maintenance_date DATE NOT NULL,
    days_until_maintenance INTEGER,
    days_overdue INTEGER,
    email_sent_to TEXT[] NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS para alert_settings
ALTER TABLE alert_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins podem ver todas as configurações"
    ON alert_settings FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Admins podem inserir configurações"
    ON alert_settings FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Admins podem atualizar configurações"
    ON alert_settings FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Admins podem deletar configurações"
    ON alert_settings FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- RLS para maintenance_alerts
ALTER TABLE maintenance_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver alertas"
    ON maintenance_alerts FOR SELECT
    USING (true);

CREATE POLICY "Service role pode inserir alertas"
    ON maintenance_alerts FOR INSERT
    WITH CHECK (true);

-- Índices para performance
CREATE INDEX idx_alert_settings_email ON alert_settings(email);
CREATE INDEX idx_maintenance_alerts_asset_id ON maintenance_alerts(asset_id);
CREATE INDEX idx_maintenance_alerts_sent_at ON maintenance_alerts(sent_at DESC);
CREATE INDEX idx_maintenance_alerts_alert_type ON maintenance_alerts(alert_type);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_alert_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_alert_settings_updated_at_trigger
    BEFORE UPDATE ON alert_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_alert_settings_updated_at();

-- Inserir configuração padrão (email do admin)
INSERT INTO alert_settings (email, receive_maintenance_alerts, receive_monthly_reports)
VALUES ('tiagosantosr59@gmail.com', true, true)
ON CONFLICT (email) DO NOTHING;

-- Índice composto para otimizar query de verificação de alertas
CREATE INDEX IF NOT EXISTS idx_assets_maintenance_check 
ON assets(last_maintenance_date, maintenance_interval_days)
WHERE maintenance_interval_days IS NOT NULL 
  AND last_maintenance_date IS NOT NULL;
