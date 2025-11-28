import React from "react";
import Layout from "@/components/Layout";
import { IndustrialCard, IndustrialCardContent, IndustrialCardHeader, IndustrialCardTitle } from "@/components/ui/industrial-card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";
import { Activity, Clock, AlertTriangle, CheckCircle } from "lucide-react";

const mtbfData = [
  { month: "Jan", value: 320 },
  { month: "Fev", value: 340 },
  { month: "Mar", value: 310 },
  { month: "Abr", value: 380 },
  { month: "Mai", value: 410 },
  { month: "Jun", value: 450 },
];

const mttrData = [
  { month: "Jan", value: 4.5 },
  { month: "Fev", value: 4.2 },
  { month: "Mar", value: 3.8 },
  { month: "Abr", value: 3.5 },
  { month: "Mai", value: 3.2 },
  { month: "Jun", value: 2.8 },
];

const failureTypeData = [
  { name: "Mecânica", value: 45 },
  { name: "Elétrica", value: 30 },
  { name: "Hidráulica", value: 15 },
  { name: "Software", value: 10 },
];

export default function MaintenanceKPIs() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-mono text-foreground uppercase">
            KPIs de Manutenção
          </h1>
          <p className="text-muted-foreground mt-1 font-mono text-sm">
            INDICADORES DE PERFORMANCE E CONFIABILIDADE
          </p>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <IndustrialCard>
            <IndustrialCardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-muted-foreground uppercase">MTBF Atual</p>
                  <div className="text-2xl font-bold text-primary mt-1">450h</div>
                  <p className="text-xs text-green-500 mt-1 flex items-center">
                    <Activity className="h-3 w-3 mr-1" /> +12% vs mês anterior
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
            </IndustrialCardContent>
          </IndustrialCard>

          <IndustrialCard>
            <IndustrialCardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-muted-foreground uppercase">MTTR Atual</p>
                  <div className="text-2xl font-bold text-primary mt-1">2.8h</div>
                  <p className="text-xs text-green-500 mt-1 flex items-center">
                    <Activity className="h-3 w-3 mr-1" /> -15% vs mês anterior
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
            </IndustrialCardContent>
          </IndustrialCard>

          <IndustrialCard>
            <IndustrialCardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-muted-foreground uppercase">Disponibilidade</p>
                  <div className="text-2xl font-bold text-primary mt-1">98.5%</div>
                  <p className="text-xs text-green-500 mt-1 flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" /> Meta atingida
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Activity className="h-5 w-5" />
                </div>
              </div>
            </IndustrialCardContent>
          </IndustrialCard>

          <IndustrialCard>
            <IndustrialCardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-muted-foreground uppercase">Falhas Críticas</p>
                  <div className="text-2xl font-bold text-destructive mt-1">3</div>
                  <p className="text-xs text-destructive mt-1 flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" /> Atenção requerida
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                </div>
              </div>
            </IndustrialCardContent>
          </IndustrialCard>
        </div>

        {/* Gráficos Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <IndustrialCard className="h-[400px]">
            <IndustrialCardHeader>
              <IndustrialCardTitle>Evolução do MTBF (Horas)</IndustrialCardTitle>
              <p className="text-xs text-muted-foreground font-mono">TEMPO MÉDIO ENTRE FALHAS - ÚLTIMOS 6 MESES</p>
            </IndustrialCardHeader>
            <IndustrialCardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={mtbfData}>
                  <defs>
                    <linearGradient id="colorMtbf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--foreground)' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorMtbf)" />
                </AreaChart>
              </ResponsiveContainer>
            </IndustrialCardContent>
          </IndustrialCard>

          <IndustrialCard className="h-[400px]">
            <IndustrialCardHeader>
              <IndustrialCardTitle>Evolução do MTTR (Horas)</IndustrialCardTitle>
              <p className="text-xs text-muted-foreground font-mono">TEMPO MÉDIO PARA REPARO - ÚLTIMOS 6 MESES</p>
            </IndustrialCardHeader>
            <IndustrialCardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mttrData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--foreground)' }}
                  />
                  <Line type="monotone" dataKey="value" stroke="var(--destructive)" strokeWidth={3} dot={{ r: 4, fill: 'var(--destructive)' }} />
                </LineChart>
              </ResponsiveContainer>
            </IndustrialCardContent>
          </IndustrialCard>
        </div>

        {/* Distribuição de Falhas */}
        <IndustrialCard>
          <IndustrialCardHeader>
            <IndustrialCardTitle>Distribuição por Tipo de Falha</IndustrialCardTitle>
          </IndustrialCardHeader>
          <IndustrialCardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={failureTypeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={true} vertical={false} />
                  <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} width={100} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--foreground)' }}
                  />
                  <Bar dataKey="value" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </IndustrialCardContent>
        </IndustrialCard>
      </div>
    </Layout>
  );
}
