import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { IndustrialCard, IndustrialCardContent, IndustrialCardHeader, IndustrialCardTitle } from "@/components/ui/industrial-card";
import { IndustrialButton } from "@/components/ui/industrial-button";
import { FileText, Download, Calendar, BarChart3, AlertTriangle, CheckCircle2, TrendingUp, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import { getKPIs } from "@/lib/supabase";

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<any>(null);

  useEffect(() => {
    async function loadKPIs() {
      try {
        const data = await getKPIs();
        setKpis(data);
      } catch (error) {
        console.error("Erro ao carregar KPIs:", error);
        toast.error("Erro ao carregar dados do relatório");
      } finally {
        setLoading(false);
      }
    }
    loadKPIs();
  }, []);

  if (loading || !kpis) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground font-mono">Carregando relatório...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const reportData = {
    periodo: new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
    totalEventos: kpis.totalEventosAtual,
    totalEventosAnterior: kpis.totalEventosAnterior,
    ativosSaudaveis: kpis.ativosSaudaveis,
    totalAtivos: kpis.totalAtivos,
    ativosNegligenciados: kpis.ativosNegligenciadosList.slice(0, 3).map((a: any) => ({
      id: a.code,
      name: a.name,
      diasSemUso: a.diasSemUso
    })),
    top5Ativos: kpis.top5Ativos || [],
    naoConformidades: kpis.naoConformidades || [],
  };

  const variacao = ((reportData.totalEventos - reportData.totalEventosAnterior) / reportData.totalEventosAnterior * 100).toFixed(1);
  const percentualSaudaveis = ((reportData.ativosSaudaveis / reportData.totalAtivos) * 100).toFixed(0);

  const generatePDF = async () => {
    toast.info("Gerando relatório PDF...", {
      description: "Aguarde enquanto o relatório é processado.",
    });

    const element = document.getElementById("report-content");
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // Se o conteúdo for maior que uma página, adicionar múltiplas páginas
    if (pdfHeight > pdf.internal.pageSize.getHeight()) {
      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }
    } else {
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    }

    pdf.save(`relatorio-mensal-${reportData.periodo.toLowerCase().replace(' ', '-')}.pdf`);

    toast.success("Relatório gerado com sucesso!", {
      description: "O PDF foi baixado automaticamente.",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/">
            <IndustrialButton variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </IndustrialButton>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-mono text-foreground uppercase">
            RELATÓRIOS
          </h1>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-muted-foreground mt-1 font-mono text-sm">
              RELATÓRIO MENSAL AUTOMÁTICO (V1.2)
            </p>
          </div>
          <IndustrialButton onClick={generatePDF}>
            <Download className="mr-2 h-4 w-4" />
            EXPORTAR PDF
          </IndustrialButton>
        </div>

        {/* Informação sobre automação */}
        <IndustrialCard className="bg-blue-500/5 border-blue-500/20">
          <IndustrialCardContent className="p-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <div className="font-bold text-sm font-mono text-foreground">GERAÇÃO AUTOMÁTICA CONFIGURADA</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Este relatório será gerado automaticamente no 1º dia útil de cada mês às 09:00 e enviado por email.
                </div>
              </div>
            </div>
          </IndustrialCardContent>
        </IndustrialCard>

        {/* Preview do Relatório */}
        <div className="grid grid-cols-1 gap-6">
          <div id="report-content" className="bg-white border-2 border-border p-8 md:p-12 min-h-[800px] text-foreground">

            {/* PÁGINA 1: RESUMO EXECUTIVO */}
            <div className="mb-12">
              {/* Header */}
              <div className="border-b-4 border-primary pb-6 mb-8 flex justify-between items-end">
                <div>
                  <div className="text-4xl font-mono font-bold text-primary tracking-tighter mb-2">OP.INTEL</div>
                  <div className="text-sm font-mono text-gray-600">RELATÓRIO MENSAL DE OPERAÇÕES</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-gray-500">PERÍODO</div>
                  <div className="font-bold font-mono text-lg">{reportData.periodo}</div>
                </div>
              </div>

              {/* Título da Seção */}
              <h2 className="text-2xl font-bold font-mono text-gray-800 mb-6 uppercase">
                1. Resumo Executivo
              </h2>

              {/* 3 KPIs Principais */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-6 border-2 border-blue-500/20 bg-blue-500/5 rounded-lg">
                  <div className="text-xs font-mono text-gray-500 mb-2">TOTAL DE EVENTOS</div>
                  <div className="text-3xl font-bold font-mono text-gray-800">{reportData.totalEventos}</div>
                  <div className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                    {parseFloat(variacao) > 0 ? (
                      <>
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        <span className="text-green-600">+{variacao}%</span>
                      </>
                    ) : (
                      <span className="text-red-600">{variacao}%</span>
                    )}
                    <span className="ml-1">vs mês anterior</span>
                  </div>
                </div>

                <div className="p-6 border-2 border-green-500/20 bg-green-500/5 rounded-lg">
                  <div className="text-xs font-mono text-gray-500 mb-2">ATIVOS SAUDÁVEIS</div>
                  <div className="text-3xl font-bold font-mono text-gray-800">{percentualSaudaveis}%</div>
                  <div className="text-xs text-gray-600 mt-2">
                    {reportData.ativosSaudaveis} de {reportData.totalAtivos} ativos (≥3 eventos/mês)
                  </div>
                </div>

                <div className="p-6 border-2 border-red-500/20 bg-red-500/5 rounded-lg">
                  <div className="text-xs font-mono text-gray-500 mb-2">ATIVOS NEGLIGENCIADOS</div>
                  <div className="text-3xl font-bold font-mono text-gray-800">{reportData.ativosNegligenciados.length}</div>
                  <div className="text-xs text-gray-600 mt-2">
                    Sem uso há mais de 30 dias
                  </div>
                </div>
              </div>

              {/* Top 5 Ativos Mais Usados */}
              <div className="mb-8">
                <h3 className="text-lg font-bold font-mono text-gray-800 mb-4 uppercase">
                  Top 5 Ativos Mais Utilizados
                </h3>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-2 px-3 text-xs font-mono text-gray-600 uppercase">Código</th>
                      <th className="text-left py-2 px-3 text-xs font-mono text-gray-600 uppercase">Nome</th>
                      <th className="text-right py-2 px-3 text-xs font-mono text-gray-600 uppercase">Total de Eventos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.top5Ativos.map((ativo: any, index: number) => (
                      <tr key={ativo.id} className="border-b border-gray-200">
                        <td className="py-3 px-3 font-mono text-sm font-bold text-gray-800">{ativo.id}</td>
                        <td className="py-3 px-3 text-sm text-gray-700">{ativo.name}</td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-sm text-gray-800">{ativo.eventos}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PÁGINA 2: ALERTAS E RECOMENDAÇÕES */}
            <div className="page-break mt-12 pt-12 border-t-4 border-gray-300">
              <h2 className="text-2xl font-bold font-mono text-gray-800 mb-6 uppercase">
                2. Alertas e Recomendações
              </h2>

              {/* Ativos Negligenciados */}
              <div className="mb-8">
                <h3 className="text-lg font-bold font-mono text-gray-800 mb-4 uppercase flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Ativos Negligenciados (Ação Necessária)
                </h3>
                <div className="space-y-3">
                  {reportData.ativosNegligenciados.map((ativo: any) => (
                    <div
                      key={ativo.id}
                      className="flex items-center justify-between p-4 rounded-lg border-2 border-red-500/20 bg-red-500/5"
                    >
                      <div>
                        <div className="font-mono font-bold text-sm text-gray-800">{ativo.id}</div>
                        <div className="text-xs text-gray-600">{ativo.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-red-600 font-mono font-bold text-sm">{ativo.diasSemUso} dias</div>
                        <div className="text-xs text-gray-600">sem uso</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Não Conformidades */}
              <div className="mb-8">
                <h3 className="text-lg font-bold font-mono text-gray-800 mb-4 uppercase">
                  Não Conformidades do Mês
                </h3>
                {reportData.naoConformidades.length > 0 ? (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-300">
                        <th className="text-left py-2 px-3 text-xs font-mono text-gray-600 uppercase">Data</th>
                        <th className="text-left py-2 px-3 text-xs font-mono text-gray-600 uppercase">Ativo</th>
                        <th className="text-left py-2 px-3 text-xs font-mono text-gray-600 uppercase">Descrição</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.naoConformidades.map((nc: any, index: number) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="py-3 px-3 font-mono text-sm text-gray-800">{nc.data}</td>
                          <td className="py-3 px-3 font-mono font-bold text-sm text-gray-800">{nc.ativo}</td>
                          <td className="py-3 px-3 text-sm text-gray-700">{nc.descricao}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-6 border-2 border-green-500/20 bg-green-500/5 rounded-lg flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                    <div>
                      <div className="font-bold text-sm text-gray-800">Nenhuma não conformidade registrada</div>
                      <div className="text-xs text-gray-600 mt-1">Todos os ativos operaram dentro dos padrões esperados.</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Observação Automática */}
              <div className="mt-8 p-6 bg-gray-100 rounded-lg border-2 border-gray-300">
                <h3 className="text-sm font-bold font-mono text-gray-800 mb-2 uppercase">Observação Automática</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {parseFloat(variacao) > 0
                    ? `Aumento de ${variacao}% nos eventos comparado ao mês anterior indica maior atividade operacional. Recomenda-se verificar se o aumento está relacionado a manutenções preventivas ou corretivas.`
                    : `Redução de ${Math.abs(parseFloat(variacao))}% nos eventos comparado ao mês anterior. Investigar se há ativos subutilizados ou se houve redução na demanda operacional.`
                  }
                </p>
              </div>

              {/* Footer */}
              <div className="mt-12 pt-6 border-t-2 border-gray-300 text-center">
                <div className="text-xs font-mono text-gray-500">
                  Relatório gerado automaticamente pelo Op.Intel • {new Date().toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
