import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { IndustrialCard, IndustrialCardContent, IndustrialCardHeader, IndustrialCardTitle } from "@/components/ui/industrial-card";
import { IndustrialButton } from "@/components/ui/industrial-button";
import { ArrowLeft, QrCode, History, FileText, Settings, Printer, Download, CheckCircle2, Clock, AlertTriangle, Wrench, Eye, TrendingUp } from "lucide-react";
import { Link, useRoute } from "wouter";
import { getAssetByCode, getEvents, type Asset, type Event } from "@/lib/supabase";
import { toast } from "sonner";

export default function AssetDetail() {
  const [, params] = useRoute("/assets/:id");
  const id = params?.id || "TOR-001";
  
  const [asset, setAsset] = useState<Asset | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAssetData() {
      try {
        const assetData = await getAssetByCode(id);
        const eventsData = await getEvents(assetData.id);
        setAsset(assetData);
        setEvents(eventsData);
      } catch (error) {
        console.error("Erro ao carregar ativo:", error);
        toast.error("Erro ao carregar dados do equipamento");
      } finally {
        setLoading(false);
      }
    }
    loadAssetData();
  }, [id]);

  const exportToCSV = () => {
    if (!asset || events.length === 0) {
      toast.error("Nenhum evento para exportar");
      return;
    }

    const headers = ["DATA/HORA", "TIPO", "OPERADOR", "OBSERVAÇÃO"];
    const rows = events.map(event => [
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
    link.download = `historico_${asset.code}_${new Date().toISOString().split("T")[0]}.csv`;
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
      default: return <FileText className="h-4 w-4 text-muted-foreground" />;
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
            <p className="text-muted-foreground font-mono">Carregando equipamento...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!asset) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-muted-foreground font-mono">Equipamento não encontrado.</p>
          <Link href="/assets">
            <IndustrialButton className="mt-4">VOLTAR PARA LISTA</IndustrialButton>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Breadcrumb & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Link href="/assets">
              <IndustrialButton variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </IndustrialButton>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-mono text-foreground uppercase">
                  {asset.code}
                </h1>
              </div>
              <p className="text-muted-foreground mt-1 font-mono text-sm">
                {asset.name} // {asset.location || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/assets/${asset.code}/print`}>
              <IndustrialButton variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                ETIQUETA
              </IndustrialButton>
            </Link>
            <Link href="/quick-event">
              <IndustrialButton variant="secondary">
                REGISTRAR
              </IndustrialButton>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Specifications */}
            <IndustrialCard>
              <IndustrialCardHeader>
                <IndustrialCardTitle>INFORMAÇÕES TÉCNICAS</IndustrialCardTitle>
              </IndustrialCardHeader>
              <IndustrialCardContent>
                <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                  <div>
                    <span className="text-muted-foreground">CATEGORIA:</span>
                    <p className="font-bold mt-1">{asset.category || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">LOCALIZAÇÃO:</span>
                    <p className="font-bold mt-1">{asset.location || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">FABRICANTE:</span>
                    <p className="font-bold mt-1">{asset.manufacturer || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">MODELO:</span>
                    <p className="font-bold mt-1">{asset.model || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ANO:</span>
                    <p className="font-bold mt-1">{asset.year || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Nº SÉRIE:</span>
                    <p className="font-bold mt-1">{asset.serial_number || "N/A"}</p>
                  </div>
                </div>
              </IndustrialCardContent>
            </IndustrialCard>

            {/* Instructions */}
            {asset.instructions && (
              <IndustrialCard className="border-blue-500/20 bg-blue-500/5">
                <IndustrialCardHeader>
                  <IndustrialCardTitle className="text-blue-600">INSTRUÇÕES OPERACIONAIS</IndustrialCardTitle>
                </IndustrialCardHeader>
                <IndustrialCardContent>
                  <div className="space-y-2 text-sm">
                    {asset.instructions.split("\n").map((line, idx) => (
                      <p key={idx} className="font-mono">{line}</p>
                    ))}
                  </div>
                  {asset.maintenance_interval_days && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <span className="text-xs text-muted-foreground uppercase">Intervalo de Manutenção:</span>
                      <p className="font-bold font-mono">{asset.maintenance_interval_days} dias</p>
                    </div>
                  )}
                </IndustrialCardContent>
              </IndustrialCard>
            )}

            {/* Event History */}
            <IndustrialCard>
              <IndustrialCardHeader className="flex flex-row items-center justify-between">
                <IndustrialCardTitle>HISTÓRICO DE EVENTOS ({events.length})</IndustrialCardTitle>
                <IndustrialButton variant="ghost" size="sm" onClick={exportToCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  EXPORTAR CSV
                </IndustrialButton>
              </IndustrialCardHeader>
              <IndustrialCardContent>
                {events.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-8">
                    Nenhum evento registrado.
                  </p>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:bg-accent/5 transition-colors"
                      >
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
                    ))}
                  </div>
                )}
              </IndustrialCardContent>
            </IndustrialCard>
          </div>

          {/* Sidebar - QR Code */}
          <div className="space-y-6">
            <IndustrialCard>
              <IndustrialCardHeader>
                <IndustrialCardTitle>QR CODE</IndustrialCardTitle>
              </IndustrialCardHeader>
              <IndustrialCardContent>
                <div className="aspect-square bg-white p-4 rounded-lg flex items-center justify-center">
                  <QrCode className="h-full w-full text-black" />
                </div>
                <p className="text-xs text-center text-muted-foreground mt-3 font-mono">
                  {asset.code}
                </p>
              </IndustrialCardContent>
            </IndustrialCard>
          </div>
        </div>
      </div>
    </Layout>
  );
}
