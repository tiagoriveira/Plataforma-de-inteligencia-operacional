import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { IndustrialCard } from "@/components/ui/industrial-card";
import { IndustrialButton } from "@/components/ui/industrial-button";
import { Activity, AlertTriangle, ArrowRight, Box as BoxIcon, Wrench as WrenchIcon, QrCode as QrCodeIcon, BrainCircuit } from "lucide-react";
import { Link } from "wouter";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getPredictiveAlerts } from "@/lib/predictiveAI";

// --- Components for Drag & Drop ---

function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

// --- Main Dashboard Component ---

export default function Home() {
  // Initial state for widgets
  const [items, setItems] = useState([
    "kpi-total",
    "kpi-operation",
    "kpi-maintenance",
    "kpi-critical",
  ]);

  const [predictiveAlerts, setPredictiveAlerts] = useState<any[]>([]);

  // Load saved layout on mount
  useEffect(() => {
    const savedLayout = localStorage.getItem("dashboard-layout");
    if (savedLayout) {
      try {
        setItems(JSON.parse(savedLayout));
      } catch (e) {
        console.error("Failed to parse saved layout", e);
      }
    }
    
    // Carrega alertas preditivos (IA Layer 2)
    const alerts = getPredictiveAlerts();
    setPredictiveAlerts(alerts);
  }, []);

  // Save layout on change
  useEffect(() => {
    localStorage.setItem("dashboard-layout", JSON.stringify(items));
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Widget Registry
  const renderWidget = (id: string) => {
    switch (id) {
      case "kpi-total":
        return (
          <KpiCard
            title="ATIVOS TOTAIS"
            value="142"
            trend="+3"
            trendLabel="novos esta semana"
            icon={BoxIcon}
          />
        );
      case "kpi-operation":
        return (
          <KpiCard
            title="EM OPERAÇÃO"
            value="128"
            status="success"
            icon={Activity}
          />
        );
      case "kpi-maintenance":
        return (
          <KpiCard
            title="MANUTENÇÃO"
            value="08"
            status="warning"
            icon={WrenchIcon}
          />
        );
      case "kpi-critical":
        return (
          <KpiCard
            title="CRÍTICOS"
            value="06"
            status="destructive"
            icon={AlertTriangle}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-mono text-foreground uppercase">
              Visão Geral
            </h1>
            <p className="text-muted-foreground mt-1 font-mono text-sm">
              DADOS EM TEMPO REAL // UNIDADE FABRIL 01
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/scan">
              <IndustrialButton variant="industrial" size="lg">
                <QrCodeIcon className="mr-2 h-4 w-4" />
                ESCANEAR ATIVO
              </IndustrialButton>
            </Link>
          </div>
        </div>

        {/* Draggable KPI Grid */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {items.map((id) => (
                <SortableItem key={id} id={id}>
                  {renderWidget(id)}
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Predictive Alerts Section (IA Layer 2) */}
        {predictiveAlerts.length > 0 && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-2 mb-4">
                    <BrainCircuit className="h-5 w-5 text-purple-500" />
                    <h2 className="text-lg font-bold font-mono uppercase text-purple-500">
                        Insights Preditivos (IA)
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {predictiveAlerts.map((alert) => (
                        <div key={alert.assetId} className="bg-purple-500/5 border border-purple-500/20 p-4 rounded-lg flex items-start gap-4">
                            <div className="bg-purple-500/10 p-2 rounded-full">
                                <AlertTriangle className="h-5 w-5 text-purple-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-foreground">{alert.assetId}</h3>
                                <p className="text-xs text-muted-foreground mt-1">{alert.recommendation}</p>
                                <div className="mt-2 flex gap-4 text-xs font-mono">
                                    <span className="text-purple-400">MTBF: {alert.mtbf}h</span>
                                    <span className="text-purple-400">Confiabilidade: {alert.reliability}%</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Main Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-mono font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Atividade Recente
              </h2>
              <IndustrialButton variant="link" size="sm">
                VER TUDO
              </IndustrialButton>
            </div>

            <div className="space-y-3">
              <ActivityItem
                time="10:42"
                asset="TORNO CNC-01"
                action="Check-in Operacional"
                user="Op. Silva"
                status="success"
              />
              <ActivityItem
                time="09:15"
                asset="PRENSA HIDRÁULICA H-20"
                action="Manutenção Preventiva"
                user="Téc. Santos"
                status="warning"
              />
              <ActivityItem
                time="08:30"
                asset="CORTADORA LASER L-05"
                action="Falha de Sensor"
                user="Sistema"
                status="destructive"
              />
              <ActivityItem
                time="08:00"
                asset="EMPILHADEIRA E-03"
                action="Inspeção Diária"
                user="Op. Costa"
                status="success"
              />
            </div>
          </div>

          {/* Quick Actions & Status */}
          <div className="space-y-6">
            <IndustrialCard className="h-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold leading-none tracking-tight text-foreground mb-4">
                  Acesso Rápido
                </h3>
                <div className="space-y-4">
                  <Link href="/assets">
                    <div className="group flex items-center justify-between p-3 border border-border hover:border-primary/50 hover:bg-accent/10 cursor-pointer transition-all mb-3 rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-primary/20 flex items-center justify-center text-primary rounded-md">
                          <BoxIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-mono text-sm font-bold">
                            LISTA DE ATIVOS
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Gerenciar inventário
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>

                  <Link href="/scan">
                    <div className="group flex items-center justify-between p-3 border border-border hover:border-primary/50 hover:bg-accent/10 cursor-pointer transition-all rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-primary/20 flex items-center justify-center text-primary rounded-md">
                          <QrCodeIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-mono text-sm font-bold">
                            NOVO REGISTRO
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Escanear QR Code
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                </div>
              </div>
            </IndustrialCard>

            <div className="relative h-48 w-full overflow-hidden border border-border group rounded-xl">
              <img
                src="/assets/machine-1.png"
                alt="Featured Asset"
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity grayscale hover:grayscale-0 duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
              <div className="absolute bottom-4 left-4">
                <div className="text-xs font-mono text-primary mb-1">
                  DESTAQUE
                </div>
                <div className="font-bold text-lg">LINHA DE MONTAGEM A</div>
                <div className="text-xs text-muted-foreground">
                  Eficiência: 98.5%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function KpiCard({
  title,
  value,
  trend,
  trendLabel,
  status = "default",
  icon: Icon,
}: any) {
  const statusColors: Record<string, string> = {
    default: "text-foreground",
    success: "text-green-500",
    warning: "text-yellow-500",
    destructive: "text-red-500",
  };

  return (
    <IndustrialCard className="h-full">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-md bg-accent/10 ${statusColors[status]}`}>
            <Icon className="h-5 w-5" />
          </div>
          {trend && (
            <div className="text-xs font-mono text-green-500 bg-green-500/10 px-2 py-1 rounded">
              {trend}
            </div>
          )}
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground font-mono uppercase tracking-wider">
            {title}
          </h3>
          <div className="text-3xl font-bold font-mono">{value}</div>
          {trendLabel && (
            <p className="text-xs text-muted-foreground">{trendLabel}</p>
          )}
        </div>
      </div>
    </IndustrialCard>
  );
}

function ActivityItem({ time, asset, action, user, status }: any) {
  const statusColors: Record<string, string> = {
    success: "border-l-green-500",
    warning: "border-l-yellow-500",
    destructive: "border-l-red-500",
  };

  return (
    <div
      className={`bg-card border border-border border-l-4 p-4 rounded-r-md shadow-sm hover:shadow-md transition-all ${statusColors[status]}`}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground">
              {time}
            </span>
            <span className="font-bold text-sm text-foreground">{asset}</span>
          </div>
          <p className="text-sm text-muted-foreground">{action}</p>
        </div>
        <div className="px-2 py-1 bg-accent/10 rounded text-xs font-mono font-medium">
          {user}
        </div>
      </div>
    </div>
  );
}
