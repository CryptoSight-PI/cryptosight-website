// Simple service to fetch NOC data from the backend
// API_BASE can be set globally (window.NOC_API_BASE) when serving the HTML statically
const API_BASE = (typeof window !== 'undefined' && window.NOC_API_BASE) ? window.NOC_API_BASE : '';

function fetchKPIs(farmId = 1, period = '30d') {
  return fetch(`${API_BASE}/noc/kpis/${farmId}?period=${encodeURIComponent(period)}`).then(res => {
    if (!res.ok) throw new Error('Erro ao buscar KPIs');
    return res.json();
  });
}

function fetchEficiencia(farmId = 1, period = '30d') {
  return fetch(`${API_BASE}/noc/eficiencia/${farmId}?period=${encodeURIComponent(period)}`).then(res => {
    if (!res.ok) throw new Error('Erro ao buscar eficiencia');
    return res.json();
  });
}

function fetchMedicaoRede(farmId = 1, period = '30d') {
  return fetch(`${API_BASE}/noc/medicao_rede/${farmId}?period=${encodeURIComponent(period)}`).then(res => {
    if (!res.ok) throw new Error('Erro ao buscar medicao_rede');
    return res.json();
  });
}

function fetchFarmsByCompany(companyId = 1) {
  return fetch(`${API_BASE}/farms/list/${companyId}`).then(res => {
    if (!res.ok) throw new Error('Erro ao buscar farms');
    return res.json();
  });
}

/* export functions to global scope so noc-chart.js can call them (app isn't using modules) */
window.nocService = {
  fetchKPIs,
  fetchEficiencia,
  fetchMedicaoRede,
  fetchFarmsByCompany
};
