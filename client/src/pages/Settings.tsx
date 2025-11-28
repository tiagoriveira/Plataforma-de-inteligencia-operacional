import React, { useState } from "react";
import Layout from "@/components/Layout";
import { IndustrialCard, IndustrialCardContent, IndustrialCardHeader, IndustrialCardTitle } from "@/components/ui/industrial-card";
import { IndustrialButton } from "@/components/ui/industrial-button";
import { IndustrialInput } from "@/components/ui/industrial-input";
import { User, Bell, Lock, Save, Mail, Smartphone } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [notifications, setNotifications] = useState({
    emailCritical: true,
    emailMaintenance: true,
    pushCritical: true,
    pushMaintenance: false,
    dailyReport: true
  });

  const handleSave = () => {
    toast.success("Configurações salvas com sucesso!");
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-mono text-foreground uppercase">
            Configurações
          </h1>
          <p className="text-muted-foreground mt-1 font-mono text-sm">
            GERENCIAR CONTA E PREFERÊNCIAS
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar de Navegação */}
          <div className="md:col-span-1 space-y-2">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                activeTab === "profile"
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-card text-muted-foreground hover:bg-accent hover:text-foreground border border-transparent"
              }`}
            >
              <User className="h-4 w-4" />
              Meu Perfil
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                activeTab === "notifications"
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-card text-muted-foreground hover:bg-accent hover:text-foreground border border-transparent"
              }`}
            >
              <Bell className="h-4 w-4" />
              Notificações
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                activeTab === "security"
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-card text-muted-foreground hover:bg-accent hover:text-foreground border border-transparent"
              }`}
            >
              <Lock className="h-4 w-4" />
              Segurança
            </button>
          </div>

          {/* Conteúdo Principal */}
          <div className="md:col-span-3">
            {activeTab === "profile" && (
              <IndustrialCard>
                <IndustrialCardHeader>
                  <IndustrialCardTitle>Informações Pessoais</IndustrialCardTitle>
                </IndustrialCardHeader>
                <IndustrialCardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-muted-foreground uppercase">Nome Completo</label>
                      <IndustrialInput defaultValue="Operador Silva" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-muted-foreground uppercase">Cargo</label>
                      <IndustrialInput defaultValue="Supervisor de Turno" disabled />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-muted-foreground uppercase">Email</label>
                      <IndustrialInput defaultValue="silva@opintel.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-muted-foreground uppercase">Telefone</label>
                      <IndustrialInput defaultValue="(11) 98765-4321" />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <IndustrialButton onClick={handleSave}>
                      <Save className="mr-2 h-4 w-4" />
                      SALVAR ALTERAÇÕES
                    </IndustrialButton>
                  </div>
                </IndustrialCardContent>
              </IndustrialCard>
            )}

            {activeTab === "notifications" && (
              <IndustrialCard>
                <IndustrialCardHeader>
                  <IndustrialCardTitle>Preferências de Alerta</IndustrialCardTitle>
                </IndustrialCardHeader>
                <IndustrialCardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold font-mono flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      NOTIFICAÇÕES POR EMAIL
                    </h3>
                    <div className="space-y-3 pl-6">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={notifications.emailCritical}
                          onChange={(e) => setNotifications({...notifications, emailCritical: e.target.checked})}
                          className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
                        />
                        <span className="text-sm">Alertas Críticos (Falhas de Equipamento)</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={notifications.emailMaintenance}
                          onChange={(e) => setNotifications({...notifications, emailMaintenance: e.target.checked})}
                          className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
                        />
                        <span className="text-sm">Atualizações de Ordens de Serviço</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={notifications.dailyReport}
                          onChange={(e) => setNotifications({...notifications, dailyReport: e.target.checked})}
                          className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
                        />
                        <span className="text-sm">Relatório Diário de Operação</span>
                      </label>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 space-y-4">
                    <h3 className="text-sm font-bold font-mono flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      NOTIFICAÇÕES PUSH (MOBILE)
                    </h3>
                    <div className="space-y-3 pl-6">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={notifications.pushCritical}
                          onChange={(e) => setNotifications({...notifications, pushCritical: e.target.checked})}
                          className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
                        />
                        <span className="text-sm">Alertas Críticos em Tempo Real</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={notifications.pushMaintenance}
                          onChange={(e) => setNotifications({...notifications, pushMaintenance: e.target.checked})}
                          className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
                        />
                        <span className="text-sm">Lembretes de Manutenção Preventiva</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <IndustrialButton onClick={handleSave}>
                      <Save className="mr-2 h-4 w-4" />
                      SALVAR PREFERÊNCIAS
                    </IndustrialButton>
                  </div>
                </IndustrialCardContent>
              </IndustrialCard>
            )}

            {activeTab === "security" && (
              <IndustrialCard>
                <IndustrialCardHeader>
                  <IndustrialCardTitle>Segurança da Conta</IndustrialCardTitle>
                </IndustrialCardHeader>
                <IndustrialCardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-muted-foreground uppercase">Senha Atual</label>
                    <IndustrialInput type="password" placeholder="••••••••" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-muted-foreground uppercase">Nova Senha</label>
                      <IndustrialInput type="password" placeholder="••••••••" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-muted-foreground uppercase">Confirmar Nova Senha</label>
                      <IndustrialInput type="password" placeholder="••••••••" />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <IndustrialButton onClick={handleSave}>
                      <Save className="mr-2 h-4 w-4" />
                      ATUALIZAR SENHA
                    </IndustrialButton>
                  </div>
                </IndustrialCardContent>
              </IndustrialCard>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
