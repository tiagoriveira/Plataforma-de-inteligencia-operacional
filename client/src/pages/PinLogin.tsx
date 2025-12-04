import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { IndustrialButton } from "@/components/ui/industrial-button";
import { IndustrialCard } from "@/components/ui/industrial-card";
import { Package, Delete } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function PinLogin() {
  const [, setLocation] = useLocation();
  const { user, isLocked, verifyPin } = useAuth();
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Se não há usuário, redireciona para login tradicional
    if (!user) {
      setLocation("/login");
    }
    // Se há usuário mas não está bloqueado, vai para home
    else if (!isLocked) {
      setLocation("/");
    }
  }, [user, isLocked, setLocation]);

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);

      // Auto-login quando completar 4 dígitos
      if (newPin.length === 4) {
        handleLogin(newPin);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const handleLogin = async (pinToUse: string) => {
    setLoading(true);
    try {
      await verifyPin(pinToUse);
      toast.success("Acesso autorizado!");
      setLocation("/");
    } catch (error: any) {
      toast.error("PIN incorreto", {
        description: "Verifique seu PIN e tente novamente.",
      });
      setPin("");
      setLoading(false);
    }
  };

  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

  if (!user || !isLocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <IndustrialCard className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Package className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold font-mono">Op.Intel</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Plataforma de Inteligência Operacional
          </p>
        </div>

        <div className="mb-6">
          <p className="text-sm font-mono text-center text-muted-foreground uppercase mb-4">
            Digite seu PIN
          </p>
          <div className="flex justify-center gap-3 mb-6">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center ${pin.length > i
                  ? "border-primary bg-primary/10"
                  : "border-border"
                  }`}
              >
                {pin.length > i && (
                  <div className="w-3 h-3 rounded-full bg-primary" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {numbers.map((num) => (
            <IndustrialButton
              key={num}
              variant="outline"
              size="lg"
              onClick={() => handleNumberClick(num)}
              disabled={loading}
              className="h-16 text-xl font-mono"
            >
              {num}
            </IndustrialButton>
          ))}
          <div />
          <IndustrialButton
            variant="outline"
            size="lg"
            onClick={handleDelete}
            disabled={loading || pin.length === 0}
            className="h-16"
          >
            <Delete className="h-5 w-5" />
          </IndustrialButton>
        </div>

        <div className="text-center">
          <button
            onClick={() => setLocation("/login")}
            className="text-sm text-primary hover:underline font-mono"
          >
            Usar email e senha
          </button>
        </div>
      </IndustrialCard>
    </div>
  );
}
