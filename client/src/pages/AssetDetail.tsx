import React from "react";
import Layout from "@/components/Layout";
import { IndustrialCard, IndustrialCardContent, IndustrialCardHeader, IndustrialCardTitle } from "@/components/ui/industrial-card";
import { IndustrialButton } from "@/components/ui/industrial-button";
import { ArrowLeft, QrCode, History, FileText, Settings, Printer, Download } from "lucide-react";
import { Link, useRoute } from "wouter";

export default function AssetDetail() {
  const [, params] = useRoute("/assets/:id");
  const id = params?.id || "TOR-001";

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
                <h1 className="text-3xl font-bold tracking-tight font-mono text-foreground uppercase">
                  {id}
                </h1>
                <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-0.5 text-xs font-mono">
                  OPERACIONAL
                </span>
              </div>
              <p className="text-muted-foreground mt-1 font-mono text-sm">
                TORNO CNC-01 // SETOR A
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/assets/${id}/print`}>
              <IndustrialButton variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                IMPRIMIR ETIQUETA
              </IndustrialButton>
            </Link>
            <Link href="/maintenance">
              <IndustrialButton className="hidden md:inline-flex">
                REGISTRAR MANUTENÇÃO
              </IndustrialButton>
            </Link>
            <Link href="/quick-event">
              <IndustrialButton variant="secondary">
                REGISTRO RÁPIDO
              </IndustrialButton>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image & Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative aspect-video bg-muted border border-border overflow-hidden group">
                <img 
                  src="/assets/machine-1.png" 
                  alt="Asset" 
                  className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-xs font-mono text-white">
                  IMG_REF_2025.JPG
                </div>
              </div>
              <div className="space-y-4">
                <InfoRow label="FABRICANTE" value="Romi S.A." />
                <InfoRow label="MODELO" value="Centur 30D" />
                <InfoRow label="ANO" value="2022" />
                <InfoRow label="Nº SÉRIE" value="RM-99887766" />
                <InfoRow label="GARANTIA" value="ATÉ DEZ/2025" />
                <div className="pt-4 border-t border-border">
                  <div className="text-xs text-muted-foreground font-mono mb-2">QR CODE TOKEN</div>
                  <div className="bg-white p-2 w-fit">
                    <QrCode className="h-24 w-24 text-black" />
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <IndustrialCard>
              <IndustrialCardHeader>
                <div className="flex items-center justify-between">
                  <IndustrialCardTitle className="flex items-center gap-2">
                    <History className="h-4 w-4" />
                    Histórico de Eventos
                  </IndustrialCardTitle>
                  <IndustrialButton 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      // V1.1: Export CSV
                      const csv = `"Data/Hora","Tipo","Operador","Observação"\n"HOJE, 10:42","Check-in","Op. Silva","Início de turno"\n"ONTEM, 16:30","Check-out","Op. Silva","Fim de turno"`;
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `historico_${id}_${new Date().toISOString().split('T')[0]}.csv`;
                      a.click();
                    }}
                  >
                    <Download className="mr-2 h-3 w-3" />
                    EXPORTAR CSV
                  </IndustrialButton>
                </div>
              </IndustrialCardHeader>
              <IndustrialCardContent>
                <div className="relative border-l border-border ml-3 space-y-8 py-2">
                  <TimelineItem 
                    date="HOJE, 10:42"
                    title="Check-in Operacional"
                    user="Op. Silva"
                    description="Início de turno. Verificação visual OK. Nível de óleo OK."
                    type="success"
                  />
                  <TimelineItem 
                    date="ONTEM, 16:30"
                    title="Check-out Operacional"
                    user="Op. Silva"
                    description="Fim de turno. Limpeza realizada."
                    type="default"
                  />
                  <TimelineItem 
                    date="26 NOV, 09:15"
                    title="Manutenção Preventiva"
                    user="Téc. Santos"
                    description="Troca de filtros de óleo e ajuste de correias. Próxima revisão em 30 dias."
                    type="warning"
                  />
                </div>
              </IndustrialCardContent>
            </IndustrialCard>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* V1.1: Instruções Operacionais */}
            <IndustrialCard className="bg-blue-500/5 border-blue-500/20">
              <IndustrialCardHeader>
                <IndustrialCardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Instruções Operacionais
                </IndustrialCardTitle>
              </IndustrialCardHeader>
              <IndustrialCardContent>
                <div className="text-sm text-foreground font-mono leading-relaxed whitespace-pre-line">
                  ☐ Seiri (Utilização): Remover itens desnecessários
                  ☐ Seiton (Organização): Organizar ferramentas
                  ☐ Seiso (Limpeza): Limpar equipamento
                  ☐ Seiketsu (Padronização): Verificar conformidade
                  ☐ Shitsuke (Disciplina): Confirmar rotina
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="text-xs text-muted-foreground font-mono">INTERVALO DE MANUTENÇÃO</div>
                  <div className="text-sm font-bold font-mono text-foreground mt-1">90 dias</div>
                  <div className="text-xs text-muted-foreground mt-1">Próxima manutenção: 15 FEV 2026</div>
                </div>
              </IndustrialCardContent>
            </IndustrialCard>

            <IndustrialCard>
              <IndustrialCardHeader>
                <IndustrialCardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Documentação
                </IndustrialCardTitle>
              </IndustrialCardHeader>
              <IndustrialCardContent className="space-y-2">
                <DocLink name="Manual de Operação.pdf" size="2.4 MB" />
                <DocLink name="Esquema Elétrico.pdf" size="1.1 MB" />
                <DocLink name="Certificado de Calibração.pdf" size="0.5 MB" />
              </IndustrialCardContent>
            </IndustrialCard>

            <IndustrialCard>
              <IndustrialCardHeader>
                <IndustrialCardTitle className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Especificações
                </IndustrialCardTitle>
              </IndustrialCardHeader>
              <IndustrialCardContent className="space-y-3">
                <SpecRow label="Potência" value="15 HP" />
                <SpecRow label="Tensão" value="380V Trifásico" />
                <SpecRow label="Peso" value="2500 kg" />
                <SpecRow label="Dimensões" value="2.5 x 1.2 x 1.8 m" />
              </IndustrialCardContent>
            </IndustrialCard>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function InfoRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between border-b border-border/50 pb-2 last:border-0">
      <span className="text-xs font-mono text-muted-foreground uppercase">{label}</span>
      <span className="text-sm font-medium font-mono">{value}</span>
    </div>
  );
}

function SpecRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

function DocLink({ name, size }: { name: string, size: string }) {
  return (
    <div className="flex items-center justify-between p-2 border border-border hover:bg-accent/10 cursor-pointer transition-colors group">
      <div className="flex items-center gap-2 overflow-hidden">
        <FileText className="h-4 w-4 text-primary flex-shrink-0" />
        <span className="text-sm truncate group-hover:text-primary transition-colors">{name}</span>
      </div>
      <span className="text-xs font-mono text-muted-foreground flex-shrink-0">{size}</span>
    </div>
  );
}

function TimelineItem({ date, title, user, description, type = "default" }: any) {
  const colors: Record<string, string> = {
    default: "bg-primary border-primary",
    success: "bg-green-500 border-green-500",
    warning: "bg-yellow-500 border-yellow-500",
    destructive: "bg-red-500 border-red-500",
    improvement: "bg-purple-500 border-purple-500",
  };

  return (
    <div className="relative pl-6">
      <div className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border ${colors[type] || colors.default}`} />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
        <span className="text-xs font-mono text-muted-foreground">{date}</span>
        <span className="text-xs font-mono bg-secondary px-2 py-0.5 text-secondary-foreground rounded-sm">{user}</span>
      </div>
      <h4 className="text-sm font-bold uppercase tracking-wide mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
