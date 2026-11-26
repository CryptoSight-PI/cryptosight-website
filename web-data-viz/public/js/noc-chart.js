
// Charts will be populated from the backend. Default farmId can be overridden with ?farmId=ID in the URL

function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

const DEFAULT_FARM_ID = Number(getQueryParam('farmId')) || 1;

let labels = [];
let dataHashrate = [];
let dataRtt = [];
let dataShares = [];

const hipoteses = [
  { titulo: 'Rede local', estado: 'descartada',
    detalhe: 'gateway 2 ms · DNS 18 ms · eth0 ativa · 0 erros de entrada/saída' },
  { titulo: 'Pool / rota externa', estado: 'provavel',
    detalhe: 'RTT 212 ms (limite 150) · perda 5,8% · Stratum 880 ms, perto do limite de 1 000' },
  { titulo: 'Hardware', estado: 'descartada',
    detalhe: 'temperatura GPU 68 °C · utilização 97% · sem alerta de recursos' }
]

const estadoHipotese = {
  descartada: { rotulo: '✓ DESCARTADA', cor: 'text-[#2dd4a7]' },
  provavel:   { rotulo: '! PROVÁVEL',   cor: 'text-red-400' }
}

const ctxHashrate = document.getElementById('grafico-hashrate-efetivo').getContext('2d')
const ctxRtt = document.getElementById('grafico-latencia-pool').getContext('2d')
const ctxShares = document.getElementById('grafico-shares-rejeitados').getContext('2d')

const cores = {
hashrate: '#2dd4a7',
rtt: '#7aa2f7',
shares: '#E00027',
limite: '#f5b301',
base: 'rgba(255, 208, 0, 0.8)',

grade: 'rgba(255,255,255,.03)',
texto: '#9CA3AF'
};

const linhaFixa = (valor, cor, etiqueta) => ({
label: etiqueta,
data: labels.map(() => valor),
borderColor: cor,
borderWidth: 1,
borderDash: [6, 4],
pointRadius: 0
});

let chartHashrate = new Chart(ctxHashrate, {
type: 'line',
data: {
  labels: labels,
  datasets: [{
    label: 'Hashrate efetivo (MH/s)',
    data: dataHashrate,
    borderColor: cores.hashrate,
    backgroundColor: 'rgba(45,212,167,.1)',
    fill: true,
    borderWidth: 1,
    pointRadius: 0,
    tension: 0.1
  },
  linhaFixa(15, cores.base, 'valor base: 15 MH/s')   
]
},
options: {
  responsive: true,
  maintainAspectRatio: false,
  animation: true,
  interaction: { mode: 'index', intersect: false },
  elements: { point: { radius: 0, hoverRadius: 5 } },
  plugins: { 
    legend: {
      display: true,
      position: 'top',
      align: 'end',

      labels: {
        color: cores.texto,               
        color: '#2dd4a7',
        usePointStyle: true,
        pointStyle: 'line',
        boxWidth: 20,
        font: { family: "'Space Mono', monospace", size: 14, weight: 800 },
        generateLabels: chart => {
          const itens = Chart.defaults.plugins.legend.labels.generateLabels(chart)
          itens[0].fontColor = cores.hashrate
          itens[1].fontColor = cores.texto  
          return itens
        }
      }
    },

    tooltip: {
      backgroundColor: 'rgba(8,24,20,.95)',
      borderColor: 'rgba(255,255,255,.15)',
      borderWidth: 1,
      titleFont: { family: "'Space Mono', monospace", size: 14 },
      bodyFont: { family: "'Space Mono', monospace", size: 14 },

    }
  },
  scales: {
    x: {
      grid: {display: false},
      ticks: {
          color: cores.texto,
          font: { family: "'Space Mono', monospace", size: 12 }
      }
    },
    y: {
      grid: { color: cores.grade },
      ticks: {
          color: cores.texto,
          font: { family: "'Space Mono', monospace", size: 12 }
      },
      border: { display:false }
    }
  }
}
});

