import React from "react";
import Layout from "@/components/Layout";
import { IndustrialCard, IndustrialCardContent, IndustrialCardHeader, IndustrialCardTitle } from "@/components/ui/industrial-card";
import { IndustrialButton } from "@/components/ui/industrial-button";
import { IndustrialInput } from "@/components/ui/industrial-input";
import { Save, ArrowLeft, Upload } from "lucide-react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";

export default function NewAsset() {
  const [, setLocation] = useLocation();

  const handleSave = () => {
    // Simulate save
    toast.success("Ativo cadastrado com sucesso!", {
      description: "O novo ativo foi adicionado ao inventário.",
    });
    setLocation("/assets");
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/assets">
              <IndustrialButton variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </IndustrialButton>
            </Link>
            <div>
              <h1 className="text-2xl font-bold font-mono uppercase">Novo Ativo</h1>
              <p className="text-xs text-muted-foreground font-mono">CADASTRO ADMINISTRATIVO</p>
            </div>
          </div>
          <IndustrialButton onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            SALVAR ATIVO
          </IndustrialButton>
        </div>

        <IndustrialCard>
          <IndustrialCardHeader>
            <IndustrialCardTitle>Informações Principais</IndustrialCardTitle>
          </IndustrialCardHeader>
          <IndustrialCardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase">Nome do Ativo *</label>
                <IndustrialInput placeholder="Ex: Torno Mecânico Linha A" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase">Código ID (Automático)</label>
                <IndustrialInput value="NEW-2025-001" disabled className="opacity-50" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase">Tipo *</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-ring">
                  <option value="">SELECIONE...</option>
                  <option value="MAQUINA">MÁQUINA</option>
                  <option value="FERRAMENTA">FERRAMENTA</option>
                  <option value="VEICULO">VEÍCULO</option>
                  <option value="EPI">EPI</option>
                  <option value="OUTRO">OUTRO</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase">Localização Física *</label>
                <IndustrialInput placeholder="Ex: Setor 2 - Linha de Corte" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground uppercase">Descrição Detalhada</label>
              <textarea 
                className="w-full bg-background border border-input rounded-md p-2 text-sm font-mono h-24 focus:border-primary outline-none focus:ring-1 focus:ring-ring"
                placeholder="Especificações técnicas, observações importantes..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase">Fabricante</label>
                <IndustrialInput />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase">Modelo</label>
                <IndustrialInput />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase">Número de Série</label>
                <IndustrialInput />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase">Ano de Fabricação</label>
                <IndustrialInput type="number" />
              </div>
            </div>
          </IndustrialCardContent>
        </IndustrialCard>

        <IndustrialCard>
          <IndustrialCardHeader>
            <IndustrialCardTitle>Mídia e Documentos</IndustrialCardTitle>
          </IndustrialCardHeader>
          <IndustrialCardContent>
            <div className="border-2 border-dashed border-border rounded-md hover:border-primary hover:bg-accent/5 transition-colors p-8 flex flex-col items-center justify-center cursor-pointer">
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-sm font-mono text-muted-foreground">ARRASTE FOTOS OU DOCUMENTOS AQUI</span>
              <span className="text-xs text-muted-foreground mt-1">(JPG, PNG, PDF - MÁX 5MB)</span>
            </div>
          </IndustrialCardContent>
        </IndustrialCard>
      </div>
    </Layout>
  );
}
