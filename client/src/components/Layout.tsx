import React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutDashboard, QrCode, Settings, Box, Activity, Menu, X, Shield, History, LogOut } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LayoutProps {
  children: React.ReactNode;
}

function LogoutButton() {
  const { signOut, user } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logout realizado com sucesso!');
      setLocation('/login');
    } catch (error: any) {
      toast.error('Erro ao fazer logout');
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full justify-start gap-2"
      onClick={handleLogout}
    >
      <LogOut className="h-4 w-4" />
      Sair
    </Button>
  );
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Box, label: "Ativos", path: "/assets" },
    { icon: QrCode, label: "Scanner", path: "/scan" },
    { icon: History, label: "Histórico (Log)", path: "/audit-log" },
    { icon: Activity, label: "Relatórios", path: "/reports" },
    { icon: Settings, label: "Configurações", path: "/settings" },
    { icon: Shield, label: "Administração", path: "/admin" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Mobile Header - Sem menu lateral */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-white z-50 shadow-sm">
        <div className="font-bold text-primary tracking-tight text-lg">Op.Intel</div>
        <ThemeToggle />
      </div>

      {/* Sidebar Navigation - OCULTA NO MOBILE */}
      <aside 
        className="hidden md:flex md:relative w-64 bg-white border-r border-border flex-col shadow-sm"
      >
        <div className="p-8 hidden md:block">
          <div className="font-bold text-2xl text-primary tracking-tight">Op.Intel</div>
          <div className="text-xs text-muted-foreground mt-1 font-medium">Plataforma de Inteligência</div>
        </div>

        <nav className="flex-1 px-4 space-y-1 py-4">
          {navItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg cursor-pointer transition-all",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-border/50 space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs font-medium text-muted-foreground">Online</span>
            </div>
            <ThemeToggle />
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-background">
        <div className="relative z-10 p-6 md:p-10 max-w-7xl mx-auto">
          {/* Removed PageTransition for instant navigation (KISS) */}
          {children}
        </div>
      </main>
    </div>
  );
}
