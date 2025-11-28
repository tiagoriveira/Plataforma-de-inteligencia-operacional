import React from "react";
import Layout from "@/components/Layout";
import { IndustrialCard, IndustrialCardContent, IndustrialCardHeader, IndustrialCardTitle } from "@/components/ui/industrial-card";
import { IndustrialButton } from "@/components/ui/industrial-button";
import { FileText, Download, Calendar, BarChart3 } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Reports() {
  
  const generatePDF = async () => {
    const element = document.getElementById("report-content");
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#1a1a1a", // Dark background for PDF
    });
    
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("relatorio-operacional.pdf");
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-mono text-foreground uppercase">
              Relatórios
            </h1>
            <p className="text-muted-foreground mt-1 font-mono text-sm">
              ANÁLISE DE DADOS E EXPORTAÇÃO
            </p>
          </div>
          <IndustrialButton onClick={generatePDF}>
            <Download className="mr-2 h-4 w-4" />
            EXPORTAR PDF
          </IndustrialButton>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report Preview Area */}
          <div className="lg:col-span-2">
            <div id="report-content" className="bg-card border border-border p-8 min-h-[800px] text-foreground">
              {/* Report Header */}
              <div className="border-b-2 border-primary pb-6 mb-8 flex justify-between items-end">
                <div>
                  <div className="text-3xl font-mono font-bold text-primary tracking-tighter mb-2">OP.INTEL</div>
                  <div className="text-sm font-mono text-muted-foreground">RELATÓRIO SEMANAL DE OPERAÇÕES</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-muted-foreground">PERÍODO</div>
                  <div className="font-bold font-mono">20 NOV - 27 NOV 2025</div>
                </div>
              </div>

              {/* Report Body */}
              <div className="space-y-8">
                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 border border-border bg-accent/5">
                    <div className="text-xs font-mono text-muted-foreground mb-1">TOTAL DE EVENTOS</div>
                    <div className="text-2xl font-bold font-mono">1,248</div>
                  </div>
                  <div className="p-4 border border-border bg-accent/5">
                    <div className="text-xs font-mono text-muted-foreground mb-1">MANUTENÇÕES</div>
                    <div className="text-2xl font-bold font-mono text-yellow-500">32</div>
                  </div>
                  <div className="p-4 border border-border bg-accent/5">
                    <div className="text-xs font-mono text-muted-foreground mb-1">FALHAS CRÍTICAS</div>
                    <div className="text-2xl font-bold font-mono text-red-500">03</div>
                  </div>
                </div>

                {/* Performance Chart Placeholder */}
                <div className="border border-border p-4">
                  <h3 className="text-sm font-bold font-mono uppercase mb-4 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Disponibilidade de Ativos (%)
                  </h3>
                  <div className="h-48 flex items-end justify-between gap-2 px-2">
                    {[98, 95, 92, 99, 88, 96, 97].map((h, i) => (
                      <div key={i} className="w-full bg-primary/20 hover:bg-primary/40 transition-colors relative group">
                        <div 
                          className="absolute bottom-0 left-0 right-0 bg-primary transition-all duration-500" 
                          style={{ height: `${h}%` }}
                        />
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                          {h}%
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs font-mono text-muted-foreground px-2">
                    <span>SEG</span>
                    <span>TER</span>
                    <span>QUA</span>
                    <span>QUI</span>
                    <span>SEX</span>
                    <span>SÁB</span>
                    <span>DOM</span>
                  </div>
                </div>

                {/* Detailed List */}
                <div>
                  <h3 className="text-sm font-bold font-mono uppercase mb-4 border-b border-border pb-2">
                    Principais Ocorrências
                  </h3>
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase font-mono">
                      <tr>
                        <th className="py-2">Data</th>
                        <th className="py-2">Ativo</th>
                        <th className="py-2">Evento</th>
                        <th className="py-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30 font-mono text-xs">
                      <tr>
                        <td className="py-2">26/11 09:15</td>
                        <td>TORNO CNC-01</td>
                        <td>Manutenção Preventiva</td>
                        <td className="text-right text-yellow-500">CONCLUÍDO</td>
                      </tr>
                      <tr>
                        <td className="py-2">25/11 14:30</td>
                        <td>PRENSA H-20</td>
                        <td>Parada não programada</td>
                        <td className="text-right text-red-500">RESOLVIDO</td>
                      </tr>
                      <tr>
                        <td className="py-2">24/11 08:00</td>
                        <td>CORTADORA L-05</td>
                        <td>Calibração de Sensor</td>
                        <td className="text-right text-green-500">OK</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-4 border-t border-border text-xs font-mono text-muted-foreground flex justify-between">
                  <span>Gerado automaticamente por OP.INTEL</span>
                  <span>Página 1 de 1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Options */}
          <div className="space-y-6">
            <IndustrialCard>
              <IndustrialCardHeader>
                <IndustrialCardTitle className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Filtros de Data
                </IndustrialCardTitle>
              </IndustrialCardHeader>
              <IndustrialCardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-muted-foreground uppercase">Início</label>
                  <input type="date" className="w-full bg-background border border-input px-3 py-2 text-sm font-mono" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-muted-foreground uppercase">Fim</label>
                  <input type="date" className="w-full bg-background border border-input px-3 py-2 text-sm font-mono" />
                </div>
                <IndustrialButton className="w-full">ATUALIZAR</IndustrialButton>
              </IndustrialCardContent>
            </IndustrialCard>

            <IndustrialCard>
              <IndustrialCardHeader>
                <IndustrialCardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Tipos de Relatório
                </IndustrialCardTitle>
              </IndustrialCardHeader>
              <IndustrialCardContent className="space-y-2">
                <div className="flex items-center gap-2 p-2 hover:bg-accent/10 cursor-pointer border border-transparent hover:border-primary/30 transition-all">
                  <div className="h-2 w-2 bg-primary rounded-full" />
                  <span className="text-sm font-mono">Operacional Diário</span>
                </div>
                <div className="flex items-center gap-2 p-2 hover:bg-accent/10 cursor-pointer border border-transparent hover:border-primary/30 transition-all bg-accent/5 border-primary/20">
                  <div className="h-2 w-2 bg-primary rounded-full" />
                  <span className="text-sm font-mono font-bold">Resumo Semanal</span>
                </div>
                <div className="flex items-center gap-2 p-2 hover:bg-accent/10 cursor-pointer border border-transparent hover:border-primary/30 transition-all">
                  <div className="h-2 w-2 bg-primary rounded-full" />
                  <span className="text-sm font-mono">Histórico de Manutenção</span>
                </div>
                <div className="flex items-center gap-2 p-2 hover:bg-accent/10 cursor-pointer border border-transparent hover:border-primary/30 transition-all">
                  <div className="h-2 w-2 bg-primary rounded-full" />
                  <span className="text-sm font-mono">Auditoria de Ativos</span>
                </div>
              </IndustrialCardContent>
            </IndustrialCard>
          </div>
        </div>
      </div>
    </Layout>
  );
}
