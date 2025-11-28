import React from "react";
import Layout from "@/components/Layout";
import { IndustrialCard } from "@/components/ui/industrial-card";
import { IndustrialButton } from "@/components/ui/industrial-button";
import { IndustrialInput } from "@/components/ui/industrial-input";
import { Search, Filter, Plus, MoreHorizontal } from "lucide-react";
import { Link } from "wouter";

const assets = [
  { id: "TOR-001", name: "TORNO CNC-01", type: "MÁQUINA", location: "SETOR A", status: "OPERACIONAL", lastEvent: "10:42" },
  { id: "PRE-020", name: "PRENSA HIDRÁULICA H-20", type: "MÁQUINA", location: "SETOR B", status: "MANUTENÇÃO", lastEvent: "09:15" },
  { id: "COR-005", name: "CORTADORA LASER L-05", type: "MÁQUINA", location: "SETOR A", status: "CRÍTICO", lastEvent: "08:30" },
  { id: "EMP-003", name: "EMPILHADEIRA E-03", type: "VEÍCULO", location: "LOGÍSTICA", status: "OPERACIONAL", lastEvent: "08:00" },
  { id: "FUR-012", name: "FURADEIRA DE BANCADA", type: "FERRAMENTA", location: "OFICINA", status: "OPERACIONAL", lastEvent: "ONTEM" },
  { id: "SOL-008", name: "MÁQUINA DE SOLDA MIG", type: "MÁQUINA", location: "OFICINA", status: "OPERACIONAL", lastEvent: "ONTEM" },
];

export default function AssetsList() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-mono text-foreground uppercase">
              Inventário de Ativos
            </h1>
            <p className="text-muted-foreground mt-1 font-mono text-sm">
              GERENCIAMENTO CENTRALIZADO // 142 ITENS
            </p>
          </div>
          <Link href="/assets/new">
            <IndustrialButton>
              <Plus className="mr-2 h-4 w-4" />
              NOVO ATIVO
            </IndustrialButton>
          </Link>
        </div>

        <IndustrialCard className="p-4">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <IndustrialInput placeholder="BUSCAR POR ID, NOME OU TIPO..." className="pl-9" />
            </div>
            <IndustrialButton variant="outline" className="w-full md:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              FILTROS
            </IndustrialButton>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase font-mono border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">NOME</th>
                  <th className="px-4 py-3 font-medium">TIPO</th>
                  <th className="px-4 py-3 font-medium">LOCALIZAÇÃO</th>
                  <th className="px-4 py-3 font-medium">STATUS</th>
                  <th className="px-4 py-3 font-medium text-right">AÇÕES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {assets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-accent/5 transition-colors group">
                    <td className="px-4 py-3 font-mono text-primary font-bold">
                      <Link href={`/assets/${asset.id}`}>{asset.id}</Link>
                    </td>
                    <td className="px-4 py-3 font-medium">{asset.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{asset.type}</td>
                    <td className="px-4 py-3 font-mono text-xs">{asset.location}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={asset.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <IndustrialButton variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </IndustrialButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </IndustrialCard>
      </div>
    </Layout>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    OPERACIONAL: "bg-green-500/10 text-green-500 border-green-500/20",
    MANUTENÇÃO: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    CRÍTICO: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-none text-xs font-mono font-medium border ${styles[status] || styles.OPERACIONAL}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${status === 'OPERACIONAL' ? 'bg-green-500' : status === 'MANUTENÇÃO' ? 'bg-yellow-500' : 'bg-red-500'}`} />
      {status}
    </span>
  );
}
