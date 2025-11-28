import React, { useState } from "react";
import Layout from "@/components/Layout";
import { IndustrialCard } from "@/components/ui/industrial-card";
import { IndustrialButton } from "@/components/ui/industrial-button";
import { DndContext, DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";
import { Link } from "wouter";
import { Plus, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

type TaskStatus = "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDO";

interface Task {
  id: string;
  title: string;
  asset: string;
  priority: "ALTA" | "MÉDIA" | "BAIXA";
  status: TaskStatus;
}

const initialTasks: Task[] = [
  { id: "OS-101", title: "Troca de Óleo Hidráulico", asset: "PRE-020", priority: "MÉDIA", status: "PENDENTE" },
  { id: "OS-102", title: "Calibração de Sensor", asset: "COR-005", priority: "ALTA", status: "PENDENTE" },
  { id: "OS-103", title: "Inspeção de Correias", asset: "TOR-001", priority: "BAIXA", status: "EM_ANDAMENTO" },
  { id: "OS-104", title: "Limpeza Geral", asset: "SOL-008", priority: "BAIXA", status: "CONCLUIDO" },
];

export default function MaintenanceKanban() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const taskId = active.id as string;
      const newStatus = over.id as TaskStatus;

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
      
      toast.success("Status atualizado!", {
        description: `Ordem de serviço movida para ${newStatus.replace("_", " ")}.`,
      });
    }
  };

  const columns: { id: TaskStatus; title: string; icon: React.ReactNode; color: string }[] = [
    { id: "PENDENTE", title: "Pendente", icon: <Clock className="w-4 h-4" />, color: "text-yellow-500" },
    { id: "EM_ANDAMENTO", title: "Em Andamento", icon: <AlertTriangle className="w-4 h-4" />, color: "text-blue-500" },
    { id: "CONCLUIDO", title: "Concluído", icon: <CheckCircle className="w-4 h-4" />, color: "text-green-500" },
  ];

  return (
    <Layout>
      <div className="space-y-6 h-full flex flex-col">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-mono text-foreground uppercase">
              Quadro de Manutenção
            </h1>
            <p className="text-muted-foreground mt-1 font-mono text-sm">
              GESTÃO VISUAL DE ORDENS DE SERVIÇO
            </p>
          </div>
          <Link href="/maintenance">
            <IndustrialButton>
              <Plus className="mr-2 h-4 w-4" />
              NOVA O.S.
            </IndustrialButton>
          </Link>
        </div>

        <DndContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-[500px]">
            {columns.map((col) => (
              <KanbanColumn
                key={col.id}
                id={col.id}
                title={col.title}
                icon={col.icon}
                color={col.color}
                tasks={tasks.filter((t) => t.status === col.id)}
              />
            ))}
          </div>
        </DndContext>
      </div>
    </Layout>
  );
}

function KanbanColumn({ id, title, icon, color, tasks }: { id: string; title: string; icon: React.ReactNode; color: string; tasks: Task[] }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="flex flex-col h-full bg-accent/5 rounded-lg border border-border p-4">
      <div className={`flex items-center gap-2 mb-4 font-mono font-bold uppercase ${color}`}>
        {icon}
        {title}
        <span className="ml-auto text-xs bg-background px-2 py-0.5 rounded-full border border-border text-muted-foreground">
          {tasks.length}
        </span>
      </div>
      <div className="space-y-3 flex-1">
        {tasks.map((task) => (
          <KanbanCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div className="h-24 border-2 border-dashed border-border/50 rounded-md flex items-center justify-center text-muted-foreground text-xs font-mono">
            VAZIO
          </div>
        )}
      </div>
    </div>
  );
}

function KanbanCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const priorityColors = {
    ALTA: "text-red-500 bg-red-500/10 border-red-500/20",
    MÉDIA: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
    BAIXA: "text-green-500 bg-green-500/10 border-green-500/20",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab active:cursor-grabbing"
    >
      <IndustrialCard className="p-3 hover:border-primary/50 transition-colors shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <span className="font-mono text-xs text-muted-foreground">{task.id}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded border font-mono font-bold ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
        </div>
        <h4 className="font-medium text-sm mb-1">{task.title}</h4>
        <p className="text-xs text-muted-foreground font-mono">{task.asset}</p>
      </IndustrialCard>
    </div>
  );
}
