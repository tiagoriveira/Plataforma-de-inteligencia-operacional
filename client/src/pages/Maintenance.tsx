import React, { useState } from "react";
import Layout from "@/components/Layout";
import { IndustrialCard, IndustrialCardContent, IndustrialCardHeader, IndustrialCardTitle } from "@/components/ui/industrial-card";
import { IndustrialButton } from "@/components/ui/industrial-button";
import { IndustrialInput } from "@/components/ui/industrial-input";
import { CheckSquare, Clock, AlertTriangle, Plus, Save, Trash2, LayoutDashboard, BarChart } from "lucide-react";
import { Link } from "wouter";

export default function Maintenance() {
  const [checklistItems, setChecklistItems] = useState([
    { id: 1, text: "Verificar nível de óleo hidráulico", checked: false },
    { id: 2, text: "Inspecionar correias de transmissão", checked: false },
    { id: 3, text: "Limpar filtros de ar", checked: false },
    { id: 4, text: "Testar parada de emergência", checked: false },
  ]);

  const toggleItem = (id: number) => {
    setChecklistItems(items => 
      items.map(item => item.id === id ? { ...item, checked: !item.checked } : item)
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-mono text-foreground uppercase">
              Nova Ordem de Serviço
            </h1>
            <p className="text-muted-foreground mt-1 font-mono text-sm">
              MANUTENÇÃO PREVENTIVA // OS-2025-884
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/maintenance/kanban">
              <IndustrialButton variant="outline" className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                QUADRO KANBAN
              </IndustrialButton>
            </Link>
            <Link href="/maintenance/kpis">
              <IndustrialButton variant="outline" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                DASHBOARD KPIs
              </IndustrialButton>
            </Link>
            <IndustrialButton variant="outline" className="text-destructive border-destructive/50 hover:bg-destructive/10">
              <Trash2 className="mr-2 h-4 w-4" />
              CANCELAR
            </IndustrialButton>
            <IndustrialButton>
              <Save className="mr-2 h-4 w-4" />
              SALVAR OS
            </IndustrialButton>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Column */}
          <div className="lg:col-span-2 space-y-6">
            <IndustrialCard>
              <IndustrialCardHeader>
                <IndustrialCardTitle>Dados da Ordem</IndustrialCardTitle>
              </IndustrialCardHeader>
              <IndustrialCardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-muted-foreground uppercase">Ativo Relacionado</label>
                    <IndustrialInput defaultValue="TORNO CNC-01 (TOR-001)" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-muted-foreground uppercase">Tipo de Manutenção</label>
                    <select className="flex h-10 w-full rounded-none border-b-2 border-input bg-background px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:border-primary">
                      <option>PREVENTIVA</option>
                      <option>CORRETIVA</option>
                      <option>PREDITIVA</option>
                      <option>INSPEÇÃO DE ROTINA</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-muted-foreground uppercase">Responsável Técnico</label>
                    <IndustrialInput defaultValue="Téc. Santos" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-muted-foreground uppercase">Data Prevista</label>
                    <IndustrialInput type="date" defaultValue="2025-11-28" />
                  </div>
                </div>
                
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-mono text-muted-foreground uppercase">Descrição do Serviço</label>
                  <textarea 
                    className="flex min-h-[100px] w-full rounded-none border-2 border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                    placeholder="Descreva os detalhes do serviço a ser realizado..."
                  />
                </div>
              </IndustrialCardContent>
            </IndustrialCard>

            <IndustrialCard>
              <IndustrialCardHeader>
                <IndustrialCardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4" />
                    Checklist de Execução
                  </div>
                  <span className="text-xs font-mono text-muted-foreground font-normal">
                    {checklistItems.filter(i => i.checked).length}/{checklistItems.length} CONCLUÍDOS
                  </span>
                </IndustrialCardTitle>
              </IndustrialCardHeader>
              <IndustrialCardContent>
                <div className="space-y-3">
                  {checklistItems.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={`flex items-center p-3 border cursor-pointer transition-all ${
                        item.checked 
                          ? "bg-primary/10 border-primary text-primary" 
                          : "bg-card border-border hover:border-primary/50"
                      }`}
                    >
                      <div className={`w-5 h-5 mr-3 flex items-center justify-center border ${
                        item.checked ? "bg-primary border-primary" : "border-muted-foreground"
                      }`}>
                        {item.checked && <CheckSquare className="h-3 w-3 text-black" />}
                      </div>
                      <span className={`font-mono text-sm ${item.checked ? "line-through opacity-70" : ""}`}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                  
                  <div className="pt-2">
                    <IndustrialButton variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                      <Plus className="mr-2 h-3 w-3" />
                      ADICIONAR ITEM
                    </IndustrialButton>
                  </div>
                </div>
              </IndustrialCardContent>
            </IndustrialCard>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <IndustrialCard className="bg-yellow-500/5 border-yellow-500/20">
              <IndustrialCardHeader>
                <IndustrialCardTitle className="text-yellow-500 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Atenção
                </IndustrialCardTitle>
              </IndustrialCardHeader>
              <IndustrialCardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Este ativo possui histórico de superaquecimento no motor principal. Verificar temperatura antes de iniciar os testes.
                </p>
                <div className="text-xs font-mono text-yellow-500 border-t border-yellow-500/20 pt-2">
                  ÚLTIMA FALHA: 15 DIAS ATRÁS
                </div>
              </IndustrialCardContent>
            </IndustrialCard>

            <IndustrialCard>
              <IndustrialCardHeader>
                <IndustrialCardTitle className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Tempo Estimado
                </IndustrialCardTitle>
              </IndustrialCardHeader>
              <IndustrialCardContent>
                <div className="text-center py-4">
                  <div className="text-4xl font-bold font-mono text-foreground">02:30</div>
                  <div className="text-xs text-muted-foreground font-mono mt-1">HORAS PREVISTAS</div>
                </div>
                <div className="space-y-2 border-t border-border pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Início:</span>
                    <span className="font-mono">08:00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Término:</span>
                    <span className="font-mono">10:30</span>
                  </div>
                </div>
              </IndustrialCardContent>
            </IndustrialCard>
          </div>
        </div>
      </div>
    </Layout>
  );
}
