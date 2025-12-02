import React, { useState, useEffect, useMemo, useRef } from "react";
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
import { getAssets, type Asset } from "@/lib/supabase";

export default function AssetsList() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("TODOS");
  const [showFilters, setShowFilters] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadAssets() {
      try {
        const data = await getAssets();
        setAssets(data);
      } catch (error) {
        console.error("Erro ao carregar ativos:", error);
        toast.error("Erro ao carregar equipamentos");
      } finally {
        setLoading(false);
      }
    }
    loadAssets();
  }, []);

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch =
        asset.name.toLowerCase().includes(search.toLowerCase()) ||
        asset.code.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "TODOS" || asset.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [assets, search, categoryFilter]);

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("TODOS");
  };

  const exportToCSV = () => {
    const headers = ["CÓDIGO", "NOME", "CATEGORIA", "LOCALIZAÇÃO", "FABRICANTE"];
    const rows = filteredAssets.map(asset => [
      asset.code,
      asset.name,
      asset.category || "",
      asset.location || "",
      asset.manufacturer || "",
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `ativos_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();

    toast.success("CSV exportado com sucesso!");
  };

  const importFromCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      toast.success("Importação em desenvolvimento", {
        description: "Funcionalidade será implementada em breve.",
      });
    };
    reader.readAsText(file);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground font-mono">Carregando equipamentos...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-mono text-foreground uppercase">
              EQUIPAMENTOS
            </h1>
            <p className="text-muted-foreground mt-1 font-mono text-sm">
              {filteredAssets.length} DE {assets.length} EQUIPAMENTOS
            </p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <Link href="/assets/new" className="flex-1 md:flex-initial">
              <IndustrialButton className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                NOVO
              </IndustrialButton>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IndustrialButton variant="outline">
                  <MoreHorizontal className="h-4 w-4" />
                </IndustrialButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={exportToCSV}>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  Importar CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={importFromCSV}
              className="hidden"
            />
          </div>
        </div>

        <IndustrialCard className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <IndustrialInput
                placeholder="Buscar por código ou nome..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <IndustrialButton
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:w-auto"
            >
              <Filter className="mr-2 h-4 w-4" />
              FILTROS
            </IndustrialButton>

            {(search || categoryFilter !== "TODOS") && (
              <IndustrialButton
                variant="ghost"
                onClick={clearFilters}
                className="md:w-auto"
              >
                <X className="mr-2 h-4 w-4" />
                LIMPAR
              </IndustrialButton>
            )}
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-mono text-muted-foreground uppercase block mb-2">
                  Categoria
                </label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODOS">TODOS</SelectItem>
                    <SelectItem value="Usinagem">Usinagem</SelectItem>
                    <SelectItem value="Conformação">Conformação</SelectItem>
                    <SelectItem value="Corte">Corte</SelectItem>
                    <SelectItem value="Soldagem">Soldagem</SelectItem>
                    <SelectItem value="Movimentação">Movimentação</SelectItem>
                    <SelectItem value="Utilidades">Utilidades</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </IndustrialCard>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map((asset) => (
            <Link key={asset.id} href={`/assets/${asset.code}`}>
              <IndustrialCard className="cursor-pointer hover:border-primary transition-colors h-full">
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-mono font-bold text-lg text-foreground uppercase">
                        {asset.code}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {asset.name}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    {asset.category && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">CATEGORIA:</span>
                        <span className="font-bold">{asset.category}</span>
                      </div>
                    )}
                    {asset.location && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">LOCAL:</span>
                        <span className="font-bold">{asset.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </IndustrialCard>
            </Link>
          ))}
        </div>

        {filteredAssets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-mono">
              Nenhum equipamento encontrado.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
