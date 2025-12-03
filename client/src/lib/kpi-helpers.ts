// Helper functions para cálculos de KPIs (KISS)

export function calcularVariacao(atual: number, anterior: number): string {
  if (anterior === 0) return atual > 0 ? '+100.0' : '0.0';
  const variacao = ((atual - anterior) / anterior) * 100;
  return variacao.toFixed(1);
}

export function calcularPercentual(parte: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((parte / total) * 100);
}
