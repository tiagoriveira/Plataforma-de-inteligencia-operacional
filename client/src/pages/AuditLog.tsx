import React, { useState } from "react";
import Layout from "@/components/Layout";
import { IndustrialCard } from "@/components/ui/industrial-card";
import { IndustrialButton } from "@/components/ui/industrial-button";
import { IndustrialInput } from "@/components/ui/industrial-input";
import { Search, Shield, User, Clock, FileText } from "lucide-react";

const initialLogs = [
  { id: 1, user: "Op. Silva", action: "CHECK-IN", target: "TORNO CNC-01", timestamp: "2025-11-28 10:42:15", details: "Início de turno operacional" },
  { id: 2, user: "Téc. Santos", action: "MANUTENÇÃO", target: "PRENSA H-20", timestamp: "2025-11-28 09:15:30", details: "Troca de óleo hidráulico iniciada" },
  { id: 3, user: "Sistema", action: "ALERTA", target: "CORTADORA L-05", timestamp: "2025-11-28 08:30:00", details: "Falha de sensor detectada automaticamente" },
  { id: 4, user: "Admin", action: "CADASTRO", target: "NOVO ATIVO", timestamp: "2025-11-27 16:20:10", details: "Registro de Empilhadeira E-04" },
  { id: 5, user: "Op. Costa", action: "CHECK-OUT", target: "EMPILHADEIRA E-03", timestamp: "2025-11-27 14:00:00", details: "Fim de turno" },
];

export default function AuditLog() {
  const [search, setSearch] = useState("");
  const [logs] = useState(initialLogs);

  const filteredLogs = logs.filter(
    (log) =>
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.target.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-mono text-foreground uppercase">
            Log de Auditoria
          </h1>
          <p className="text-muted-foreground mt-1 font-mono text-sm">
            RASTREABILIDADE E SEGURANÇA // {filteredLogs.length} REGISTROS
          </p>
        </div>

        <IndustrialCard className="p-4">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <IndustrialInput
              placeholder="BUSCAR POR USUÁRIO, AÇÃO OU ALVO..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent/5 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full border ${
                    log.action === 'ALERTA' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                    log.action === 'MANUTENÇÃO' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
                    log.action === 'MELHORIA' ? 'bg-purple-500/10 border-purple-500/20 text-purple-500' :
                    'bg-primary/10 border-primary/20 text-primary'
                  }`}>
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-sm">{log.action}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="font-mono text-xs text-muted-foreground">{log.target}</span>
                    </div>
                    <p className="text-sm text-foreground">{log.details}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground font-mono">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {log.user}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {log.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <IndustrialButton variant="ghost" size="sm" className="text-xs font-mono">
                    <FileText className="mr-2 h-3 w-3" />
                    DETALHES
                  </IndustrialButton>
                </div>
              </div>
            ))}
          </div>
        </IndustrialCard>
      </div>
    </Layout>
  );
}
