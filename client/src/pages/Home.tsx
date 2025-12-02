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
  History
} from "lucide-react";

export default function Home() {
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
