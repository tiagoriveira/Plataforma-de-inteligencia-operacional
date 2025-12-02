import { Link } from "wouter";
import Layout from "@/components/Layout";
import { IndustrialCard } from "@/components/ui/industrial-card";
import { IndustrialButton } from "@/components/ui/industrial-button";
import {
  QrCode,
  Box,
  ClipboardList,
  FileText,
  Settings,
  History,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";

export default function Home() {
  // V1.2: Mock data para KPIs (substituir por queries reais do backend)
  const kpis = {
    totalEventosAtual: 342,
    totalEventosAnterior: 298,
    ativosSaudaveis: 18,
    totalAtivos: 25,
    ativosNegligenciados: 3,
  };

  const variacao = ((kpis.totalEventosAtual - kpis.totalEventosAnterior) / kpis.totalEventosAnterior * 100).toFixed(1);
  const percentualSaudaveis = ((kpis.ativosSaudaveis / kpis.totalAtivos) * 100).toFixed(0);

  const ativosNegligenciadosList = [
    { id: "EMP-04", name: "Empilhadeira E-04", diasSemUso: 45 },
    { id: "COR-02", name: "Cortadora L-02", diasSemUso: 38 },
    { id: "SOL-01", name: "Soldadora S-01", diasSemUso: 32 },
  ];

  const distribuicaoEventos = [
    { tipo: "Manutenção", count: 120, cor: "bg-yellow-500" },
    { tipo: "Inspeção", count: 98, cor: "bg-blue-500" },
    { tipo: "Check-in", count: 65, cor: "bg-green-500" },
    { tipo: "Problema", count: 42, cor: "bg-red-500" },
    { tipo: "Melhoria", count: 17, cor: "bg-purple-500" },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-mono text-foreground uppercase">
            Op.Intel
          </h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Plataforma de Inteligência Operacional
          </p>
        </div>

        {/* V1.2: Dashboard Minimalista - 3 KPIs Principais */}
        <div>
          <h2 className="text-xl font-bold font-mono text-foreground uppercase mb-4 flex items-center gap-2">
            <span className="text-primary">▸</span> INDICADORES DO MÊS
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* KPI 1: Total de Eventos */}
            <IndustrialCard className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-muted-foreground uppercase">Total de Eventos</span>
                  {parseFloat(variacao) > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div className="text-4xl font-bold font-mono text-foreground">{kpis.totalEventosAtual}</div>
                <div className="text-xs text-muted-foreground mt-2 font-mono">
                  {parseFloat(variacao) > 0 ? '+' : ''}{variacao}% vs mês anterior ({kpis.totalEventosAnterior})
                </div>
              </div>
            </IndustrialCard>

            {/* KPI 2: Ativos Saudáveis */}
            <IndustrialCard className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-muted-foreground uppercase">Ativos Saudáveis</span>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-4xl font-bold font-mono text-foreground">{percentualSaudaveis}%</div>
                <div className="text-xs text-muted-foreground mt-2 font-mono">
                  {kpis.ativosSaudaveis} de {kpis.totalAtivos} ativos (≥3 eventos/mês)
                </div>
              </div>
            </IndustrialCard>

            {/* KPI 3: Ativos Negligenciados */}
            <IndustrialCard className="bg-gradient-to-br from-red-500/5 to-red-500/10 border-red-500/20">
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-muted-foreground uppercase">Ativos Negligenciados</span>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </div>
                <div className="text-4xl font-bold font-mono text-foreground">{kpis.ativosNegligenciados}</div>
                <div className="text-xs text-muted-foreground mt-2 font-mono">
                  Sem uso há mais de 30 dias
                </div>
              </div>
            </IndustrialCard>
          </div>

          {/* Distribuição de Tipos de Evento */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <IndustrialCard>
              <div className="p-6">
                <h3 className="text-sm font-mono font-bold uppercase text-muted-foreground mb-4">
                  Distribuição de Eventos (Últimos 30 dias)
                </h3>
                <div className="space-y-3">
                  {distribuicaoEventos.map((evento) => {
                    const total = distribuicaoEventos.reduce((sum, e) => sum + e.count, 0);
                    const percentual = ((evento.count / total) * 100).toFixed(1);
                    return (
                      <div key={evento.tipo}>
                        <div className="flex items-center justify-between text-xs font-mono mb-1">
                          <span className="text-foreground">{evento.tipo}</span>
                          <span className="text-muted-foreground">{evento.count} ({percentual}%)</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`${evento.cor} h-2 rounded-full transition-all`}
                            style={{ width: `${percentual}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </IndustrialCard>

            {/* Lista de Ativos Negligenciados */}
            <IndustrialCard>
              <div className="p-6">
                <h3 className="text-sm font-mono font-bold uppercase text-muted-foreground mb-4">
                  Ativos Negligenciados (Ação Necessária)
                </h3>
                <div className="space-y-3">
                  {ativosNegligenciadosList.map((ativo) => (
                    <div 
                      key={ativo.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-red-500/20 bg-red-500/5"
                    >
                      <div>
                        <div className="font-mono font-bold text-sm text-foreground">{ativo.id}</div>
                        <div className="text-xs text-muted-foreground">{ativo.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-red-500 font-mono font-bold text-sm">{ativo.diasSemUso} dias</div>
                        <div className="text-xs text-muted-foreground">sem uso</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </IndustrialCard>
          </div>
        </div>

        {/* Acesso Rápido */}
        <div>
          <h2 className="text-xl font-bold font-mono text-foreground uppercase mb-4 flex items-center gap-2">
            <span className="text-primary">▸</span> ACESSO RÁPIDO
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Escanear Ativo */}
            <Link href="/scan">
              <IndustrialCard className="cursor-pointer hover:border-primary transition-colors h-full">
                <div className="flex flex-col items-center justify-center text-center p-6 gap-4">
                  <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg font-mono uppercase">ESCANEAR ATIVO</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Registrar evento via QR Code
                    </p>
                  </div>
                </div>
              </IndustrialCard>
            </Link>

            {/* Lista de Ativos */}
            <Link href="/assets">
              <IndustrialCard className="cursor-pointer hover:border-primary transition-colors h-full">
                <div className="flex flex-col items-center justify-center text-center p-6 gap-4">
                  <div className="w-16 h-16 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Box className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg font-mono uppercase">LISTA DE ATIVOS</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Gerenciar inventário
                    </p>
                  </div>
                </div>
              </IndustrialCard>
            </Link>

            {/* Registro Rápido */}
            <Link href="/quick-event">
              <IndustrialCard className="cursor-pointer hover:border-primary transition-colors h-full">
                <div className="flex flex-col items-center justify-center text-center p-6 gap-4">
                  <div className="w-16 h-16 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <ClipboardList className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg font-mono uppercase">REGISTRO RÁPIDO</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Registrar evento sem QR
                    </p>
                  </div>
                </div>
              </IndustrialCard>
            </Link>

            {/* Histórico */}
            <Link href="/audit-log">
              <IndustrialCard className="cursor-pointer hover:border-primary transition-colors h-full">
                <div className="flex flex-col items-center justify-center text-center p-6 gap-4">
                  <div className="w-16 h-16 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <History className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg font-mono uppercase">HISTÓRICO (LOG)</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Visualizar eventos registrados
                    </p>
                  </div>
                </div>
              </IndustrialCard>
            </Link>

            {/* Relatórios */}
            <Link href="/reports">
              <IndustrialCard className="cursor-pointer hover:border-primary transition-colors h-full">
                <div className="flex flex-col items-center justify-center text-center p-6 gap-4">
                  <div className="w-16 h-16 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg font-mono uppercase">RELATÓRIOS</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Exportar e analisar dados
                    </p>
                  </div>
                </div>
              </IndustrialCard>
            </Link>

            {/* Configurações */}
            <Link href="/settings">
              <IndustrialCard className="cursor-pointer hover:border-primary transition-colors h-full">
                <div className="flex flex-col items-center justify-center text-center p-6 gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gray-500/10 flex items-center justify-center">
                    <Settings className="w-8 h-8 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg font-mono uppercase">CONFIGURAÇÕES</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ajustes do sistema
                    </p>
                  </div>
                </div>
              </IndustrialCard>
            </Link>
          </div>
        </div>

        {/* Informação do Sistema */}
        <IndustrialCard className="bg-muted/30">
          <div className="p-4">
            <h3 className="font-bold font-mono text-sm uppercase text-muted-foreground mb-2">
              SOBRE O SISTEMA
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sistema de rastreamento industrial via QR/NFC. Cada escaneamento gera um evento. 
              Cada evento alimenta o histórico. O histórico vira inteligência operacional.
            </p>
            <p className="text-xs text-muted-foreground mt-2 font-mono">
              Filosofia: KISS + Dados Primeiro + Zero Perfumaria
            </p>
          </div>
        </IndustrialCard>
      </div>
    </Layout>
  );
}
