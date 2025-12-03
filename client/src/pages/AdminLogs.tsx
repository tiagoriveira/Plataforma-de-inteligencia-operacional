import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Search, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface AuditLog {
  id: string;
  user_email: string;
  action: string;
  details: string;
  created_at: string;
}

export default function AdminLogs() {
  const [, navigate] = useLocation();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    try {
      // Buscar logs de auditoria do Supabase
      // Por enquanto, mostrar logs demo
      setLogs([
        {
          id: '1',
          user_email: 'tiagosantosr59@gmail.com',
          action: 'LOGIN',
          details: 'Login via PIN',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          user_email: 'tiagosantosr59@gmail.com',
          action: 'CREATE_ASSET',
          details: 'Criou ativo: Torno CNC #001',
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '3',
          user_email: 'tiagosantosr59@gmail.com',
          action: 'CREATE_EVENT',
          details: 'Registrou manutenção preventiva',
          created_at: new Date(Date.now() - 7200000).toISOString()
        }
      ]);
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
      toast.error('Erro ao carregar logs');
    } finally {
      setLoading(false);
    }
  }

  function exportLogs() {
    const csv = [
      ['Data/Hora', 'Usuário', 'Ação', 'Detalhes'],
      ...logs.map(log => [
        new Date(log.created_at).toLocaleString('pt-BR'),
        log.user_email,
        log.action,
        log.details
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-auditoria-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Logs exportados com sucesso!');
  }

  const filteredLogs = logs.filter(log =>
    log.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const actionLabels: Record<string, { label: string; color: string }> = {
    LOGIN: { label: 'Login', color: 'bg-blue-500/20 text-blue-400' },
    LOGOUT: { label: 'Logout', color: 'bg-gray-500/20 text-gray-400' },
    CREATE_ASSET: { label: 'Criou Ativo', color: 'bg-green-500/20 text-green-400' },
    UPDATE_ASSET: { label: 'Editou Ativo', color: 'bg-yellow-500/20 text-yellow-400' },
    DELETE_ASSET: { label: 'Excluiu Ativo', color: 'bg-red-500/20 text-red-400' },
    CREATE_EVENT: { label: 'Registrou Evento', color: 'bg-purple-500/20 text-purple-400' },
    EXPORT_CSV: { label: 'Exportou CSV', color: 'bg-cyan-500/20 text-cyan-400' },
    GENERATE_REPORT: { label: 'Gerou Relatório', color: 'bg-orange-500/20 text-orange-400' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
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
              <h1 className="text-3xl font-bold text-white">Logs de Auditoria</h1>
              <p className="text-gray-400">Histórico de ações dos usuários no sistema</p>
            </div>
          </div>
          <Button
            onClick={exportLogs}
            className="bg-green-500 hover:bg-green-600"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por usuário, ação ou detalhes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white"
            />
          </div>
        </div>

        {/* Logs List */}
        {loading ? (
          <div className="text-center text-white py-12">Carregando...</div>
        ) : filteredLogs.length === 0 ? (
          <Card className="p-12 bg-white/5 border-white/10 text-center">
            <p className="text-gray-400">Nenhum log encontrado</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <Card key={log.id} className="p-4 bg-white/5 border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-sm text-gray-400 min-w-[140px]">
                      {new Date(log.created_at).toLocaleString('pt-BR')}
                    </div>
                    <div className="flex items-center gap-3 flex-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${actionLabels[log.action]?.color || 'bg-gray-500/20 text-gray-400'}`}>
                        {actionLabels[log.action]?.label || log.action}
                      </span>
                      <span className="text-white font-medium">{log.user_email}</span>
                      <span className="text-gray-400">{log.details}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 grid md:grid-cols-4 gap-4">
          <Card className="p-4 bg-white/5 border-white/10">
            <div className="text-gray-400 text-sm mb-1">Total de Ações</div>
            <div className="text-2xl font-bold text-white">{logs.length}</div>
          </Card>
          <Card className="p-4 bg-white/5 border-white/10">
            <div className="text-gray-400 text-sm mb-1">Logins Hoje</div>
            <div className="text-2xl font-bold text-white">
              {logs.filter(l => l.action === 'LOGIN' && new Date(l.created_at).toDateString() === new Date().toDateString()).length}
            </div>
          </Card>
          <Card className="p-4 bg-white/5 border-white/10">
            <div className="text-gray-400 text-sm mb-1">Ativos Criados</div>
            <div className="text-2xl font-bold text-white">
              {logs.filter(l => l.action === 'CREATE_ASSET').length}
            </div>
          </Card>
          <Card className="p-4 bg-white/5 border-white/10">
            <div className="text-gray-400 text-sm mb-1">Eventos Registrados</div>
            <div className="text-2xl font-bold text-white">
              {logs.filter(l => l.action === 'CREATE_EVENT').length}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
