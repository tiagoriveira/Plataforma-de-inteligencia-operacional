import React, { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";
import { IndustrialCard } from "@/components/ui/industrial-card";
import { IndustrialButton } from "@/components/ui/industrial-button";
import { Camera, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Html5Qrcode } from "html5-qrcode";
import { toast } from "sonner";

export default function Scanner() {
  const [, setLocation] = useLocation();
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup scanner on unmount
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      setCameraError(null);
      setScanning(true);

      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" }, // Câmera traseira
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // QR Code detectado
          setScannedCode(decodedText);
          toast.success("QR Code detectado!", {
            description: `Código: ${decodedText}`,
            icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
          });

          // Parar scanner
          scanner.stop().then(() => {
            setScanning(false);
            // Redirecionar para ficha do ativo
            setTimeout(() => {
              setLocation(`/assets/${decodedText}`);
            }, 1000);
          }).catch(console.error);
        },
        (errorMessage) => {
          // Erro de leitura (normal, acontece continuamente até detectar QR)
          // Não fazer nada aqui
        }
      );
    } catch (error: any) {
      console.error("Erro ao iniciar scanner:", error);
      setCameraError(error.message || "Erro ao acessar câmera");
      setScanning(false);
      toast.error("Erro ao acessar câmera", {
        description: "Verifique as permissões do navegador.",
      });
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().then(() => {
        setScanning(false);
        setScannedCode(null);
      }).catch(console.error);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto min-h-[80vh] flex flex-col justify-center">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Link href="/">
            <IndustrialButton variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </IndustrialButton>
          </Link>
          <div>
            <h1 className="text-xl font-bold font-mono uppercase">ESCANEAR QR CODE</h1>
            <p className="text-xs text-muted-foreground font-mono">
              Posicione a câmera sobre o código
            </p>
          </div>
        </div>

        <IndustrialCard className="p-6">
          {/* QR Reader Container */}
          <div
            id="qr-reader"
            className={`w-full aspect-square rounded-lg overflow-hidden bg-black ${
              scanning ? "" : "hidden"
            }`}
          ></div>

          {/* Placeholder quando não está escaneando */}
          {!scanning && (
            <div className="w-full aspect-square rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center bg-accent/5">
              <Camera className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-sm font-mono text-muted-foreground text-center px-4">
                Clique no botão abaixo para iniciar o scanner
              </p>
            </div>
          )}

          {/* Error Message */}
          {cameraError && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-xs font-mono text-red-500">{cameraError}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Permita o acesso à câmera nas configurações do navegador.
              </p>
            </div>
          )}

          {/* Scanned Code Display */}
          {scannedCode && (
            <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-xs font-mono text-green-500 font-bold">
                CÓDIGO DETECTADO: {scannedCode}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Redirecionando...
              </p>
            </div>
          )}

          {/* Controls */}
          <div className="mt-6 space-y-3">
            {!scanning ? (
              <IndustrialButton
                className="w-full h-12 text-lg"
                onClick={startScanning}
              >
                <Camera className="mr-2 h-5 w-5" />
                INICIAR SCANNER
              </IndustrialButton>
            ) : (
              <IndustrialButton
                variant="destructive"
                className="w-full h-12 text-lg"
                onClick={stopScanning}
              >
                PARAR SCANNER
              </IndustrialButton>
            )}

            <Link href="/">
              <IndustrialButton variant="outline" className="w-full">
                VOLTAR
              </IndustrialButton>
            </Link>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
            <h3 className="text-xs font-mono font-bold uppercase text-blue-600 mb-2">
              Instruções:
            </h3>
            <ul className="text-xs text-muted-foreground space-y-1 font-mono">
              <li>1. Permita o acesso à câmera</li>
              <li>2. Posicione o QR Code dentro do quadrado</li>
              <li>3. Aguarde a detecção automática</li>
              <li>4. Você será redirecionado para a ficha do equipamento</li>
            </ul>
          </div>
        </IndustrialCard>
      </div>
    </Layout>
  );
}
