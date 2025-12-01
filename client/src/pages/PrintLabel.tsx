import React from "react";
import Layout from "@/components/Layout";
import { IndustrialCard } from "@/components/ui/industrial-card";
import { IndustrialButton } from "@/components/ui/industrial-button";
import { Printer, ArrowLeft, QrCode } from "lucide-react";
import { Link } from "wouter";

export default function PrintLabel() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center justify-between print:hidden">
          <div className="flex items-center gap-4">
            <Link href="/assets/TOR-001">
              <IndustrialButton variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </IndustrialButton>
            </Link>
            <div>
              <h1 className="text-2xl font-bold font-mono uppercase">Imprimir Etiqueta</h1>
              <p className="text-xs text-muted-foreground font-mono">TORNO CNC-01 // TOR-001</p>
            </div>
          </div>
          <IndustrialButton onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            IMPRIMIR
          </IndustrialButton>
        </div>

        <div className="flex justify-center">
          {/* Label Preview - Standard Industrial Size 100x50mm approx */}
          <div className="w-[400px] h-[200px] bg-white text-black border-2 border-black p-4 flex relative shadow-xl print:shadow-none print:border-0 print:absolute print:top-0 print:left-0">
            {/* QR Code Area */}
            <div className="w-1/3 flex flex-col items-center justify-center border-r-2 border-black pr-4">
              <QrCode className="w-24 h-24" />
              <span className="text-[10px] font-mono font-bold mt-1">SCAN ME</span>
            </div>

            {/* Info Area */}
            <div className="w-2/3 pl-4 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold font-mono uppercase mb-1">ATIVO INDUSTRIAL</div>
                <div className="text-2xl font-black font-mono leading-none mb-2">TOR-001</div>
                <div className="text-sm font-bold uppercase border-b-2 border-black pb-1 mb-1">TORNO CNC-01</div>
                <div className="text-xs font-mono">SETOR A - USINAGEM</div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono border-b border-black/20">
                  <span>FABRICANTE:</span>
                  <span className="font-bold">ROMI S.A.</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono border-b border-black/20">
                  <span>MODELO:</span>
                  <span className="font-bold">CENTUR 30D</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono">
                  <span>SÉRIE:</span>
                  <span className="font-bold">RM-99887766</span>
                </div>
              </div>

              <div className="text-[8px] font-mono text-center mt-2 pt-1 border-t border-black">
                PROPRIEDADE DE METALÚRGICA EXEMPLO S.A.
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 text-sm font-mono text-yellow-500 print:hidden">
          <p>DICA: Utilize papel adesivo industrial resistente a óleo e calor para maior durabilidade.</p>
        </div>

        <IndustrialCard className="p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20 print:hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold font-mono text-amber-500 flex items-center gap-2">
                <span className="text-2xl">🏷️</span>
                Etiquetas Industriais Premium
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Garanta durabilidade extrema com nossas etiquetas de policarbonato. Resistentes a óleo, solventes e altas temperaturas. Já vêm com QR Code impresso a laser.
              </p>
            </div>
            <a
              href="https://loja.opintel.com.br/etiquetas-premium"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IndustrialButton className="bg-amber-500 hover:bg-amber-600 text-black border-amber-600 whitespace-nowrap">
                COMPRAR AGORA
              </IndustrialButton>
            </a>
          </div>
        </IndustrialCard>
      </div>
    </Layout>
  );
}
