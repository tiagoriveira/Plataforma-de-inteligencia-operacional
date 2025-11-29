import React, { useState } from "react";
import Layout from "@/components/Layout";
import { IndustrialCard } from "@/components/ui/industrial-card";
import { IndustrialButton } from "@/components/ui/industrial-button";
import { IndustrialInput } from "@/components/ui/industrial-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  User,
  FileText,
  History
} from "lucide-react";
import { toast } from "sonner";
import { standardizeMaintenanceText, validateMaintenanceContext } from "@/lib/smartSecretary";

// Mock Data for Maintenance Logs (History)
const MOCK_LOGS = [
  {
    id: "LOG-2025-001",
    asset: "TORNO CNC-01",
    type: "CORRETIVA",
    description: "Troca de correia principal rompida",
    technician: "Carlos Silva",
    date: "2025-11-28 14:30",
    duration: "2h 15m",
  },
  {
    id: "LOG-2025-002",
    asset: "PRENSA H-20",
    type: "PREVENTIVA",
    description: "Lubrificação geral e reaperto de parafusos",
    technician: "João Santos",
    date: "2025-11-28 09:00",
    duration: "45m",
  },
  {
    id: "LOG-2025-003",
    asset: "EMPILHADEIRA E-03",
    type: "INSPEÇÃO",
    description: "Verificação de nível de bateria e pneus",
    technician: "Ana Costa",
    date: "2025-11-27 16:45",
    duration: "15m",
  },
];

