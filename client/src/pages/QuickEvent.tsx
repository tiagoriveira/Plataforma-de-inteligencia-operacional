import React, { useState } from "react";
import Layout from "@/components/Layout";
import { IndustrialCard, IndustrialCardContent, IndustrialCardHeader, IndustrialCardTitle } from "@/components/ui/industrial-card";
import { IndustrialButton } from "@/components/ui/industrial-button";
import { Camera, CheckCircle2, Clock, ArrowLeft, Sparkles } from "lucide-react";
import { Link, useLocation } from "wouter";
import { standardizeText, suggestCategory } from "@/lib/smartSecretary";
import { toast } from "sonner";
import { createEvent, getAssetByCode, uploadPhoto } from "@/lib/supabase";

export default function QuickEvent() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [eventType, setEventType] = useState("");
  const [photoTaken, setPhotoTaken] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [observation, setObservation] = useState("");
  const [isStandardizing, setIsStandardizing] = useState(false);
  const [saving, setSaving] = useState(false);

  const eventTypes = [
    { id: "CHECKIN", label: "CHECK-IN OPERACIONAL", color: "text-green-500 border-green-500/50 hover:bg-green-500/10" },
    { id: "CHECKOUT", label: "CHECK-OUT OPERACIONAL", color: "text-blue-500 border-blue-500/50 hover:bg-blue-500/10" },
    { id: "INSPECTION", label: "INSPEÇÃO VISUAL", color: "text-yellow-500 border-yellow-500/50 hover:bg-yellow-500/10" },
    { id: "ISSUE", label: "REPORTAR PROBLEMA", color: "text-red-500 border-red-500/50 hover:bg-red-500/10" },
    { id: "NONCONFORMITY", label: "PROBLEMA GRAVE", color: "text-orange-500 border-orange-500/50 hover:bg-orange-500/10" },
    { id: "IMPROVEMENT", label: "SUGESTÃO DE MELHORIA", color: "text-purple-500 border-purple-500/50 hover:bg-purple-500/10" },
  ];

  const handleObservationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setObservation(e.target.value);
  };

  const handleBlur = () => {
    if (observation.trim().length > 3) {
      setIsStandardizing(true);
      setTimeout(() => {
        const standardized = standardizeText(observation);
        if (standardized !== observation) {
          setObservation(standardized);
          toast.info("Texto padronizado pela IA", {
            description: "Descrição ajustada para o padrão técnico.",
            icon: <Sparkles className="h-4 w-4 text-blue-500" />,
          });
        }

        if (eventType === "ISSUE") {
          const category = suggestCategory(standardized);
          if (category) {
            toast.success(`Categoria sugerida: ${category}`, {
              icon: <CheckCircle2 className="h-4 w-4 text-green-500" />
            });
          }
        }

        setIsStandardizing(false);
      }, 500);
    }
  };

  const handleSave = async () => {
    // V1.1: Validar foto obrigatória para Problema Grave
    if (eventType === "NONCONFORMITY" && !photoFile) {
      toast.error("Foto obrigatória para problema grave", {
        description: "Por favor, tire uma foto antes de continuar.",
      });
      return;
    }

    setSaving(true);

    try {
      // Buscar ativo TOR-001 (demo - em produção seria via scanner)
      const asset = await getAssetByCode("TOR-001");

      let photoUrl = null;

      // Upload de foto se houver
      if (photoFile) {
        setUploading(true);
        photoUrl = await uploadPhoto(photoFile);
        setUploading(false);
      }

      // Criar evento no Supabase
      await createEvent({
        asset_id: asset.id,
        type: eventType,
        operator: "Operador Demo",
        observation: observation || null,
        photo_url: photoUrl,
      });

      setStep(3);
      setTimeout(() => {
        setLocation(`/assets/${asset.code}`);
      }, 2000);
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
      toast.error("Erro ao salvar evento", {
        description: "Tente novamente.",
      });
      setSaving(false);
      setUploading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoTaken(true);
      toast.success("Foto selecionada!");
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto min-h-[80vh] flex flex-col justify-center">

        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Link href="/assets/TOR-001">
            <IndustrialButton variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </IndustrialButton>
          </Link>
          <div>
            <h1 className="text-xl font-bold font-mono uppercase">REGISTRAR EVENTO</h1>
            <p className="text-xs text-muted-foreground font-mono">TORNO CNC-01 // TOR-001</p>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <p className="text-sm font-mono text-muted-foreground uppercase text-center mb-2">Selecione o Evento</p>
            {eventTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => { setEventType(type.id); setStep(2); }}
                className={`w-full p-6 border-2 bg-card text-lg font-bold font-mono uppercase tracking-wider transition-all active:scale-[0.98] ${type.color}`}
              >
                {type.label}
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
            <IndustrialCard>
              <IndustrialCardHeader>
                <IndustrialCardTitle>
                  Evidência Visual {eventType === "NONCONFORMITY" && <span className="text-red-500">*OBRIGATÓRIA*</span>}
                </IndustrialCardTitle>
              </IndustrialCardHeader>
              <IndustrialCardContent>
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <div
                    className={`aspect-video border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${photoTaken ? "border-green-500 bg-green-500/5" : "border-border hover:border-primary hover:bg-accent/5"
                      }`}
                  >
                    {photoTaken ? (
                      <>
                        <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
                        <span className="text-xs font-mono text-green-500">FOTO REGISTRADA</span>
                        {photoFile && <span className="text-[10px] text-muted-foreground mt-1">{photoFile.name}</span>}
                      </>
                    ) : (
                      <>
                        <Camera className="h-12 w-12 text-muted-foreground mb-2" />
                        <span className="text-xs font-mono text-muted-foreground">TOCAR PARA FOTOGRAFAR</span>
                      </>
                    )}
                  </div>
                </label>

                <div className="mt-4 relative">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-mono text-muted-foreground uppercase block">Observação (Opcional)</label>
                    {isStandardizing && (
                      <span className="text-xs font-mono text-blue-500 flex items-center gap-1 animate-pulse">
                        <Sparkles className="h-3 w-3" /> Padronizando...
                      </span>
                    )}
                  </div>
                  <textarea
                    value={observation}
                    onChange={handleObservationChange}
                    onBlur={handleBlur}
                    className="w-full bg-background border border-input p-2 text-sm font-mono h-20 focus:border-primary outline-none transition-all"
                    placeholder="Digite uma observação rápida (ex: vazamento oleo)..."
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">
                    * A IA padronizará o texto automaticamente ao sair do campo.
                  </p>
                </div>
              </IndustrialCardContent>
            </IndustrialCard>

            <IndustrialButton
              className="w-full h-14 text-lg"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "SALVANDO..." : "CONFIRMAR REGISTRO"}
            </IndustrialButton>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-6 animate-in zoom-in duration-300">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-500 text-green-500">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-mono uppercase text-green-500">Registrado!</h2>
              <p className="text-muted-foreground font-mono mt-2">Evento salvo com sucesso.</p>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>REDIRECIONANDO...</span>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
