// import { labels, dataHashrate, dataRtt, dataShares } from './noc-service.js';

const labels = [
'0h', '1h', '2h', '3h', '4h', '5h', 
'6h', '7h', '8h', '9h', '10h', '11h', 
'12h', '13h', '14h', '15h', '16h', '17h', 
'18h', '19h', '20h', '21h', '22h', '23h'
]

const dataHashrate = Array.from({ length: 24 }, () => +(105 + Math.random() * 10).toFixed(1));
const dataRtt = Array.from({ length: 24 }, () => Math.floor(25 + Math.random() * 40));
const dataShares = Array.from({ length: 24 }, () => Math.floor(Math.random() * 4));

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


// const labels = [
  //   '0h', '1h', '2h', '3h', '4h', '5h', 
  //   '6h', '7h', '8h', '9h', '10h', '11h', 
  //   '12h', '13h', '14h', '15h', '16h', '17h', 
  //   '18h', '19h', '20h', '21h', '22h', '23h'
  // ]

// const dataHashrate = [
//   108.4, 110.2, 109.8, 111.5, 110.1, 107.9, 109.3, 112.0,
//   110.5, 108.9, 109.7, 111.2, 110.8, 106.5, 109.1, 110.4,
//   111.8, 110.0, 108.6, 109.9, 111.1, 110.3, 109.5, 110.7
// ]

// const dataRtt = [
//   32, 35, 29, 31, 38, 42, 30, 28,
//   33, 45, 78, 36, 31, 29, 34, 37,
//   32, 30, 41, 55, 33, 31, 28, 32
// ]


// const dataShares = [
//   0, 1, 0, 0, 2, 1, 0, 0,
//   0, 1, 4, 1, 0, 0, 1, 0,
//   0, 2, 1, 3, 0, 0, 1, 0
// ]

// const hipoteses = [
//   { titulo: 'Rede local', estado: 'descartada',
//     detalhe: 'gateway 2 ms · DNS 18 ms · eth0 ativa · 0 erros de entrada/saída' },
//   { titulo: 'Pool / rota externa', estado: 'provavel',
//     detalhe: 'RTT 212 ms (limite 150) · perda 5,8% · Stratum 880 ms, perto do limite de 1 000' },
//   { titulo: 'Hardware', estado: 'descartada',
//     detalhe: 'temperatura GPU 68 °C · utilização 97% · sem alerta de recursos' }
// ]

// const estadoHipotese = {
//   descartada: { rotulo: '✓ DESCARTADA', cor: 'text-[#2dd4a7]' },
//   provavel:   { rotulo: '! PROVÁVEL',   cor: 'text-red-400' }
// }

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

  // linha horizontal fixa (base ou limite)
  const linhaFixa = (valor, cor, etiqueta) => ({
    label: etiqueta,
    data: labels.map(() => valor),
    borderColor: cor,
    borderWidth: 1,
    borderDash: [6, 4],
    pointRadius: 0
  });


  new Chart(ctxHashrate, {
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

  new Chart(ctxRtt, {
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

  new Chart(ctxShares, {
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

  // new Chart(ctxShares, {
  //   type: 'bar',
  //   data: {
  //     labels: labels,
  //     datasets: [
  //       {
  //         data: dataShares,
  //         backgroundColor: ctx => ctx.raw > 2 ? cores.shares : 'rgba(110,150,130,.55)',
  //         borderRadius: 2
  //       },
  //       { type: 'line', ...linhaFixa(2, cores.texto) } // limite 2%
  //     ]
  //   },
  //   options: opcoes(0, 8, true) // mostra o eixo X só aqui embaixo
  // });

function iniciarGraficos () {
  
}

function atualizarGraficos () {
  
}



// Hashrate efetivo
// new Chart(ctxHashrate, {
//   type: 'line',
//   data: {
//     labels,
//     datasets: [
//       {
//         data: dataHashrate,
//         borderColor: cores.hashrate,
//         backgroundColor: 'rgba(45,212,167,.1)',
//         fill: true,
//         borderWidth: 1.5,
//         pointRadius: 0,
//         tension: 0.3
//       },
//       linhaFixa(18.2, cores.base) // base
//     ]
//   },
//   options: opcoes(8, 20)
// });



// opções compartilhadas pelos 3 gráficos
// const opcoes = (min, max, mostrarX = false) => ({
//   responsive: true,
//   maintainAspectRatio: false,
//   animation: true,
//   plugins: { legend: { display: false } },
//   scales: {
//     x: {
//       grid: { display: false },
//       ticks: { display: mostrarX, color: cores.texto, maxTicksLimit: 6 }
//     },
//     y: {
//       min,
//       max,
//       grid: { color: cores.grade },
//       border: { display: false },
//       ticks: { color: cores.texto, maxTicksLimit: 4 }
//     }
//   }
// });


// // 2) RTT até o pool
// new Chart(ctxRtt, {
//   type: 'line',
//   data: {
//     labels,
//     datasets: [
//       {
//         data: dataRtt,
//         borderColor: cores.rtt,
//         backgroundColor: 'rgba(122,162,247,.1)',
//         fill: true,
//         borderWidth: 1.5,
//         pointRadius: 0,
//         tension: 0.3
//       },
//       linhaFixa(150, cores.limite) // limite 150 ms
//     ]
//   },
//   options: opcoes(0, 260)
// });

// // 3) Shares rejeitados + stale (barras)
// new Chart(ctxShares, {
//   type: 'bar',
//   data: {
//     labels,
//     datasets: [
//       {
//         data: dataShares,
//         backgroundColor: ctx => ctx.raw > 2 ? cores.shares : 'rgba(110,150,130,.55)',
//         borderRadius: 2
//       },
//       { type: 'line', ...linhaFixa(2, cores.limite) } // limite 2%
//     ]
//   },
//   options: opcoes(0, 8, true) // mostra o eixo X só aqui embaixo
// });