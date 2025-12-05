import { useState, useEffect } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { IndustrialCard } from "@/components/ui/industrial-card";
import { IndustrialButton } from "@/components/ui/industrial-button";
import { Bell, AlertTriangle, Clock, CheckCircle, Mail, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface MaintenanceAlert {
  id: string;
  asset_id: string;
  alert_type: 'preventive' | 'overdue';
  next_maintenance_date: string;
  days_until_maintenance: number | null;
  days_overdue: number | null;
  email_sent_to: string[];
  sent_at: string;
  assets: {
    code: string;
    name: string;
    manufacturer: string;
    model: string;
  };
}

interface AlertSettings {
  id: string;
  email: string;
  receive_maintenance_alerts: boolean;
  receive_monthly_reports: boolean;
}

export default function MaintenanceAlerts() {
  const [alerts, setAlerts] = useState<MaintenanceAlert[]>([]);
  const [settings, setSettings] = useState<AlertSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    preventive: 0,
    overdue: 0,
    lastCheck: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      // Carregar alertas recentes (últimos 30 dias)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: alertsData, error: alertsError } = await supabase
        .from('maintenance_alerts')
        .select(`
          *,
          assets (code, name, manufacturer, model)
        `)
        .gte('sent_at', thirtyDaysAgo.toISOString())
        .order('sent_at', { ascending: false })
        .limit(100);

      if (alertsError) throw alertsError;

      setAlerts(alertsData || []);

      // Calcular estatísticas
      const preventiveCount = alertsData?.filter(a => a.alert_type === 'preventive').length || 0;
      const overdueCount = alertsData?.filter(a => a.alert_type === 'overdue').length || 0;
      const lastAlert = alertsData?.[0];

      setStats({
        total: alertsData?.length || 0,
        preventive: preventiveCount,
        overdue: overdueCount,
        lastCheck: lastAlert?.sent_at || ""
      });

      // Carregar configurações de email
      const { data: settingsData, error: settingsError } = await supabase
        .from('alert_settings')
        .select('*')
        .order('created_at', { ascending: false });

      if (settingsError) throw settingsError;

      setSettings(settingsData || []);

    } catch (error: any) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar alertas");
    } finally {
      setLoading(false);
    }
  }

  async function addEmail() {
    if (!newEmail || !newEmail.includes('@')) {
      toast.error("Email inválido");
      return;
    }

    try {
      const { error } = await supabase
        .from('alert_settings')
        .insert({
          email: newEmail,
          receive_maintenance_alerts: true,
          receive_monthly_reports: true
        });

      if (error) throw error;

      toast.success("Email adicionado com sucesso");
      setNewEmail("");
      loadData();
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error("Este email já está cadastrado");
      } else {
        toast.error("Erro ao adicionar email");
      }
    }
  }

  async function toggleAlertSetting(id: string, field: 'receive_maintenance_alerts' | 'receive_monthly_reports', currentValue: boolean) {
    try {
      const { error } = await supabase
        .from('alert_settings')
        .update({ [field]: !currentValue })
        .eq('id', id);

      if (error) throw error;

      toast.success("Configuração atualizada");
      loadData();
    } catch (error) {
      toast.error("Erro ao atualizar configuração");
    }
  }

  async function removeEmail(id: string) {
    try {
      const { error } = await supabase
        .from('alert_settings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Email removido");
      loadData();
    } catch (error) {
      toast.error("Erro ao remover email");
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Alertas de Manutenção</h1>
            <p className="text-gray-400 mt-1">Monitoramento e histórico de alertas automáticos</p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <IndustrialCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total de Alertas</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
                <p className="text-xs text-gray-500 mt-1">Últimos 30 dias</p>
              </div>
              <Bell className="w-10 h-10 text-blue-500" />
            </div>
          </IndustrialCard>

          <IndustrialCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Preventivos</p>
                <p className="text-3xl font-bold text-yellow-500 mt-1">{stats.preventive}</p>
                <p className="text-xs text-gray-500 mt-1">7 dias antes</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-500" />
            </div>
          </IndustrialCard>

          <IndustrialCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Atrasados</p>
                <p className="text-3xl font-bold text-red-500 mt-1">{stats.overdue}</p>
                <p className="text-xs text-gray-500 mt-1">Urgentes</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
          </IndustrialCard>

          <IndustrialCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Última Verificação</p>
                <p className="text-lg font-bold text-white mt-1">
                  {stats.lastCheck ? new Date(stats.lastCheck).toLocaleDateString('pt-BR') : 'N/A'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.lastCheck ? new Date(stats.lastCheck).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''}
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </IndustrialCard>
        </div>

        {/* Configurações de Email */}
        <IndustrialCard>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Destinatários de Alertas
          </h2>

          <div className="space-y-4">
            {/* Adicionar novo email */}
            <div className="flex gap-2">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="novo@email.com"
                className="flex-1 bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white"
                onKeyDown={(e) => e.key === 'Enter' && addEmail()}
              />
              <IndustrialButton onClick={addEmail}>
                Adicionar
              </IndustrialButton>
            </div>

            {/* Lista de emails */}
            <div className="space-y-2">
              {settings.map((setting) => (
                <div key={setting.id} className="bg-gray-800 border border-gray-700 rounded p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-white font-medium">{setting.email}</p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={setting.receive_maintenance_alerts}
                          onChange={() => toggleAlertSetting(setting.id, 'receive_maintenance_alerts', setting.receive_maintenance_alerts)}
                          className="rounded"
                        />
                        Alertas de Manutenção
                      </label>
                      <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={setting.receive_monthly_reports}
                          onChange={() => toggleAlertSetting(setting.id, 'receive_monthly_reports', setting.receive_monthly_reports)}
                          className="rounded"
                        />
                        Relatórios Mensais
                      </label>
                    </div>
                  </div>
                  <IndustrialButton
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEmail(setting.id)}
                  >
                    Remover
                  </IndustrialButton>
                </div>
              ))}
              {settings.length === 0 && (
                <p className="text-gray-500 text-center py-4">Nenhum destinatário cadastrado</p>
              )}
            </div>
          </div>
        </IndustrialCard>

        {/* Histórico de Alertas */}
        <IndustrialCard>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Histórico de Alertas
          </h2>

          <div className="space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`border rounded p-4 ${
                  alert.alert_type === 'overdue'
                    ? 'bg-red-900/20 border-red-700'
                    : 'bg-yellow-900/20 border-yellow-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {alert.alert_type === 'overdue' ? (
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      ) : (
                        <Clock className="w-5 h-5 text-yellow-500" />
                      )}
                      <Link href={`/asset/${alert.asset_id}`}>
                        <span className="text-white font-bold hover:underline cursor-pointer">
                          {alert.assets.code} - {alert.assets.name}
                        </span>
                      </Link>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">
                      {alert.assets.manufacturer} {alert.assets.model}
                    </p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span className="text-gray-400">
                        Próxima manutenção: {new Date(alert.next_maintenance_date).toLocaleDateString('pt-BR')}
                      </span>
                      {alert.alert_type === 'preventive' && alert.days_until_maintenance && (
                        <span className="text-yellow-500">
                          Faltam {alert.days_until_maintenance} dias
                        </span>
                      )}
                      {alert.alert_type === 'overdue' && alert.days_overdue && (
                        <span className="text-red-500 font-bold">
                          Atrasado há {alert.days_overdue} dias
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>{new Date(alert.sent_at).toLocaleDateString('pt-BR')}</p>
                    <p>{new Date(alert.sent_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                    <p className="mt-1 text-xs">
                      Enviado para {alert.email_sent_to.length} {alert.email_sent_to.length === 1 ? 'destinatário' : 'destinatários'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {alerts.length === 0 && (
              <p className="text-gray-500 text-center py-8">Nenhum alerta enviado nos últimos 30 dias</p>
            )}
          </div>
        </IndustrialCard>
      </div>
    </Layout>
  );
}
