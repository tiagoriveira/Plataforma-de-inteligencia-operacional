import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, UserPlus, Edit, Trash2, Key } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  created_at: string;
  pin?: string;
  is_active: boolean;
}

export default function AdminUsers() {
  const [, navigate] = useLocation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ email: '', password: '', pin: '' });

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const { data, error } = await supabase.rpc('get_all_users');
      if (error) throw error;

      setUsers(data.map((u: any) => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        pin: u.metadata?.pin,
        is_active: !u.metadata?.banned_until // Assuming we check ban status or similar
      })));
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateUser() {
    try {
      const { error } = await supabase.functions.invoke('admin-actions', {
        body: {
          action: 'createUser',
          email: formData.email,
          password: formData.password,
          metadata: { pin: formData.pin }
        }
      });

      if (error) throw error;

      toast.success('Usuário criado com sucesso!');
      setShowCreateDialog(false);
      setFormData({ email: '', password: '', pin: '' });
      loadUsers();
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      toast.error(error.message || 'Erro ao criar usuário');
    }
  }

  async function handleUpdatePin(userId: string, newPin: string) {
    try {
      const { error } = await supabase.functions.invoke('admin-actions', {
        body: {
          action: 'updateUser',
          id: userId,
          metadata: { pin: newPin }
        }
      });
      if (error) throw error;
      toast.success('PIN atualizado com sucesso!');
      loadUsers();
    } catch (error) {
      console.error('Erro ao atualizar PIN:', error);
      toast.error('Erro ao atualizar PIN');
    }
  }

  async function handleToggleActive(userId: string, isActive: boolean) {
    try {
      const action = isActive ? 'restoreUser' : 'deleteUser';
      const { error } = await supabase.functions.invoke('admin-actions', {
        body: { action, id: userId }
      });
      if (error) throw error;
      toast.success(isActive ? 'Usuário ativado!' : 'Usuário desativado!');
      loadUsers();
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast.error('Erro ao atualizar usuário');
    }
  }

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
              <h1 className="text-3xl font-bold text-white">Gerenciar Usuários</h1>
              <p className="text-gray-400">Criar, editar e desativar usuários do sistema</p>
            </div>
          </div>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Novo Usuário
          </Button>
        </div>

        {/* Users List */}
        {loading ? (
          <div className="text-center text-white py-12">Carregando...</div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <Card key={user.id} className="p-6 bg-white/5 border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{user.email}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${user.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {user.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>PIN: {user.pin || 'Não definido'}</span>
                      <span>Criado em: {new Date(user.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newPin = prompt('Digite o novo PIN (4 dígitos):');
                        if (newPin && /^\d{4}$/.test(newPin)) {
                          handleUpdatePin(user.id, newPin);
                        } else if (newPin) {
                          toast.error('PIN inválido! Digite 4 dígitos.');
                        }
                      }}
                    >
                      <Key className="w-4 h-4 mr-2" />
                      Alterar PIN
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(user.id, !user.is_active)}
                    >
                      {user.is_active ? 'Desativar' : 'Ativar'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Create User Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Criar Novo Usuário</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-white">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="pin" className="text-white">PIN (4 dígitos)</Label>
                <Input
                  id="pin"
                  type="text"
                  maxLength={4}
                  value={formData.pin}
                  onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCreateUser}
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                  disabled={!formData.email || !formData.password || formData.pin.length !== 4}
                >
                  Criar Usuário
                </Button>
                <Button
                  onClick={() => setShowCreateDialog(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
