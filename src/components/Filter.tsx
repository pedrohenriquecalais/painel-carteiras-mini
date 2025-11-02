import { useState, useEffect, useRef } from "react";

/* ----------------------------------------------------------
   Tipagens básicas 
-----------------------------------------------------------*/

// defidnindo que as campanhas tem um id e um nome que são puxados do mock
interface Campanha {
  id: string;
  nome: string;
}

// Estrutura do filtro que será salvo/aplicado
interface Filtros {
  campanha: string;
  mesAno: string;
}

// O componente recebe uma lista de campanhas 
interface FilterProps {
  campanhas: Campanha[];
  onApply: (filtros: Filtros) => void;
}

/* ----------------------------------------------------------
   Componente de Filtro
   - controla seleção de campanha e mês
   - salva e carrega filtros do localStorage
-----------------------------------------------------------*/

function Filter({ campanhas, onApply }: FilterProps) {
  // Estado local para armazenar os valores 
  const [campanhaSelecionada, setCampanhaSelecionada] = useState<string>("");
  const [mesAno, setMesAno] = useState<string>("");

  // serve pra evitar que o useEffect rode em loop
  const carregandoInicial = useRef(true)

  /* ----------------------------------------------------------
     Ao montar o componente:
     - tenta recuperar o último filtro salvo no localStorage
     - se existir, preenche os campos e aplica automaticamente
     - se não existir, define o mês atual
  -----------------------------------------------------------*/
  useEffect(() => {
    const filtrosSalvos = localStorage.getItem("filtrosPainel");

    if (filtrosSalvos) {
      const { campanha, mesAno } = JSON.parse(filtrosSalvos);
      setCampanhaSelecionada(campanha);
      setMesAno(mesAno);

      
      if (carregandoInicial.current) {
        onApply({ campanha, mesAno });
        carregandoInicial.current = false;
      }
    } else {
      // Se não houver filtro salvo, define o mês atual
      const agora = new Date();
      const mes = String(agora.getMonth() + 1).padStart(2, "0");
      const ano = agora.getFullYear();
      const mesAtual = `${ano}-${mes}`;
      setMesAno(mesAtual);
    }
  }, [onApply]);

  /* ----------------------------------------------------------
     Quando o usuário clica em "Aplicar":
     - salva o filtro no localStorage
     - envia os valores para o componente principal (App)
  -----------------------------------------------------------*/
  const handleApply = () => {
    const filtros: Filtros = { campanha: campanhaSelecionada, mesAno };
    localStorage.setItem("filtrosPainel", JSON.stringify(filtros));
    onApply(filtros);
  };

  /* ----------------------------------------------------------
     Interface do filtro 
  -----------------------------------------------------------*/
  return (
    <div className="filter-container">
      <h2>Filtros</h2>

      {/* Campo de seleção de campanha */}
      <label htmlFor="campanha">Campanha:</label>
      <select
        id="campanha"
        value={campanhaSelecionada}
        onChange={(e) => setCampanhaSelecionada(e.target.value)}
      >
        <option value="">Selecione uma campanha</option>
        {campanhas.map((camp: Campanha) => (
          <option key={camp.id} value={camp.id}>
            {camp.nome}
          </option>
        ))}
      </select>

      {/* Campo de seleção de mês/ano */}
      <label htmlFor="mesAno">Mês/Ano:</label>
      <input
        id="mesAno"
        type="month"
        value={mesAno}
        onChange={(e) => setMesAno(e.target.value)}
      />

      {/* Botão de aplicar filtro */}
      <button onClick={handleApply}>Aplicar</button>
    </div>
  );
}

export default Filter;
