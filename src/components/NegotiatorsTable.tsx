import { useState } from "react";
import { formatCurrency } from "../utils/formatters";

/**
 * Tipagem da tabela de negociadores
 */
type Negociador = {
  negociador: string;
  caixa: number;
  quebra: number;
};

type Props = {
  data: Negociador[];
};

/**
 * Componente de tabela dos negociadores
 * - Exibe colunas: Negociador, Caixa, Quebra e % Quebra
 * - Permite ordenação manual por Caixa Recebido (clicando no cabeçalho)
 */
function NegotiatorsTable({ data }: Props) {
  const [ordemCrescente, setOrdemCrescente] = useState<boolean | null>(null);

  // === Alterna entre crescente / decrescente / neutro ===
  const ordenarPorCaixa = () => {
    if (ordemCrescente === null) setOrdemCrescente(true);
    else setOrdemCrescente(!ordemCrescente);
  };

  // === Aplica ordenação apenas quando ativo ===
  const dadosOrdenados = [...data].sort((a, b) => {
    if (ordemCrescente === null) return 0;
    return ordemCrescente ? a.caixa - b.caixa : b.caixa - a.caixa;
  });

  return (
    <div className="table-container">
      <h2 style={{ color: "#ffd700", textAlign: "center", marginTop: "1rem" }}>
        Resumo por Negociador
      </h2>

      <table>
        <thead>
          <tr>
            <th>Negociador</th>
            <th
              onClick={ordenarPorCaixa}
              style={{ cursor: "pointer", color: "#ffd700" }}
            >
              Caixa Recebido{" "}
              {ordemCrescente === null
                ? "↕"
                : ordemCrescente
                ? "↑"
                : "↓"}
            </th>
            <th>Quebra (R$)</th>
            <th>% Quebra</th>
          </tr>
        </thead>

        <tbody>
          {dadosOrdenados.map((n, index) => {
            // === % de quebra individual ===
            const objetivoNegociador = n.caixa + n.quebra;
            const percentualQuebra =
              objetivoNegociador > 0
                ? (n.quebra / objetivoNegociador) * 100
                : 0;

            return (
              <tr key={index}>
                <td>{n.negociador}</td>
                <td>{formatCurrency(n.caixa)}</td>
                <td>{formatCurrency(n.quebra)}</td>
                <td>{percentualQuebra.toFixed(2).replace(".", ",")}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default NegotiatorsTable;
