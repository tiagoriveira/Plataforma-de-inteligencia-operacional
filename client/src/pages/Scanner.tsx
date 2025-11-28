import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { IndustrialCard } from "@/components/ui/industrial-card";
import { IndustrialButton } from "@/components/ui/industrial-button";
import { X, AlertTriangle } from "lucide-react";
import { useLocation } from "wouter";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function Scanner() {
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize scanner
    const scanner = new Html5QrcodeScanner(
      "reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        showTorchButtonIfSupported: true
      },
      /* verbose= */ false
    );

    scanner.render(
      (decodedText) => {
        // Success callback
        console.log("QR Code detected:", decodedText);
        scanner.clear();
        // Simulate navigating to asset found in QR code
        // In a real app, we would parse the URL or ID from decodedText
        setLocation("/assets/TOR-001");
      },
      (errorMessage) => {
        // Error callback (scanning in progress, not critical)
        // console.log(errorMessage);
      }
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [setLocation]);

  return (
    <Layout>
      <div className="max-w-md mx-auto h-[80vh] flex flex-col justify-center">
        <IndustrialCard className="relative overflow-hidden border-primary/50 shadow-[0_0_30px_rgba(var(--primary),0.1)] p-0">
          <div className="bg-black relative min-h-[400px] flex flex-col">
            
            {/* Scanner Container */}
            <div id="reader" className="w-full h-full bg-black" />

            {/* Overlay UI */}
            <div className="absolute top-4 right-4 z-10">
              <IndustrialButton variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => setLocation("/")}>
                <X className="h-6 w-6" />
              </IndustrialButton>
            </div>

            {/* Custom Styling for the library elements */}
            <style>{`
              #reader {
                border: none !important;
              }
              #reader__scan_region {
                background: transparent !important;
              }
              #reader__dashboard_section_csr span, 
              #reader__dashboard_section_swaplink {
                display: none !important;
              }
              #reader__dashboard_section_csr button {
                background-color: oklch(0.70 0.15 230);
                color: black;
                border: none;
                padding: 8px 16px;
                font-family: 'JetBrains Mono', monospace;
                font-weight: bold;
                text-transform: uppercase;
                cursor: pointer;
                margin-top: 10px;
              }
              #reader__camera_permission_button {
                background-color: oklch(0.70 0.15 230);
                color: black;
                border: none;
                padding: 12px 24px;
                font-family: 'JetBrains Mono', monospace;
                font-weight: bold;
                text-transform: uppercase;
                cursor: pointer;
              }
              video {
                object-fit: cover;
              }
            `}</style>
          </div>
        </IndustrialCard>
        
        <div className="mt-6 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-yellow-500 text-xs font-mono border border-yellow-500/20 bg-yellow-500/5 p-2">
            <AlertTriangle className="h-4 w-4" />
            <span>PERMISSÃO DE CÂMERA NECESSÁRIA</span>
          </div>
          
          <IndustrialButton variant="link" className="text-muted-foreground" onClick={() => setLocation("/assets/TOR-001")}>
            Simular Leitura Manual (Debug)
          </IndustrialButton>
        </div>
      </div>
    </Layout>
  );
}
