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