let chartRtt = new Chart(ctxRtt, {
type: 'line',
data: {
  labels: labels,
  datasets: [{
    label: 'Latência até o pool (ms)',
    data: dataRtt,
    borderColor: cores.rtt,
    backgroundColor: 'rgba(122,162,247,.2)',
    fill: true,
    borderWidth: 1,
    pointRadius: 0,
    tension: 0.1
  },
  linhaFixa(12, cores.base, 'limite: 12 ms')   
]
},
options: {
  responsive: true,
  maintainAspectRatio: false,
  animation: true,
  interaction: { mode: 'index', intersect: false },
  elements: { point: { radius: 0, hoverRadius: 5 } },
  plugins: { 
    legend: {
      display: true,
      position: 'top',
      align: 'end',

      labels: {
        color: cores.texto,               
        color: '#2dd4a7',
        usePointStyle: true,
        pointStyle: 'line',
        boxWidth: 20,
        font: { family: "'Space Mono', monospace", size: 14, weight: 800 },
        generateLabels: chart => {
          const itens = Chart.defaults.plugins.legend.labels.generateLabels(chart)
          itens[0].fontColor = cores.rtt
          itens[1].fontColor = cores.texto  
          return itens
        }
      }
    },

    tooltip: {
      backgroundColor: 'rgba(8,24,20,.95)',
      borderColor: 'rgba(255,255,255,.15)',
      borderWidth: 1,
      titleFont: { family: "'Space Mono', monospace", size: 14 },
      bodyFont: { family: "'Space Mono', monospace", size: 14 },

    }
  },
  scales: {
    x: {
      grid: {display: false},
      ticks: {
          color: cores.texto,
          font: { family: "'Space Mono', monospace", size: 12 }
      }
    },
    y: {
      grid: { color: cores.grade },
      ticks: {
          color: cores.texto,
          font: { family: "'Space Mono', monospace", size: 12 }
      },
      border: { display:false }
    }
  }
}
});

let chartShares = new Chart(ctxShares, {
type: 'bar',
data: {
  labels: labels,
  datasets: [{
    label: 'Shares rejeitados + Stale (%)',
    data: dataShares,
    borderRadius: 6,
    borderColor: cores.shares,
    backgroundColor: cores.shares ,
    // backgroundColor: 'rgba(224,0,39,.3)',
    fill: true,
    borderWidth: 1,
    pointRadius: 0,
    tension: 0.1
  },
  { ...linhaFixa(2, cores.base, 'limite: 2%'), type: 'line' },   
]
},
options: {
  responsive: true,
  maintainAspectRatio: false,
  animation: true,
  interaction: { mode: 'index', intersect: false },
  elements: { point: { radius: 0, hoverRadius: 5 } },
  plugins: { 
    legend: {
      display: true,
      position: 'top',
      align: 'end',

      labels: {
        color: cores.texto,               
        color: '#2dd4a7',
        usePointStyle: true,
        pointStyle: 'line',
        boxWidth: 20,
        font: { family: "'Space Mono', monospace", size: 14, weight: 800 },
        generateLabels: chart => {
          const itens = Chart.defaults.plugins.legend.labels.generateLabels(chart)
          itens[0].fontColor = cores.shares
          itens[1].fontColor = cores.texto  
          return itens
        }
      }
    },

    tooltip: {
      backgroundColor: 'rgba(8,24,20,.95)',
      borderColor: 'rgba(255,255,255,.15)',
      borderWidth: 1,
      titleFont: { family: "'Space Mono', monospace", size: 14 },
      bodyFont: { family: "'Space Mono', monospace", size: 14 },

    }
  },
  scales: {
    x: {
      grid: {display: false},
      ticks: {
          color: cores.texto,
          font: { family: "'Space Mono', monospace", size: 12 }
      }
    },
    y: {
      grid: { color: cores.grade },
      ticks: {
          color: cores.texto,
          font: { family: "'Space Mono', monospace", size: 12 }
      },
      border: { display:false }
    }
  }
}
});


