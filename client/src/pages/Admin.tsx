import { Link, useLocation } from 'wouter';
import { Users, Settings, FileText, ArrowLeft, Bell } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function Admin() {
  const [, navigate] = useLocation();

  const adminSections = [
    {
      title: 'Gerenciar Usuários',
      description: 'Criar, editar e desativar usuários do sistema',
      icon: Users,
      href: '/admin/users',
      color: 'bg-blue-500'
    },
    {
      title: 'Configurações Globais',
      description: 'Ajustar parâmetros e alertas do sistema',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-green-500'
    },
    {
      title: 'Logs de Auditoria',
      description: 'Visualizar histórico de ações dos usuários',
      icon: FileText,
      href: '/admin/logs',
      color: 'bg-orange-500'
    },
    {
      title: 'Alertas de Manutenção',
      description: 'Gerenciar alertas automáticos e destinatários',
      icon: Bell,
      href: '/admin/alerts',
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Painel de Administração</h1>
            <p className="text-gray-400">Gerenciar usuários e configurações do sistema</p>
          </div>
        </div>

        {/* Admin Sections Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {adminSections.map((section) => {
            const Icon = section.icon;
            return (
              <Link key={section.href} href={section.href}>
                <Card className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className={`w-12 h-12 rounded-lg ${section.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{section.title}</h3>
                  <p className="text-gray-400 text-sm">{section.description}</p>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <Card className="p-4 bg-white/5 border-white/10">
            <div className="text-gray-400 text-sm mb-1">Total de Usuários</div>
            <div className="text-2xl font-bold text-white">1</div>
          </Card>
          <Card className="p-4 bg-white/5 border-white/10">
            <div className="text-gray-400 text-sm mb-1">Usuários Ativos Hoje</div>
            <div className="text-2xl font-bold text-white">1</div>
          </Card>
          <Card className="p-4 bg-white/5 border-white/10">
            <div className="text-gray-400 text-sm mb-1">Ações nas Últimas 24h</div>
            <div className="text-2xl font-bold text-white">0</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
