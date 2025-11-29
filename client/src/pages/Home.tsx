import React from "react";
import Layout from "@/components/Layout";
import { IndustrialCard } from "@/components/ui/industrial-card";
import { IndustrialButton } from "@/components/ui/industrial-button";
import { Link } from "wouter";
import {
  QrCode,
  Box,
  Activity,
  AlertTriangle,
  Wrench,
  CheckCircle2,
  ArrowRight,
  AlertOctagon
} from "lucide-react";

// Mock Data for Dashboard
const STATS = [
  {
    id: "total-assets",
    label: "ATIVOS TOTAIS",
    value: "142",
    subtext: "novos esta semana",
    change: "+3",
    icon: Box,
    color: "text-foreground",
  },
  {
    id: "operational",
    label: "EM OPERAÇÃO",
    value: "128",
    subtext: "Verificar ativo.",
    change: null,
    icon: Activity,
    color: "text-green-600",
  },
  {
    id: "maintenance",
    label: "MANUTENÇÃO",
    value: "08",
    subtext: null,
    change: null,
    icon: Wrench,
    color: "text-yellow-600",
  },
  {
    id: "critical",
    label: "CRÍTICOS",
    value: "06",
    subtext: null,
    change: null,
    icon: AlertTriangle,
    color: "text-red-600",
  },
];

// Mock Predictive Alerts (IA Layer 2)
const PREDICTIVE_ALERTS = [
  {
    id: "PRED-001",
    asset: "TOR-001",
    name: "TORNO CNC-01",
    risk: "HIGH",
    message: "Risco iminente de falha estatística. Verificar ativo.",
    mtbf: "236h",
    reliability: "98%"
  },
  {
    id: "PRED-002",
    asset: "PRE-020",
    name: "PRENSA H-20",
    risk: "MEDIUM",
    message: "Risco iminente de falha estatística. Verificar ativo.",
    mtbf: "718h",
    reliability: "100%"
  },
  {
    id: "PRED-003",
    asset: "CNC-002",
    name: "CENTRO USINAGEM",
    risk: "HIGH",
    message: "Risco iminente de falha estatística. Verificar ativo.",
    mtbf: "720h",
    reliability: "100%"
  }
];

export default function Home() {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-mono text-foreground uppercase">
              VISÃO GERAL
            </h1>
            <p className="text-muted-foreground mt-1 font-mono text-sm">
              DADOS EM TEMPO REAL // UNIDADE FABRIL 01
            </p>
          </div>
          <Link href="/scan">
            <IndustrialButton variant="industrial" size="lg" className="w-full md:w-auto">
              <QrCode className="mr-2 h-5 w-5" />
              ESCANEAR ATIVO
            </IndustrialButton>
          </Link>
        </div>

        {/* KPI Cards (Fixed Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat) => (
            <IndustrialCard key={stat.id} className="relative overflow-hidden group hover:border-primary/50 transition-colors">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  {stat.change && (
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded font-mono">
                      {stat.change}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <h3 className="text-4xl font-bold tracking-tight text-foreground">
                    {stat.value}
                  </h3>
                  {stat.subtext && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {stat.subtext}
                    </p>
                  )}
                </div>
              </div>
            </IndustrialCard>
          ))}
        </div>

        {/* Predictive Alerts Section (IA Layer 2) */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold font-mono text-purple-600 uppercase flex items-center gap-2">
            <Activity className="h-5 w-5" />
            INSIGHTS PREDITIVOS (IA)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PREDICTIVE_ALERTS.map((alert) => (
              <div 
                key={alert.id} 
                className="bg-purple-50 border border-purple-100 rounded-lg p-4 flex flex-col gap-3 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <AlertOctagon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">{alert.asset}</h3>
                    <p className="text-xs text-muted-foreground">{alert.message}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2 border-t border-purple-100 pt-2">
                  <div>
                    <span className="text-[10px] uppercase text-purple-400 font-bold">MTBF:</span>
                    <p className="text-xs font-mono text-purple-700">{alert.mtbf}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-purple-400 font-bold">Confiabilidade:</span>
                    <p className="text-xs font-mono text-purple-700">{alert.reliability}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity & Quick Access */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-mono text-foreground uppercase flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                ATIVIDADE RECENTE
              </h2>
              <Link href="/maintenance">
                <span className="text-sm font-mono text-primary hover:underline cursor-pointer uppercase">
                  VER TUDO
                </span>
              </Link>
            </div>
            
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-border rounded-lg p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`h-2 w-2 rounded-full ${i === 1 ? 'bg-green-500' : i === 2 ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm text-foreground">TORNO CNC-01</h4>
                      <span className="text-xs font-mono text-muted-foreground">Op. Silva</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Check-in Operacional</p>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">10:42</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-mono text-foreground uppercase">
              Acesso Rápido
            </h2>
            <div className="grid gap-3">
              <Link href="/assets">
                <div className="bg-white border border-border rounded-lg p-4 flex items-center justify-between hover:bg-accent/5 cursor-pointer transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-md group-hover:bg-blue-100 transition-colors">
                      <Box className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">LISTA DE ATIVOS</h4>
                      <p className="text-xs text-muted-foreground">Gerenciar inventário</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
              
              <Link href="/maintenance">
                <div className="bg-white border border-border rounded-lg p-4 flex items-center justify-between hover:bg-accent/5 cursor-pointer transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-50 p-2 rounded-md group-hover:bg-orange-100 transition-colors">
                      <Wrench className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">HISTÓRICO</h4>
                      <p className="text-xs text-muted-foreground">Ver intervenções</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>

              <Link href="/reports">
                <div className="bg-white border border-border rounded-lg p-4 flex items-center justify-between hover:bg-accent/5 cursor-pointer transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-50 p-2 rounded-md group-hover:bg-green-100 transition-colors">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">RELATÓRIOS</h4>
                      <p className="text-xs text-muted-foreground">Exportar dados</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
