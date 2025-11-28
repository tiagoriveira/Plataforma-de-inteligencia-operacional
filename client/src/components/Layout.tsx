import React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutDashboard, QrCode, Settings, Box, Activity, Menu, X } from "lucide-react";
import { IndustrialButton } from "./ui/industrial-button";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: "DASHBOARD", path: "/" },
    { icon: Box, label: "ATIVOS", path: "/assets" },
    { icon: QrCode, label: "SCANNER", path: "/scan" },
    { icon: Activity, label: "RELATÓRIOS", path: "/reports" },
    { icon: Settings, label: "CONFIG", path: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-sidebar z-50">
        <div className="font-mono font-bold text-primary tracking-tighter">OP.INTEL_v1.0</div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-border transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 border-b border-border hidden md:block">
          <div className="font-mono font-bold text-2xl text-primary tracking-tighter">OP.INTEL</div>
          <div className="text-xs text-muted-foreground font-mono mt-1">SYSTEM_READY</div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-mono tracking-wide cursor-pointer transition-all border-l-2",
                    isActive
                      ? "bg-primary/10 text-primary border-primary"
                      : "text-muted-foreground border-transparent hover:bg-accent/50 hover:text-foreground hover:border-accent-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="bg-card p-3 border border-border/50">
            <div className="text-xs text-muted-foreground font-mono mb-2">STATUS DO SISTEMA</div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono text-green-500">ONLINE</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-background">
        {/* Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
             style={{ 
               backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)',
               backgroundSize: '40px 40px'
             }} 
        />
        
        <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
