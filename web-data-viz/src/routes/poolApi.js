const inicio = Date.now()
const INCIDENTE_APOS_MS = 60_000   
const rand = (min, max) => Math.random() * (max - min) + min
const emIncidente = () => Date.now() - inicio > INCIDENTE_APOS_MS


function workers() {
  const inc = emIncidente()
  return [
    {
      name: 'rig-03', farm: 'A', status: 'online',
      hashrate: +(inc ? rand(11.5, 13) : rand(17.5, 18.5)).toFixed(1),
      sharesRejeitadosPct: +(inc ? rand(4, 7) : rand(0, 1.5)).toFixed(1)
    },
    {
      name: 'rig-04', farm: 'B', status: 'online',
      hashrate: +rand(17.5, 18.5).toFixed(1),
      sharesRejeitadosPct: +rand(0, 1.5).toFixed(1)
    }
  ]
}

function sondas() {
  const inc = emIncidente()
  return {
    A: { gateway: 2, dns: 18, poolRtt: Math.round(inc ? rand(180, 230) : rand(30, 50)) },
    B: { gateway: 3, dns: 22, poolRtt: Math.round(rand(35, 45)) }
  }
}

app.get('/pool-api/v1/workers', (req, res) => res.json({ workers: workers() }))
app.get('/pool-api/v1/sondas',  (req, res) => res.json(sondas()))

// tempo real: envia a cada 2 s
setInterval(() => {
  const msg = JSON.stringify({ t: Date.now(), workers: workers(), sondas: sondas() })
  wss.clients.forEach(c => c.readyState === 1 && c.send(msg))
}, 2000)

server.listen(3333, () => console.log('mock pool em http://localhost:3333'))