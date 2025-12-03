import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { IndustrialCard } from "@/components/ui/industrial-card";
import { IndustrialButton } from "@/components/ui/industrial-button";
import { IndustrialInput } from "@/components/ui/industrial-input";
import { Search, Filter, X, Download, ArrowLeft, CheckCircle2, Clock, Eye, AlertTriangle, Wrench, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getEvents, type Event } from "@/lib/supabase";

export default function AuditLog() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("TODOS");
  const [dateFilter, setDateFilter] = useState("TODOS");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error("Erro ao carregar eventos:", error);
        toast.error("Erro ao carregar histórico");
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  const allFilteredEvents = events.filter((event) => {
    const matchesSearch =
      event.operator?.toLowerCase().includes(search.toLowerCase()) ||
      event.observation?.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "TODOS" || event.type === typeFilter;
    
    let matchesDate = true;
    if (dateFilter !== "TODOS") {
      const eventDate = new Date(event.created_at);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dateFilter === "HOJE") matchesDate = diffDays === 0;
      else if (dateFilter === "7DIAS") matchesDate = diffDays <= 7;
      else if (dateFilter === "30DIAS") matchesDate = diffDays <= 30;
    }

    return matchesSearch && matchesType && matchesDate;
  });

  // Paginação
  const totalPages = Math.ceil(allFilteredEvents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const filteredEvents = allFilteredEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const clearFilters = () => {
    setSearch("");
    setDateFilter("TODOS");
    setTypeFilter("TODOS");
    setCurrentPage(1);
  };

  const exportToCSV = () => {
    const headers = ["DATA/HORA", "TIPO", "OPERADOR", "OBSERVAÇÃO"];
    const rows = filteredEvents.map(event => [
      new Date(event.created_at).toLocaleString("pt-BR"),
      event.type,
      event.operator || "",
      event.observation || "",
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `historico_completo_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();

    toast.success("CSV exportado com sucesso!");
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "CHECKIN": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "CHECKOUT": return <Clock className="h-4 w-4 text-blue-500" />;
      case "INSPECTION": return <Eye className="h-4 w-4 text-yellow-500" />;
      case "ISSUE": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "MAINTENANCE": return <Wrench className="h-4 w-4 text-orange-500" />;
      case "IMPROVEMENT": return <TrendingUp className="h-4 w-4 text-purple-500" />;
      case "NONCONFORMITY": return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default: return null;
    }
  };

  const getEventLabel = (type: string) => {
    const labels: Record<string, string> = {
      CHECKIN: "Check-in",
      CHECKOUT: "Check-out",
      INSPECTION: "Inspeção",
      ISSUE: "Problema",
      MAINTENANCE: "Manutenção",
      IMPROVEMENT: "Melhoria",
      NONCONFORMITY: "Problema Grave",
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground font-mono">Carregando histórico...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <IndustrialButton variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </IndustrialButton>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-mono text-foreground uppercase">
                HISTÓRICO COMPLETO
              </h1>
              <p className="text-muted-foreground mt-1 font-mono text-sm">
                {filteredEvents.length} DE {events.length} EVENTOS
              </p>
            </div>
          </div>

          <IndustrialButton variant="outline" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            EXPORTAR CSV
          </IndustrialButton>
        </div>

        <IndustrialCard className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <IndustrialInput
                placeholder="Buscar por operador ou observação..."
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

            {(search || typeFilter !== "TODOS" || dateFilter !== "TODOS") && (
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
            <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-muted-foreground uppercase block mb-2">
                  Tipo de Evento
                </label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODOS">TODOS</SelectItem>
                    <SelectItem value="CHECKIN">Check-in</SelectItem>
                    <SelectItem value="CHECKOUT">Check-out</SelectItem>
                    <SelectItem value="INSPECTION">Inspeção</SelectItem>
                    <SelectItem value="ISSUE">Problema</SelectItem>
                    <SelectItem value="MAINTENANCE">Manutenção</SelectItem>
                    <SelectItem value="IMPROVEMENT">Melhoria</SelectItem>
                    <SelectItem value="NONCONFORMITY">Problema Grave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-xs font-mono text-muted-foreground uppercase block mb-2">
                  Período
                </label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODOS">TODOS</SelectItem>
                    <SelectItem value="HOJE">Hoje</SelectItem>
                    <SelectItem value="7DIAS">Últimos 7 dias</SelectItem>
                    <SelectItem value="30DIAS">Últimos 30 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </IndustrialCard>

        <div className="space-y-3">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground font-mono">
                Nenhum evento encontrado.
              </p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <IndustrialCard key={event.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getEventIcon(event.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-bold text-sm">
                        {getEventLabel(event.type)}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                        {new Date(event.created_at).toLocaleString("pt-BR")}
                      </span>
                    </div>
                    {event.operator && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Operador: {event.operator}
                      </p>
                    )}
                    {event.observation && (
                      <p className="text-sm mt-1 text-foreground">
                        {event.observation}
                      </p>
                    )}
                  </div>
                </div>
              </IndustrialCard>
            ))
          )}
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <IndustrialButton
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </IndustrialButton>
            <span className="text-sm font-mono text-muted-foreground px-4">
              Página {currentPage} de {totalPages}
            </span>
            <IndustrialButton
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Próxima
            </IndustrialButton>
          </div>
        )}
      </div>
    </Layout>
  );
}
