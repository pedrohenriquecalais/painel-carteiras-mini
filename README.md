#  Painel de Carteiras – Mini

Um painel interativo em React + TypeScript que simula o acompanhamento diário de recebimentos por campanha e negociador. 

O sistema foi projetado para simular dados de vendas e desempenho com base em filtros de mês e campanha, gerando cálculos automáticos de:
- Objetivo total;
- Caixa recebido;
- Percentual de quebra (% de Quebra);
- Série diária simulada;
- Quebra e desempenho individual por negociador.

---

## Como rodar localmente

**Pré-requisitos**

- Node.js (versão ≥ 18)
- npm (instalado junto com o Node) ou yarn
- (Opcional) Git, se for clonar o repositório diretamente

**Passo a passo**

1. Clone o repositório: git clone https://github.com/pedrohenriquecalais/painel-carteiras-mini.git
2. Acesse o diretório do projeto: cd painel-carteiras-mini
3. Instale as dependências: npm install
4. Inicie o servidor de desenvolvimento: npm run dev (O projeto usa o Vite para build e hot reload.)
5. Abra no navegador: http://localhost:5173


--- 

## Tecnologias utilizadas

| Categoria | Tecnologias 
|-----------|-------------
| Front-end | **React 18**, **TypeScript**, **Vite** 
| Gráficos  | **Recharts** 
| Estilo    | **CSS puro** 
| Gerenciamento de estado | **React Hooks (useState, useEffect)** 
| Armazenamento local     | **LocalStorage** 

---

##  Funcionalidades principais

✅ **Filtro por campanha e mês**
- Armazena o último filtro no `localStorage`
- Usa automaticamente o mês atual caso não haja dados salvos  

✅ **Indicadores (KPIs)**
- Exibe valores de *Objetivo Total*, *Caixa Recebido* e *% de Quebra*
- Calcula dinamicamente com base nos dados simulados  

✅ **Gráfico de Série Diária**
- Exibe o **caixa recebido por dia** no mês selecionado  
- Inclui **linha dourada com o objetivo diário**  
- Tooltip e escala de valores formatados em Real (R$)  

✅ **Resumo por Negociador**
- Mostra o desempenho de cada negociador com base no caixa gerado  
- Dados atualizados conforme o mês selecionado  

✅ **Simulação inteligente**
- Mês atual → dados até o dia de hoje  
- Meses passados → dados completos  
- Meses futuros → dados zerados  

---


## Decisões Técnicas e Justificativas

**1. Uso de TypeScript**

 O TypeScript foi mantido em toda a aplicação para garantir:

 - Tipagem explícita de todas as estruturas (Filtros, KPIs, SerieDiaria, Negociador)
 - Facilidade de manutenção e extensibilidade futura

 Exemplo: Utilizei data: (data.toISOString().split("T")[0] ?? "") as string para garantir compatibilidade entre o tipo string esperado e o retorno real da função.

**2. Simulação de Dados (Mock + Geração Dinâmica)**

 Foi utilizado o arquivo "mock.json" como base de dados estáticos, mas toda a geração de valores mensais e diários ocorre dinamicamente no "App.tsx".

 Motivo: O teste pedia apenas o uso de mock, sem integração real com APIs. Entretanto, ao observar a estrutura do desafio, notou-se que há referências a endpoints e comportamentos de APIS. Sugerindo que em uma aplicação real os dados seriam obtidos via requisições assíncronas.

 Exemplo: Implementei a função gerarDadosFiltrados() simulando essa camada de serviço.
 Assim, a aplicação se comporta como se estivesse recebendo dados reais de uma API, mantendo reatividade e fidelidade à proposta.

