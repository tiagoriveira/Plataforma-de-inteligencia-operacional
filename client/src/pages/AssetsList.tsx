import React, { useState, useMemo, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { IndustrialCard } from "@/components/ui/industrial-card";
import { IndustrialButton } from "@/components/ui/industrial-button";
import { IndustrialInput } from "@/components/ui/industrial-input";
import { Search, Filter, Plus, MoreHorizontal, X, Download, Upload } from "lucide-react";
import { Link } from "wouter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const initialAssets = [
  { id: "TOR-001", name: "TORNO CNC-01", type: "MÁQUINA", location: "SETOR A", status: "OPERACIONAL", lastEvent: "10:42" },
  { id: "PRE-020", name: "PRENSA HIDRÁULICA H-20", type: "MÁQUINA", location: "SETOR B", status: "MANUTENÇÃO", lastEvent: "09:15" },
  { id: "COR-005", name: "CORTADORA LASER L-05", type: "MÁQUINA", location: "SETOR A", status: "CRÍTICO", lastEvent: "08:30" },
  { id: "EMP-003", name: "EMPILHADEIRA E-03", type: "VEÍCULO", location: "LOGÍSTICA", status: "OPERACIONAL", lastEvent: "08:00" },
  { id: "FUR-012", name: "FURADEIRA DE BANCADA", type: "FERRAMENTA", location: "OFICINA", status: "OPERACIONAL", lastEvent: "ONTEM" },
  { id: "SOL-008", name: "MÁQUINA DE SOLDA MIG", type: "MÁQUINA", location: "OFICINA", status: "OPERACIONAL", lastEvent: "ONTEM" },
];

