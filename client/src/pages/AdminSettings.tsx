import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Save, Bell, Calendar, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface GlobalSettings {
  daysWithoutUseAlert: number;
  minEventsPerMonth: number;
  emailNotifications: boolean;
  autoReportDay: number;
}

export default function AdminSettings() {
  const [, navigate] = useLocation();
  const [settings, setSettings] = useState<GlobalSettings>({
    daysWithoutUseAlert: 30,
    minEventsPerMonth: 3,
    emailNotifications: true,
    autoReportDay: 1
  });
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    try {
      // Salvar configurações no Supabase (tabela settings)
      // Por enquanto, apenas simular
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Configurações Globais</h1>
              <p className="text-gray-400">Ajustar parâmetros e alertas do sistema</p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Alertas de Equipamentos */}
          <Card className="p-6 bg-white/5 border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Alertas de Equipamentos</h3>
                <p className="text-sm text-gray-400">Configurar quando um equipamento é considerado negligenciado</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="daysWithoutUse" className="text-white">
                  Dias sem uso para alerta
                </Label>
                <Input
                  id="daysWithoutUse"
                  type="number"
                  value={settings.daysWithoutUseAlert}
                  onChange={(e) => setSettings({ ...settings, daysWithoutUseAlert: parseInt(e.target.value) })}
                  className="bg-gray-700 border-gray-600 text-white mt-2"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Equipamentos sem eventos há mais de {settings.daysWithoutUseAlert} dias serão marcados como "Parados"
                </p>
              </div>
              <div>
                <Label htmlFor="minEvents" className="text-white">
                  Mínimo de eventos por mês
                </Label>
                <Input
                  id="minEvents"
                  type="number"
                  value={settings.minEventsPerMonth}
                  onChange={(e) => setSettings({ ...settings, minEventsPerMonth: parseInt(e.target.value) })}
                  className="bg-gray-700 border-gray-600 text-white mt-2"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Equipamentos com menos de {settings.minEventsPerMonth} eventos/mês não serão considerados "Em Dia"
                </p>
              </div>
            </div>
          </Card>

          {/* Notificações */}
          <Card className="p-6 bg-white/5 border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Notificações por Email</h3>
                <p className="text-sm text-gray-400">Configurar envio automático de alertas</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Enviar notificações por email</p>
                <p className="text-sm text-gray-400">Alertar gestores sobre não conformidades</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  settings.emailNotifications ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.emailNotifications ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </Card>

          {/* Relatórios Automáticos */}
          <Card className="p-6 bg-white/5 border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Relatórios Automáticos</h3>
                <p className="text-sm text-gray-400">Gerar e enviar relatórios mensais</p>
              </div>
            </div>
            <div>
              <Label htmlFor="reportDay" className="text-white">
                Dia do mês para envio automático
              </Label>
              <Input
                id="reportDay"
                type="number"
                min="1"
                max="28"
                value={settings.autoReportDay}
                onChange={(e) => setSettings({ ...settings, autoReportDay: parseInt(e.target.value) })}
                className="bg-gray-700 border-gray-600 text-white mt-2"
              />
              <p className="text-xs text-gray-400 mt-1">
                Relatórios serão gerados e enviados todo dia {settings.autoReportDay} do mês às 09:00
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
