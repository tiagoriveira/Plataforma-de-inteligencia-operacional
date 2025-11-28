/**
 * Predictive AI - Layer 2 (Client-Side Heuristics)
 * 
 * Responsável por calcular métricas de confiabilidade (MTBF) e gerar alertas
 * de manutenção preventiva baseados em histórico local.
 * 
 * Filosofia KISS:
 * - Sem Machine Learning complexo (apenas estatística descritiva)
 * - Dados locais (localStorage/Mock)
 * - Fórmulas padrão da indústria (NBR 5462)
 */

interface MaintenanceRecord {
    id: string;
    assetId: string;
    type: 'CORRETIVA' | 'PREVENTIVA' | 'PREDITIVA';
    date: string; // ISO Date
    downtimeHours: number;
}

interface AssetHealth {
    assetId: string;
    mtbf: number; // Mean Time Between Failures (horas)
    mttr: number; // Mean Time To Repair (horas)
    reliability: number; // Confiabilidade (%)
    nextPredictedFailure: string; // Data estimada
    status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
    recommendation: string;
}

// Mock de histórico para simulação (em produção viria do DB)
const MOCK_HISTORY: MaintenanceRecord[] = [
    { id: '1', assetId: 'TOR-001', type: 'CORRETIVA', date: '2025-10-01', downtimeHours: 4 },
    { id: '2', assetId: 'TOR-001', type: 'CORRETIVA', date: '2025-10-15', downtimeHours: 3 },
    { id: '3', assetId: 'TOR-001', type: 'CORRETIVA', date: '2025-11-01', downtimeHours: 5 },
    { id: '4', assetId: 'PRE-020', type: 'CORRETIVA', date: '2025-09-01', downtimeHours: 2 },
];

/**
 * Calcula o MTBF (Tempo Médio Entre Falhas)
 * Fórmula: (Tempo Total de Operação - Tempo de Parada) / Número de Falhas
 */
function calculateMTBF(records: MaintenanceRecord[], totalOperationHours: number): number {
    const failures = records.filter(r => r.type === 'CORRETIVA');
    if (failures.length === 0) return totalOperationHours; // Se não falhou, MTBF é o tempo total

    const totalDowntime = failures.reduce((acc, curr) => acc + curr.downtimeHours, 0);
    const uptime = totalOperationHours - totalDowntime;
    
    return Math.round(uptime / failures.length);
}

/**
 * Calcula o MTTR (Tempo Médio Para Reparo)
 * Fórmula: Tempo Total de Parada / Número de Falhas
 */
function calculateMTTR(records: MaintenanceRecord[]): number {
    const failures = records.filter(r => r.type === 'CORRETIVA');
    if (failures.length === 0) return 0;

    const totalDowntime = failures.reduce((acc, curr) => acc + curr.downtimeHours, 0);
    return Math.round((totalDowntime / failures.length) * 10) / 10; // 1 casa decimal
}

/**
 * Analisa a saúde do ativo e gera previsões
 */
export function analyzeAssetHealth(assetId: string, totalOperationHours: number = 720): AssetHealth {
    // Filtra registros do ativo
    const records = MOCK_HISTORY.filter(r => r.assetId === assetId);
    
    // Calcula métricas
    const mtbf = calculateMTBF(records, totalOperationHours);
    const mttr = calculateMTTR(records);
    
    // Última falha
    const lastFailure = records
        .filter(r => r.type === 'CORRETIVA')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    // Previsão da próxima falha (Data da última falha + MTBF em dias)
    // Assumindo 24h de operação por dia para simplificar conversão horas -> dias
    let nextFailureDate = new Date();
    if (lastFailure) {
        const lastDate = new Date(lastFailure.date);
        const daysToFailure = Math.floor(mtbf / 24); 
        nextFailureDate = new Date(lastDate.setDate(lastDate.getDate() + daysToFailure));
    }

    // Determina Status e Recomendação
    let status: AssetHealth['status'] = 'HEALTHY';
    let recommendation = "Operação normal. Manter rotina.";

    // Regra Heurística Simples:
    // Se MTBF < 100 horas -> CRÍTICO (Falha muito frequente)
    // Se MTBF < 300 horas -> ALERTA
    if (mtbf < 100) {
        status = 'CRITICAL';
        recommendation = "ALTA FREQUÊNCIA DE FALHAS. Agendar revisão geral imediata.";
    } else if (mtbf < 300) {
        status = 'WARNING';
        recommendation = "Tendência de falha detectada. Aumentar frequência de inspeção.";
    }

    // Se a data prevista já passou ou é hoje
    if (nextFailureDate <= new Date()) {
        status = 'WARNING';
        recommendation = "Risco iminente de falha estatística. Verificar ativo.";
    }

    return {
        assetId,
        mtbf,
        mttr,
        reliability: mtbf > 0 ? Math.round((mtbf / (mtbf + mttr)) * 100) : 100,
        nextPredictedFailure: nextFailureDate.toISOString().split('T')[0],
        status,
        recommendation
    };
}

/**
 * Gera um relatório geral de alertas para o Dashboard
 */
export function getPredictiveAlerts(): AssetHealth[] {
    // Lista de ativos monitorados (Mock)
    const monitoredAssets = ['TOR-001', 'PRE-020', 'CNC-002'];
    
    return monitoredAssets
        .map(id => analyzeAssetHealth(id))
        .filter(health => health.status !== 'HEALTHY'); // Retorna apenas os que precisam de atenção
}
