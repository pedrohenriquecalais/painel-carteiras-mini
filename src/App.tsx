// IMPORTS 
import { useState } from "react";
import "./App.css";
import mock from "./data/mock.json";
import Filter from "./components/Filter";
import KPIs from "./components/KPIs";
import Chart from "./components/chart";
import NegotiatorsTable from "./components/NegotiatorsTable";

// Tipos usados na aplicação
type Filtros = { campanha: string; mesAno: string };
type SerieDiaria = { data: string; caixa: number }[];

// Estrutura dos indicadores principais (KPIs)
type KPIsType = {
  objetivo_total: number;
  caixa_recebido: number;
  quebra: number;
  percentualQuebra?: number | null;
};
// Estrutura de cada negociador da tabelA
type Negociador = {
  negociador: string;
  caixa: number;
  quebra: number;
};

type Dados = {
  campanhas: { id: string; nome: string }[];
  kpis: KPIsType;
  serie_diaria: SerieDiaria;
  tabela_negociadores: Negociador[];
};

function App() {
  const [filtros, setFiltros] = useState<Filtros | null>(() => {
    const salvos = localStorage.getItem("filtros");
    return salvos ? JSON.parse(salvos) : null;
  });
// Estado com os dados da tela (inicialmente carregados do mock)
  const [dados, setDados] = useState<Dados>(mock as Dados);

  const handleApplyFilters = (filtrosSelecionados: Filtros) => {
    setFiltros(filtrosSelecionados);
    localStorage.setItem("filtros", JSON.stringify(filtrosSelecionados));
    // Geram uma nova versão dos dados com base nos filtros escolhidos
    const novosDados = gerarDadosFiltrados(filtrosSelecionados);
    setDados(novosDados);
  };
// Função que simula nova base de dados com base nos filtros aplicados
  const gerarDadosFiltrados = (filtrosSelecionados: Filtros): Dados => {
    const base = mock as unknown as Dados;
    const [anoStr, mesStr] = filtrosSelecionados.mesAno.split("-");
    const ano = Number(anoStr);
    const mes = Number(mesStr);

    const hoje = new Date();
    const mesSelecionado = new Date(ano, mes - 1);
    const diasNoMes = new Date(ano, mes, 0).getDate();

    // === Série diária simulada ===
    const serie_diaria: SerieDiaria = Array.from({ length: diasNoMes }, (_, i) => {
      const dia = i + 1;
      const data = new Date(ano, mes - 1, dia);
      const valorBase = base.kpis.caixa_recebido / diasNoMes;
      let caixa = 0;
    // Regras para determinar quanto do valor é preenchido por dia
      if (mesSelecionado > new Date(hoje.getFullYear(), hoje.getMonth())) {
        caixa = 0; // Mês futuro : não tem caixa ainda
      } else if (ano === hoje.getFullYear() && mes === hoje.getMonth() + 1) {
        caixa = data <= hoje ? valorBase * (0.8 + Math.random() * 0.4) : 0; // Mês atual 
      } else {
        caixa = valorBase * (0.8 + Math.random() * 0.4); // Mês passado : tudo gerado
      }

      return {
        data: (data.toISOString().split("T")[0] ?? "") as string,
        caixa,
      };
    });
  // Soma total do caixa gerado no mês
    const somaCaixa = serie_diaria.reduce((acc, d) => acc + d.caixa, 0);
    const objetivoTotal = base.kpis.objetivo_total ?? 0;
    const quebra = Math.max(0, objetivoTotal - somaCaixa);
    const percentualQuebra =
      objetivoTotal > 0 ? (quebra / objetivoTotal) * 100 : null;

  // Distribuição do caixa por negociador com  aleatoriedade 
    const totalCaixaBase = base.tabela_negociadores.reduce((acc, n) => acc + n.caixa, 0);

    const tabela_negociadores = base.tabela_negociadores.map((n) => {
      const proporcao = totalCaixaBase > 0 ? n.caixa / totalCaixaBase : 1 / base.tabela_negociadores.length;
      const variacao = 0.9 + Math.random() * 0.2; // variação entre -10% e +10%

      const novoCaixa = somaCaixa * proporcao * variacao;
      const objetivoNegociador = base.kpis.objetivo_total * proporcao;
      const novaQuebra = Math.max(0, objetivoNegociador - novoCaixa);

      return {
        ...n,
        caixa: novoCaixa,
        quebra: novaQuebra,
      };
    });

    return {
      ...base,
      kpis: {
        ...base.kpis,
        caixa_recebido: somaCaixa,
        quebra,
        percentualQuebra,
      },
      serie_diaria,
      tabela_negociadores,
    };
  };
  // Quantidade de dias no mês selecionado
  const diasDoMes =
    new Date(
      filtros ? Number(filtros.mesAno.split("-")[0]) : new Date().getFullYear(),
      filtros ? Number(filtros.mesAno.split("-")[1]) : new Date().getMonth() + 1,
      0
    ).getDate();
  // Objetivo diário (meta total dividido pelos dias do mês)
  const objetivoDiario =
    dados.kpis?.objetivo_total ? dados.kpis.objetivo_total / diasDoMes : 0;

  return (
    <div className="app-container">
      <h1>Painel de Carteiras – Mini</h1>

      <Filter campanhas={dados.campanhas} onApply={handleApplyFilters} />
      <KPIs kpis={dados.kpis} />
      {/* Gráfico com série diária*/}
      <Chart data={dados.serie_diaria} objetivoDiario={objetivoDiario} />
      {/* Tabela com ranking / dados por negociador */}
      <NegotiatorsTable data={dados.tabela_negociadores} />
      
      {/* Exibe qual filtro está ativo */}
      {filtros && (
        <p>
          Campanha selecionada: <strong>{filtros.campanha}</strong> <br />
          Mês/Ano: <strong>{filtros.mesAno}</strong>
        </p>
      )}
    </div>
  );
}

export default App;
