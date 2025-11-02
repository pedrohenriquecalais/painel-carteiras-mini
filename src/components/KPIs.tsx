import { formatCurrency } from "../utils/formatters";

/**
 * Tipagem do componente KPIs
 * Recebe os dados de desempenho
 */
type KPIsProps = {
  kpis: {
    objetivo_total: number;
    caixa_recebido: number;
    quebra: number;
    percentualQuebra?: number | null;
  };
};

/**
 * Componente de Indicadores Principais (KPIs)
 * Mostra:
 * - Objetivo Total (R$)
 * - Caixa Recebido (R$)
 * - % de Quebra
 */
function KPIs({ kpis }: KPIsProps) {
  if (!kpis) return null;

  // ✅ Garantia de fallback caso venha algum valor inesperado
  const percentual =
    kpis.percentualQuebra != null && !isNaN(kpis.percentualQuebra)
      ? `${kpis.percentualQuebra.toFixed(2).replace(".", ",")}%`
      : "—";

  return (
    <div className="kpis-container">
      {/* === Objetivo Total === */}
      <div className="kpi-card">
        <span className="kpi-label">Objetivo Total</span>
        <span className="kpi-value">{formatCurrency(kpis.objetivo_total)}</span>
      </div>
      
      {/* === Caixa Recebido === */}
      <div className="kpi-card">
        <span className="kpi-label">Caixa Recebido</span>
        <span className="kpi-value">{formatCurrency(kpis.caixa_recebido)}</span>
      </div>

      {/* === % de Quebra === */}
      <div className="kpi-card">
        <span className="kpi-label">% de Quebra</span>
        <span className="kpi-value">{percentual}</span>
      </div>
    </div>
  );
}

export default KPIs;