export default function Maintenance() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [isNewLogOpen, setIsNewLogOpen] = useState(false);

  // Form State
  const [selectedAsset, setSelectedAsset] = useState("");
  const [maintenanceType, setMaintenanceType] = useState("");
  const [description, setDescription] = useState("");
  const [technician, setTechnician] = useState("");
  const [contextWarning, setContextWarning] = useState<string | null>(null);

  // Smart Secretary: Standardize Text on Blur
  const handleDescriptionBlur = () => {
    if (description) {
      const standardized = standardizeMaintenanceText(description);
      if (standardized !== description) {
        setDescription(standardized);
        toast.info("Texto Padronizado (IA)", {
          description: `"${description}" → "${standardized}"`,
        });
      }
    }
  };

  // Smart Secretary: Validate Context
  const handleAssetChange = (value: string) => {
    setSelectedAsset(value);
    if (maintenanceType) {
      const warning = validateMaintenanceContext(value, maintenanceType);
      setContextWarning(warning);
    }
  };

  const handleTypeChange = (value: string) => {
    setMaintenanceType(value);
    if (selectedAsset) {
      const warning = validateMaintenanceContext(selectedAsset, value);
      setContextWarning(warning);
    }
  };

  const handleSaveLog = () => {
    if (!selectedAsset || !maintenanceType || !description || !technician) {
      toast.error("Campos Obrigatórios", {
        description: "Preencha todos os dados para registrar a intervenção.",
      });
      return;
    }

    toast.success("Intervenção Registrada", {
      description: "O histórico do ativo foi atualizado com sucesso.",
    });
    setIsNewLogOpen(false);
    // Reset form
    setSelectedAsset("");
    setMaintenanceType("");
    setDescription("");
    setTechnician("");
    setContextWarning(null);
  };

  const filteredLogs = MOCK_LOGS.filter((log) => {
    const matchesSearch =
      log.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.technician.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "ALL" || log.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-mono text-foreground uppercase flex items-center gap-3">
              <History className="h-8 w-8 text-primary" />
              Histórico de Intervenções
            </h1>
            <p className="text-muted-foreground mt-1 font-mono text-sm">
              REGISTRO DE MANUTENÇÕES REALIZADAS // DATA LOGGER
            </p>
          </div>
          <Dialog open={isNewLogOpen} onOpenChange={setIsNewLogOpen}>
            <DialogTrigger asChild>
              <IndustrialButton variant="industrial" size="lg">
                <Plus className="mr-2 h-4 w-4" />
                REGISTRAR INTERVENÇÃO
              </IndustrialButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="font-mono uppercase flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Nova Intervenção Realizada
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground font-mono">
                      ATIVO
                    </label>
                    <Select onValueChange={handleAssetChange} value={selectedAsset}>
                      <SelectTrigger className="font-mono">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TORNO CNC-01">TORNO CNC-01</SelectItem>
                        <SelectItem value="PRENSA H-20">PRENSA H-20</SelectItem>
                        <SelectItem value="EMPILHADEIRA E-03">EMPILHADEIRA E-03</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground font-mono">
                      TIPO
                    </label>
                    <Select onValueChange={handleTypeChange} value={maintenanceType}>
                      <SelectTrigger className="font-mono">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CORRETIVA">CORRETIVA</SelectItem>
                        <SelectItem value="PREVENTIVA">PREVENTIVA</SelectItem>
                        <SelectItem value="INSPEÇÃO">INSPEÇÃO</SelectItem>
                        <SelectItem value="MELHORIA">MELHORIA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {contextWarning && (
                  <div className="bg-yellow-500/10 border border-yellow-500/50 p-3 rounded-md flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-500">{contextWarning}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground font-mono">
                    DESCRIÇÃO DO SERVIÇO
                  </label>
                  <IndustrialInput
                    placeholder="O que foi feito? (ex: troca oleo)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onBlur={handleDescriptionBlur}
                  />
                  <p className="text-xs text-muted-foreground">
                    * A IA padronizará o texto automaticamente ao sair do campo.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground font-mono">
                      TÉCNICO RESPONSÁVEL
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <IndustrialInput
                        placeholder="Nome do técnico"
                        value={technician}
                        onChange={(e) => setTechnician(e.target.value)}
                        className="pl-9"
                        />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground font-mono">
                      DATA/HORA
                    </label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <IndustrialInput
                        type="datetime-local"
                        defaultValue={new Date().toISOString().slice(0, 16)}
                        className="pl-9"
                        />
                    </div>
                  </div>
                </div>

                <IndustrialButton onClick={handleSaveLog} className="w-full mt-2">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  SALVAR NO HISTÓRICO
                </IndustrialButton>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <IndustrialCard>
          <div className="p-4 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <IndustrialInput
                placeholder="Buscar por ativo, descrição ou técnico..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filtrar Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos os Tipos</SelectItem>
                  <SelectItem value="CORRETIVA">Corretiva</SelectItem>
                  <SelectItem value="PREVENTIVA">Preventiva</SelectItem>
                  <SelectItem value="INSPEÇÃO">Inspeção</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </IndustrialCard>

        {/* Logs Table */}
        <IndustrialCard>
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-accent/5 hover:bg-accent/5">
                  <TableHead className="font-mono uppercase text-xs">Data/Hora</TableHead>
                  <TableHead className="font-mono uppercase text-xs">Ativo</TableHead>
                  <TableHead className="font-mono uppercase text-xs">Tipo</TableHead>
                  <TableHead className="font-mono uppercase text-xs">Descrição</TableHead>
                  <TableHead className="font-mono uppercase text-xs">Técnico</TableHead>
                  <TableHead className="font-mono uppercase text-xs text-right">Duração</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} className="group hover:bg-accent/5">
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {log.date}
                    </TableCell>
                    <TableCell className="font-bold text-foreground">
                      {log.asset}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-mono font-medium ${
                          log.type === "CORRETIVA"
                            ? "bg-red-500/10 text-red-500"
                            : log.type === "PREVENTIVA"
                            ? "bg-blue-500/10 text-blue-500"
                            : "bg-green-500/10 text-green-500"
                        }`}
                      >
                        {log.type}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate text-muted-foreground group-hover:text-foreground transition-colors">
                      {log.description}
                    </TableCell>
                    <TableCell className="text-sm">{log.technician}</TableCell>
                    <TableCell className="text-right font-mono text-sm text-muted-foreground">
                      {log.duration}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </IndustrialCard>
      </div>
    </Layout>
  );
}