function iniciarGraficos () {
  const companyId = Number(sessionStorage.getItem('noc_company_id')) || Number(getQueryParam('companyId')) || 1;
  // persist selected company in sessionStorage so it can be reused by other pages
  sessionStorage.setItem('noc_company_id', companyId);

  // populate farms select
  window.nocService.fetchFarmsByCompany(companyId).then(farms => {
    try {
      const select = document.querySelector('select[name="farm"]');
      if (!select) return;
      select.innerHTML = '';
      farms.forEach(f => {
        const opt = document.createElement('option');
        opt.value = f.id;
        opt.textContent = f.nome;
        select.appendChild(opt);
      });

      // restore last selection or default
      const savedFarm = localStorage.getItem('noc_selected_farm') || select.options[0].value;
      select.value = savedFarm;

      // wire events
      select.addEventListener('change', () => {
        localStorage.setItem('noc_selected_farm', select.value);
        atualizarGraficos();
      });

      const radios = document.querySelectorAll('input[name="periodo"]');
      const savedPeriod = localStorage.getItem('noc_selected_period') || '30d';
      radios.forEach(r => {
        if (r.value === savedPeriod) r.checked = true;
        r.addEventListener('change', () => {
          if (r.checked) {
            localStorage.setItem('noc_selected_period', r.value);
            atualizarGraficos();
          }
        });
      });

      // initial render
      atualizarGraficos();

    } catch (e) {
      console.warn('Erro ao popular select de farms', e);
    }
  }).catch(err => console.warn('Erro ao buscar farms', err));
}

// ensure the charts initialize when the page loads
window.addEventListener('DOMContentLoaded', function () {
  try {
    iniciarGraficos();
  } catch (e) {
    console.warn('Erro ao iniciar graficos automaticamente', e);
  }
});

function atualizarGraficos () {
  const select = document.querySelector('select[name="farm"]');
  const farmId = select && select.value ? Number(select.value) : (Number(getQueryParam('farmId')) || DEFAULT_FARM_ID);

  const period = localStorage.getItem('noc_selected_period') || (document.querySelector('input[name="periodo"]:checked') ? document.querySelector('input[name="periodo"]:checked').value : '30d');

  // fetch KPIs and update the kpi cards
  window.nocService.fetchKPIs(farmId, period).then(kpi => {
    try {
      // update KPI cards by id if present
      if (kpi && Object.keys(kpi).length) {
        const accepted = kpi.shares_aceitos || 0;
        const pctRej = kpi.pct_shares_rejeitados || 0;
        const pctStale = kpi.pct_shares_stale || 0;

        const elAccepted = document.getElementById('kpi-shares-aceitos');
        const elRej = document.getElementById('kpi-shares-rejeitados');
        const elStale = document.getElementById('kpi-shares-stale');
        if (elAccepted) elAccepted.textContent = accepted;
        if (elRej) elRej.textContent = (pctRej ? pctRej + '%' : '0%');
        if (elStale) elStale.textContent = (pctStale ? pctStale + '%' : '0%');
      }
    } catch (e) {
      console.warn('Erro ao atualizar KPIs no DOM', e);
    }
  }).catch(e => console.warn(e));

  // fetch eficiencia and medicao_rede, then update charts
  Promise.all([
    window.nocService.fetchEficiencia(farmId, period),
    window.nocService.fetchMedicaoRede(farmId, period)
  ]).then(([eficienciaRows, medicaoRows]) => {
    // build labels from timestamps (if present) or index
    if (eficienciaRows && eficaciaExists(eficienciaRows)) {
      labels = eficienciaRows.map(r => formatTimestamp(r.timestamp_medicao));
      dataHashrate = eficienciaRows.map(r => Number(r.hashrate) || 0);
      // compute shares total pct (rejeitados + stale) percent or raw counts
      dataShares = eficienciaRows.map(r => {
        const ace = Number(r.shares_aceitos) || 0;
        const rej = Number(r.shares_rejeitados) || 0;
        const stale = Number(r.shares_stale) || 0;
        const denom = ace + rej + stale;
        return denom ? +(((rej + stale) * 100) / denom).toFixed(2) : 0;
      });
    } else if (medicaoRows && medicaoRows.length) {
      // fallback to medicao timestamps
      labels = medicaoRows.map(r => formatTimestamp(r.timestamp_medicao));
    } else {
      // nothing to show
      labels = [];
      dataHashrate = [];
      dataShares = [];
    }

    if (medicaoRows && medicaoRows.length) {
      dataRtt = medicaoRows.map(r => Number(r.latencia_pool) || 0);
    } else {
      dataRtt = Array.from({length: labels.length}, () => 0);
    }

    // update charts safely
    updateChart(chartHashrate, labels, dataHashrate);
    updateChart(chartRtt, labels, dataRtt);
    updateChart(chartShares, labels, dataShares);

  }).catch(err => console.warn('Erro ao buscar dados NOC', err));
}