export default function AssetsList() {
  const [assets, setAssets] = useState(initialAssets);
  const [search, setSearch] = useState(() => localStorage.getItem("assets_search") || "");
  const [statusFilter, setStatusFilter] = useState(() => localStorage.getItem("assets_status_filter") || "TODOS");
  const [typeFilter, setTypeFilter] = useState(() => localStorage.getItem("assets_type_filter") || "TODOS");
  const [showFilters, setShowFilters] = useState(() => localStorage.getItem("assets_show_filters") === "true");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem("assets_search", search);
  }, [search]);

  useEffect(() => {
    localStorage.setItem("assets_status_filter", statusFilter);
  }, [statusFilter]);

  useEffect(() => {
    localStorage.setItem("assets_type_filter", typeFilter);
  }, [typeFilter]);

  useEffect(() => {
    localStorage.setItem("assets_show_filters", String(showFilters));
  }, [showFilters]);

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch =
        asset.name.toLowerCase().includes(search.toLowerCase()) ||
        asset.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "TODOS" || asset.status === statusFilter;
      const matchesType = typeFilter === "TODOS" || asset.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [assets, search, statusFilter, typeFilter]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("TODOS");
    setTypeFilter("TODOS");
  };

  const exportToCSV = () => {
    const headers = ["ID", "NOME", "TIPO", "LOCALIZAÇÃO", "STATUS", "ÚLTIMO EVENTO"];
    const rows = filteredAssets.map(asset => [
      asset.id,
      asset.name,
      asset.type,
      asset.location,
      asset.status,
      asset.lastEvent
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ativos_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Exportação concluída!", {
      description: `${filteredAssets.length} registros exportados para CSV.`,
    });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const lines = content.split("\n");
      // Skip header row
      const newAssets = lines.slice(1).filter(line => line.trim()).map(line => {
        const [id, name, type, location, status, lastEvent] = line.split(",");
        return {
          id: id?.trim() || `NEW-${Math.floor(Math.random() * 1000)}`,
          name: name?.trim() || "Novo Ativo",
          type: type?.trim() || "OUTRO",
          location: location?.trim() || "N/A",
          status: status?.trim() || "OPERACIONAL",
          lastEvent: lastEvent?.trim() || "AGORA"
        };
      });

      setAssets(prev => [...prev, ...newAssets]);
      toast.success("Importação concluída!", {
        description: `${newAssets.length} novos ativos adicionados.`,
      });
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const updateStatus = (id: string, newStatus: string) => {
    setAssets(prev => prev.map(asset => 
      asset.id === id ? { ...asset, status: newStatus } : asset
    ));
    toast.success("Status atualizado!", {
      description: `O ativo ${id} agora está ${newStatus}.`,
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-mono text-foreground uppercase">
              Inventário de Ativos
            </h1>
            <p className="text-muted-foreground mt-1 font-mono text-sm">
              GERENCIAMENTO CENTRALIZADO // {filteredAssets.length} ITENS
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href="https://loja.opintel.com.br/etiquetas-premium"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex"
            >
              <IndustrialButton variant="industrial" className="bg-amber-500 hover:bg-amber-600 text-black border-amber-600">
                <span className="mr-2">🏷️</span>
                COMPRAR ETIQUETAS PREMIUM
              </IndustrialButton>
            </a>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".csv"
              onChange={handleFileChange}
            />
            <IndustrialButton variant="outline" onClick={handleImportClick}>
              <Upload className="mr-2 h-4 w-4" />
              IMPORTAR CSV
            </IndustrialButton>
            <IndustrialButton variant="outline" onClick={exportToCSV}>
              <Download className="mr-2 h-4 w-4" />
              EXPORTAR CSV
            </IndustrialButton>
            <Link href="/assets/new">
              <IndustrialButton>
                <Plus className="mr-2 h-4 w-4" />
                NOVO ATIVO
              </IndustrialButton>
            </Link>
          </div>
        </div>

        <IndustrialCard className="p-4">
          <div className="space-y-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <IndustrialInput
                  placeholder="BUSCAR POR ID, NOME OU TIPO..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <IndustrialButton
                variant={showFilters ? "default" : "outline"}
                className="w-full md:w-auto"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                FILTROS
              </IndustrialButton>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-accent/5 rounded-md border border-border animate-in slide-in-from-top-2">
                <div className="space-y-2">
                  <label className="text-xs font-mono font-medium text-muted-foreground">STATUS</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TODOS">TODOS</SelectItem>
                      <SelectItem value="OPERACIONAL">OPERACIONAL</SelectItem>
                      <SelectItem value="MANUTENÇÃO">MANUTENÇÃO</SelectItem>
                      <SelectItem value="CRÍTICO">CRÍTICO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono font-medium text-muted-foreground">TIPO</label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TODOS">TODOS</SelectItem>
                      <SelectItem value="MÁQUINA">MÁQUINA</SelectItem>
                      <SelectItem value="VEÍCULO">VEÍCULO</SelectItem>
                      <SelectItem value="FERRAMENTA">FERRAMENTA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <IndustrialButton
                    variant="ghost"
                    className="w-full text-muted-foreground hover:text-destructive"
                    onClick={clearFilters}
                  >
                    <X className="mr-2 h-4 w-4" />
                    LIMPAR FILTROS
                  </IndustrialButton>
                </div>
              </div>
            )}
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
                {filteredAssets.length > 0 ? (
                  filteredAssets.map((asset) => (
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <IndustrialButton variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </IndustrialButton>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/assets/${asset.id}`}>Ver Detalhes</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Alterar Status</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => updateStatus(asset.id, "OPERACIONAL")}>
                              <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                              Operacional
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatus(asset.id, "MANUTENÇÃO")}>
                              <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
                              Manutenção
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatus(asset.id, "CRÍTICO")}>
                              <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                              Crítico
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      Nenhum ativo encontrado com os filtros selecionados.
                    </td>
                  </tr>
                )}
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
    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-mono font-medium border ${styles[status] || styles.OPERACIONAL}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${status === 'OPERACIONAL' ? 'bg-green-500' : status === 'MANUTENÇÃO' ? 'bg-yellow-500' : 'bg-red-500'}`} />
      {status}
    </span>
  );
}
