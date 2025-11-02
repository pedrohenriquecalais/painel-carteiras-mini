/* ==============================
   Imports 
 ============================== */

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { formatDate, formatCurrency } from "../utils/formatters";

/* ==============================
   Tipagem do gráfico
   ============================== */

type ChartProps = {
  data: { data: string; caixa: number }[];
  objetivoDiario: number;
};

/**
 * Gráfico de desempenho diário do caixa recebido.
 *
 * - Mostra o histórico de recebimentos por dia 
 * - Exibe uma linha de referência representando a meta diária
 * - Adapta a escala automaticamente para garantir visibilidade da meta
 */
export default function Chart({ data, objetivoDiario }: ChartProps) {
  // Se não houver dados, exibe mensagem : Sem dados para exibir
  if (!data || data.length === 0) {
    return <p style={{ textAlign: "center", color: "#bbb" }}>Sem dados para exibir.</p>;
  }

  return (
    <div className="chart-container">
      {/* Título do gráfico */}
      <h2 style={{ color: "#ffd700", textAlign: "center", marginBottom: "1rem" }}>
        Caixa Recebido – Série Diária
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <AreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 10, bottom: 0 }}
        >
          {/* Grade de fundo  */}
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />

          {/* Eixo X  */}
          <XAxis
            dataKey="data"
            tickFormatter={(v) => formatDate(v).slice(0, 5)}
            tick={{ fill: "#ccc", fontSize: 12 }}
          />

          {/* Eixo Y  */}
          <YAxis
            domain={[0, (dataMax: number) => Math.max(dataMax, objetivoDiario * 1.2)]}
            tickFormatter={(v) => formatCurrency(v).replace("R$", "")}
            tick={{ fill: "#ccc", fontSize: 12 }}
          />

          {/* Tooltip  */}
          <Tooltip
            formatter={(value) => formatCurrency(value as number)}
            labelFormatter={(label) => `Data: ${formatDate(label as string)}`}
            contentStyle={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #444",
              color: "#ffd700",
            }}
          />

          {/* Gradiente dourado da área principal */}
          <defs>
            <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffd700" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ffd700" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Curva principal – representa o caixa recebido por dia */}
          <Area
            type="monotone"
            dataKey="caixa"
            stroke="#ddbd08ff"
            fillOpacity={1}
            fill="url(#goldGradient)"
          />

          {/* Linha horizontal que indica a meta diária */}
          <ReferenceLine
            y={objetivoDiario}
            stroke="#ff0077" 
            strokeWidth={2}
            strokeDasharray="6 3"
            label={{
              value: ` Meta diária: ${formatCurrency(objetivoDiario)}`,
              position: "top",
              fill: "#972b5e",
              fontSize: 12,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