function eficaciaExists(rows) {
  return Array.isArray(rows) && rows.length > 0 && rows[0].hasOwnProperty('hashrate');
}

function formatTimestamp(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  if (isNaN(d.getTime())) return ts;
  return d.toLocaleString();
}

function updateChart(chart, newLabels, newData) {
  chart.data.labels = newLabels;
  if (chart.data.datasets && chart.data.datasets[0]) {
    chart.data.datasets[0].data = newData;
  }
  chart.update();
}

function apiFetch() {
  // FILTRO DE FARMS

  // FILTRO DE DATA HORA

  // BUSCA DE DADOS WORKERS
  const ws = new WebSocket('ws://localhost:3333/ws')
  ws.onmessage = e => {
  
  const { workers, sondas } = JSON.parse(e.data)
  
  setInterval(() => {
    console.log("======== DADOS ========");
    console.log("WORKERS: ", workers)
    console.log("SONDAS: ", sondas)
  }, 2000);
  // atualizar gráficos e KPIs aqui
}
  // BUSCA DE DADOS SONDA
  
  // PLOTAGEM DOS GRÁFICOS
}

// function connectWebSocketChannel() {

//   const client = new Client({
//   brokerURL: 'ws://localhost:8080/ws',
//   connectHeaders: {
//     login: 'usuario',
//     passcode: 'senha',
//     // ou Authorization: 'Bearer SEU_TOKEN'
//   },
// }



const respostaIA = document.getElementById('resposta-bobia')
let resumo = []

const contexto = 
`
    Você é um assistente simpático e animado que sugere entretenimento.
    Com base nos itens que o usuário já consumiu ou está consumindo (LEIA OS DADOS EM JSON): ${resumo}. 

    Identifique as categorias e gêneros que o usuário geralmente consome para fazer essa análise e sugestão.

    Sugira UM novo item que ele ainda não tem na lista, junto com o diretor, artista 
    ou banda que criou aquele entretenimento, de forma curta, alegre e amigável.
    Use frases como "Que tal você assistir X de Y hoje?", "Que tal você ler X do autor Y dessa vez?" ou "Já experimentou jogar X?".
    Responda em português, em no máximo duas frases. Sem explicações longas.

    Indenpentente se os dados em Json vierem ou nao, retorne apenas a linha de sugestao.

    Atente-se ao tipo de item, que DEVE estar dentro de uma das seguintes categorias:
    - Filmes
    - Séries
    - Animes/Desenhos
    - Mangás
    - Livros
    - Jogos de videogame
    - Músicas
`

async function gerarResposta() {
    const pergunta = contexto;

    const response = await fetch('/bobIA/perguntar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pergunta })
    });

    const data = await response.json();
    console.log("Dados da IA DATA.RESULTADO: ", data.resultado)
    console.log("Dados da IA DATA: ", data)

    respostaIA.innerHTML = data.resultado;
}
