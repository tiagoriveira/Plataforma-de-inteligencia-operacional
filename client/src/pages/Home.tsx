import React, { useEffect, useState } from "react";
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
import { getKPIs } from "@/lib/supabase";

export default function Home() {
  const [kpis, setKpis] = useState({
    totalEventosAtual: 0,
    totalEventosAnterior: 0,
    ativosSaudaveis: 0,
    totalAtivos: 0,
    ativosNegligenciados: 0,
    ativosNegligenciadosList: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadKPIs() {
      try {
        const data = await getKPIs();
        setKpis({
          totalEventosAtual: data.totalEventosAtual,
          totalEventosAnterior: data.totalEventosAnterior,
          ativosSaudaveis: data.ativosSaudaveis,
          totalAtivos: data.totalAtivos,
          ativosNegligenciados: data.ativosNegligenciados,
          ativosNegligenciadosList: data.ativosNegligenciadosList,
        });
      } catch (error) {
        console.error("Erro ao carregar KPIs:", error);
      } finally {
        setLoading(false);
      }
    }
    loadKPIs();
  }, []);

  const variacao = ((kpis.totalEventosAtual - kpis.totalEventosAnterior) / kpis.totalEventosAnterior * 100).toFixed(1);
  const percentualSaudaveis = ((kpis.ativosSaudaveis / kpis.totalAtivos) * 100).toFixed(0);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground font-mono">Carregando dados...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const distribuicaoEventos = [
    { tipo: "Manutenção", count: 120, cor: "bg-yellow-500" },
    { tipo: "Inspeção", count: 98, cor: "bg-blue-500" },
    { tipo: "Check-in", count: 65, cor: "bg-green-500" },
    { tipo: "Problema", count: 42, cor: "bg-red-500" },
    { tipo: "Melhoria", count: 17, cor: "bg-purple-500" },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-border pb-4">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight font-mono text-foreground uppercase">
            Op.Intel
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Plataforma de Inteligência Operacional
          </p>
        </div>

        {/* MOBILE: Acesso Rápido PRIMEIRO (mais importante para operadores) */}
        <div className="block md:hidden">
          <h2 className="text-lg font-bold font-mono text-foreground uppercase mb-3 flex items-center gap-2">
            <span className="text-primary">▸</span> O QUE VOCÊ QUER FAZER?
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Escanear Ativo */}
            <Link href="/scan">
              <IndustrialCard className="cursor-pointer hover:border-primary transition-colors h-full">
                <div className="flex flex-col items-center justify-center text-center p-4 gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <QrCode className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm font-mono uppercase">ESCANEAR</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ler QR Code
                    </p>
                  </div>
                </div>
              </IndustrialCard>
            </Link>

            {/* Lista de Ativos */}
            <Link href="/assets">
              <IndustrialCard className="cursor-pointer hover:border-primary transition-colors h-full">
                <div className="flex flex-col items-center justify-center text-center p-4 gap-3">
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Box className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm font-mono uppercase">EQUIPAMENTOS</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ver lista
                    </p>
                  </div>
                </div>
              </IndustrialCard>
            </Link>

            {/* Registro Rápido */}
            <Link href="/quick-event">
              <IndustrialCard className="cursor-pointer hover:border-primary transition-colors h-full">
                <div className="flex flex-col items-center justify-center text-center p-4 gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <ClipboardList className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm font-mono uppercase">REGISTRAR</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Sem QR Code
                    </p>
                  </div>
                </div>
              </IndustrialCard>
            </Link>

            {/* Histórico */}
            <Link href="/audit-log">
              <IndustrialCard className="cursor-pointer hover:border-primary transition-colors h-full">
                <div className="flex flex-col items-center justify-center text-center p-4 gap-3">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <History className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm font-mono uppercase">HISTÓRICO</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ver registros
                    </p>
                  </div>
                </div>
              </IndustrialCard>
            </Link>
          </div>
        </div>

        {/* V1.2: Dashboard Minimalista - 3 KPIs Principais (COMPACTO NO MOBILE) */}
        <div>
          <h2 className="text-lg md:text-xl font-bold font-mono text-foreground uppercase mb-3 flex items-center gap-2">
            <span className="text-primary">▸</span> RESUMO DO MÊS
          </h2>
          
          <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4">
            {/* KPI 1: Total de Eventos */}
            <IndustrialCard className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
              <div className="p-3 md:p-6">
                <div className="text-xs font-mono text-muted-foreground mb-1 uppercase">Total de Registros</div>
                <div className="text-2xl md:text-4xl font-bold font-mono text-foreground">{kpis.totalEventosAtual}</div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  {parseFloat(variacao) > 0 ? (
                    <>
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-green-500">+{variacao}%</span>
                    </>
                  ) : (
                    <span className="text-red-500">{variacao}%</span>
                  )}
                </div>
              </div>
            </IndustrialCard>

            {/* KPI 2: Ativos Saudáveis */}
            <IndustrialCard className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
              <div className="p-3 md:p-6">
                <div className="text-xs font-mono text-muted-foreground mb-1 uppercase">Em Dia</div>
                <div className="text-2xl md:text-4xl font-bold font-mono text-foreground">{percentualSaudaveis}%</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {kpis.ativosSaudaveis} de {kpis.totalAtivos}
                </div>
              </div>
            </IndustrialCard>

            {/* KPI 3: Ativos Negligenciados */}
            <IndustrialCard className="bg-gradient-to-br from-red-500/5 to-red-500/10 border-red-500/20">
              <div className="p-3 md:p-6">
                <div className="text-xs font-mono text-muted-foreground mb-1 uppercase">Parados</div>
                <div className="text-2xl md:text-4xl font-bold font-mono text-foreground">{kpis.ativosNegligenciados}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  +30 dias
                </div>
              </div>
            </IndustrialCard>
          </div>

          {/* Detalhes (Oculto no mobile por padrão, visível no desktop) */}
          <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-6">
            <IndustrialCard>
              <div className="p-6">
                <h3 className="text-sm font-mono font-bold uppercase text-muted-foreground mb-4">
                  Tipos de Registro (Últimos 30 dias)
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
                  Equipamentos Parados (Ação Necessária)
                </h3>
                <div className="space-y-3">
                  {kpis.ativosNegligenciadosList.map((ativo: any) => (
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

        {/* DESKTOP: Acesso Rápido (grid completo) */}
        <div className="hidden md:block">
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
                    <h3 className="font-bold text-lg font-mono uppercase">LISTA DE EQUIPAMENTOS</h3>
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
                    <h3 className="font-bold text-lg font-mono uppercase">HISTÓRICO COMPLETO</h3>
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
              Sistema de rastreamento industrial via QR/NFC. Cada escaneamento gera um registro. 
              Cada registro alimenta o histórico. O histórico vira inteligência operacional.
            </p>
          </div>
        </IndustrialCard>
      </div>
    </Layout>
  );
}
