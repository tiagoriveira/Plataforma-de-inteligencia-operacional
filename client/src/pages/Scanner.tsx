import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { IndustrialCard } from "@/components/ui/industrial-card";
import { IndustrialButton } from "@/components/ui/industrial-button";
import { QrCode, Camera, X } from "lucide-react";
import { useLocation } from "wouter";

export default function Scanner() {
  const [, setLocation] = useLocation();
  const [scanning, setScanning] = useState(true);
  const [progress, setProgress] = useState(0);

  // Simulate scanning process
  useEffect(() => {
    if (scanning) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setScanning(false);
            setTimeout(() => setLocation("/assets/TOR-001"), 500);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [scanning, setLocation]);

  return (
    <Layout>
      <div className="max-w-md mx-auto h-[80vh] flex flex-col justify-center">
        <IndustrialCard className="relative overflow-hidden border-primary/50 shadow-[0_0_30px_rgba(var(--primary),0.1)]">
          {/* Camera Viewfinder Simulation */}
          <div className="aspect-[3/4] bg-black relative">
            {/* Simulated Camera Feed Background */}
            <div className="absolute inset-0 opacity-30 bg-[url('/assets/machine-2.png')] bg-cover bg-center mix-blend-luminosity" />
            
            {/* Scanning Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
              <div className="relative w-64 h-64 border-2 border-primary/30 rounded-lg">
                {/* Corner Markers */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary" />
                
                {/* Scanning Laser Line */}
                <div className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_10px_rgba(255,0,0,0.8)] animate-[scan_2s_ease-in-out_infinite]" 
                     style={{ top: `${progress}%` }} 
                />
              </div>
              
              <div className="mt-8 text-center space-y-2">
                <div className="text-primary font-mono font-bold animate-pulse">
                  {progress < 100 ? "BUSCANDO QR CODE..." : "CÓDIGO DETECTADO"}
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  Aponte a câmera para a etiqueta do ativo
                </div>
              </div>
            </div>

            {/* UI Controls */}
            <div className="absolute top-4 right-4">
              <IndustrialButton variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => setLocation("/")}>
                <X className="h-6 w-6" />
              </IndustrialButton>
            </div>

            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4">
              <IndustrialButton variant="secondary" size="icon" className="rounded-full h-12 w-12">
                <Camera className="h-5 w-5" />
              </IndustrialButton>
            </div>
          </div>
        </IndustrialCard>
        
        <div className="mt-4 text-center">
          <IndustrialButton variant="link" className="text-muted-foreground" onClick={() => setLocation("/assets/TOR-001")}>
            Simular Leitura Manual (Debug)
          </IndustrialButton>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </Layout>
  );
}