**3. Cálculo da % de Quebra**

 A especificação original indicava: % de Quebra = Quebra / Previsão (se Previsão = 0, exibir —), entretanto, durante os testes e simulações; 
 Observei que o campo previsao não é utilizado consistentemente em todos os pontos do mock;
 Exemplo: em alguns cenários, a aplicação apresentava resultados incoerentes (ex: 100 mil de objetivo e 72 mil recebidos resultando em apenas 15% de quebra)
 
 Decisão técnica: Adotei a seguinte fórmula, mais coerente com o comportamento esperado de desempenho financeiro:

 <!-- Observação:  -->
 decisão de substituir o cálculo com base na previsão por objetivo total foi tomada após análise da consistência dos dados. Essa escolha foi documentada e justificada neste README, garantindo transparência no raciocínio técnico. 
 Caso a API real utilize o campo previsao em substituição ao objetivo, basta ajustar o denominador na função de cálculo (percentualQuebra).

**4. Tratamento de Valores e Formatação**

 Criado um módulo utilitário "formatters.ts" para garantir consistência:
 - formatCurrency() → exibe valores monetários com padrão brasileiro (R$ e separadores);

 - formatPercent() → controla arredondamento e casas decimais.

**Tabela de Negociadores e Ordenação**

 Conforme proposto no desafio a tabela exibe:
 - Caixa recebido;
 - Quebra (R$);
 - % de Quebra (calculada individualmente);
 - E um sistema manual de ordenação clicando no cabeçalho “Caixa Recebido”.

**6. Gráfico de Série Diária**

 Foi implementado com Recharts, usando:
 - Área dourada para o caixa diário;
 - Linha rosa para o objetivo diário.

**7. Comportamento Esperado com APIs**
 Durante o desenvolvimento, foi observado que o teste menciona comportamento de APIs. 

 Por isso, escolhi estruturar o sistema foi  de forma API-ready, ou seja, basta substituir a função gerarDadosFiltrados() por chamadas HTTP (fetch ou axios) para que o painel funcione com dados reais.

 ##  Testes e Validação

- O comportamento dos cálculos foi validado com diferentes cenários de mês:
  - Mês atual → valores parciais até o dia de hoje.
  - Mês passado → dados completos simulados.
  - Mês futuro → dados zerados.

- Os KPIs foram testados para:
  - Exibir “—” quando a previsão é zero.
  - Garantir que o % de quebra nunca seja negativo.

- (Opcional) O projeto é compatível com **Vitest** ou **Jest** para implementação de testes unitários futuros.


##  Estrutura do projeto

src/
│
├── components/
│   ├── KPIs.tsx
│   ├── Filter.tsx
│   ├── Chart.tsx
│   └── NegotiatorsTable.tsx
│
├── data/
│   └── mock.json
│
├── utils/
│   └── formatters.ts
│
├── App.tsx
└── App.css

## Conclusão

O painel foi desenvolvido com foco em:

 - Clareza visual;
 - Fidelidade ao comportamento proposto no desafio;
 - Robustez e extensibilidade para futuras integrações.

 As decisões de cálculo e estrutura foram tomadas com base em análise técnica e coerência de negócio. 


## Referências e Bibliografia Técnica

### Documentação Oficial
- [React Docs](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Recharts](https://recharts.org/en-US/)
- [MDN – Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)

### Indicadores e Metodologia
- [SEBRAE – Indicadores de Desempenho Comercial](https://sebrae.com.br/sites/PortalSebrae)
- [Harvard Business Review – Sales Metrics](https://hbr.org/topic/sales-performance)
- [CFA Institute – Ratio Analysis](https://www.cfainstitute.org/en)

### Boas Práticas e Apoio
- [Clean Code – Robert C. Martin](https://cleancoders.com/)
- [Microsoft TypeScript Deep Dive – Basarat Ali Syed](https://basarat.gitbook.io/typescript/)
- [ChatGPT (OpenAI) – Apoio técnico e documentação](https://chat.openai.com/)

## Autor
**Pedro Henrique Calais**  
  Desenvolvedor Front-end  
- [pedroalbuquerquecalais@gmail.com](mailto:pedro.calais.dev@gmail.com)  
- [LinkedIn](https://www.linkedin.com/in/pedro-henrique-albuquerque-calais-2b7242289/) • 
- [GitHub](https://github.com/pedrohenriquecalais)

