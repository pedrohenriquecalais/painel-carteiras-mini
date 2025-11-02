import { useState } from "react";
import "./App.css";
import mock from "./data/mock.json";
import Filter from "./components/Filter";
import KPIs from "./components/KPIs";
import Chart from "./components/chart";
import NegotiatorsTable from "./components/NegotiatorsTable";

type Filtros = { campanha: string; mesAno: string };
type SerieDiaria = { data: string; caixa: number }[];

type KPIsType = {
  objetivo_total: number;
  caixa_recebido: number;
  quebra: number;
  percentualQuebra?: number | null;
};

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

  const [dados, setDados] = useState<Dados>(mock as Dados);

  const handleApplyFilters = (filtrosSelecionados: Filtros) => {
    setFiltros(filtrosSelecionados);
    localStorage.setItem("filtros", JSON.stringify(filtrosSelecionados));
    const novosDados = gerarDadosFiltrados(filtrosSelecionados);
    setDados(novosDados);
  };

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

      if (mesSelecionado > new Date(hoje.getFullYear(), hoje.getMonth())) {
        caixa = 0;
      } else if (ano === hoje.getFullYear() && mes === hoje.getMonth() + 1) {
        caixa = data <= hoje ? valorBase * (0.8 + Math.random() * 0.4) : 0;
      } else {
        caixa = valorBase * (0.8 + Math.random() * 0.4);
      }

      return {
        data: (data.toISOString().split("T")[0] ?? "") as string,
        caixa,
      };
    });

    const somaCaixa = serie_diaria.reduce((acc, d) => acc + d.caixa, 0);
    const objetivoTotal = base.kpis.objetivo_total ?? 0;
    const quebra = Math.max(0, objetivoTotal - somaCaixa);
    const percentualQuebra =
      objetivoTotal > 0 ? (quebra / objetivoTotal) * 100 : null;

    // === Simulação realista por negociador ===
    const totalCaixaBase = base.tabela_negociadores.reduce((acc, n) => acc + n.caixa, 0);

    const tabela_negociadores = base.tabela_negociadores.map((n) => {
      const proporcao = totalCaixaBase > 0 ? n.caixa / totalCaixaBase : 1 / base.tabela_negociadores.length;
      // 🔹 adiciona leve variação individual (+/-10%)
      const variacao = 0.9 + Math.random() * 0.2;

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

  const diasDoMes =
    new Date(
      filtros ? Number(filtros.mesAno.split("-")[0]) : new Date().getFullYear(),
      filtros ? Number(filtros.mesAno.split("-")[1]) : new Date().getMonth() + 1,
      0
    ).getDate();

  const objetivoDiario =
    dados.kpis?.objetivo_total ? dados.kpis.objetivo_total / diasDoMes : 0;

  return (
    <div className="app-container">
      <h1>Painel de Carteiras – Mini</h1>

      <Filter campanhas={dados.campanhas} onApply={handleApplyFilters} />
      <KPIs kpis={dados.kpis} />
      <Chart data={dados.serie_diaria} objetivoDiario={objetivoDiario} />
      <NegotiatorsTable data={dados.tabela_negociadores} />

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
