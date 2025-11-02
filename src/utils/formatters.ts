// ===============================================
// Utilitários de formatação (formatters.ts)
// ===============================================
// Este módulo centraliza funções simples e reutilizáveis
// para formatar números, percentuais e datas no padrão BR.
// -----------------------------------------------

/**
 * Formata valores monetários em reais (R$)
 * Exemplo: 1234.5 → "R$ 1.234,50"
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) return "—";
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/**
 * Formata números como percentuais (ex: 0.125 → "12,50%")
 */
export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined ) return "—";
  return `${(value ).toFixed(2).replace(".", ",")}%`;
}

/**
 * Formata datas (YYYY-MM-DD → DD/MM/YYYY)
 */
export function formatDate(dateString: string): string {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "—"; // evita erro se a string for inválida
  return date.toLocaleDateString("pt-BR");
}
