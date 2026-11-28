var database = require("../database/config");

// URL do bucket gold  -YasminEloitaNascimento
const URL_GOLD = process.env.URL_GOLD_env;

//  so valores desta lista entram no SQL (evita SQL injection) -YasminEloitaNascimento
const JANELAS = { "24h": "24 HOUR", "7d": "7 DAY", "30d": "30 DAY" };

//  so valores desta lista entram no SQL -YasminEloitaNascimento
const AGRUPAMENTOS = {
    farm: "f.nome",
    dia: "DAYOFWEEK(a.data_hora_detectado)",
    horario: "HOUR(a.data_hora_detectado)"
};

// liga alerta ate a farm -YasminEloitaNascimento
const JOIN_ALERTAS = `
    FROM alerta a
    JOIN maquina_componente mc ON mc.id = a.id_mc
    JOIN componente c ON c.id = mc.id_componente
    JOIN maquina m ON m.id = mc.id_maquina
    JOIN sessao s ON s.id = m.id_sessao
    JOIN farm f ON f.id = s.id_farm`;


const INICIO_MES = "DATE_FORMAT(CURDATE(), '%Y-%m-01')";

const EH_CRITICO = "a.severidade LIKE 'cr%'";

// sobre a EMPRESA 

function buscarEmpresa(idEmpresa) {
   
    return database.executar(
        "SELECT nome_fantasia, url_jira FROM empresa WHERE id = ?",
        [idEmpresa]
    );
}

// lista de componentes para o filtro do relatorio -YasminEloitaNascimento
function listarComponentes() {
    return database.executar("SELECT id, nome FROM componente ORDER BY nome", []);
}

// sobre as kpos

// farm com mais alertas REINCIDENTES no mes atual -YasminEloitaNascimento
function kpiReincidentes(idEmpresa) {
    return database.executar(`
        SELECT f.id, f.nome, COUNT(*) AS total
        ${JOIN_ALERTAS}
        WHERE f.id_empresa = ?
          AND a.e_reincidente = 1
          AND a.data_hora_detectado >= ${INICIO_MES}
        GROUP BY f.id, f.nome
        ORDER BY total DESC
        LIMIT 1`, [idEmpresa]);
}

// total de reincidentes de TODAS as farms: mes atual x mes passado 
function kpiReincidentesGeral(idEmpresa) {
    return database.executar(`
        SELECT CAST(COALESCE(SUM(a.data_hora_detectado >= ${INICIO_MES}), 0) AS UNSIGNED) AS total,
               CAST(COALESCE(SUM(a.data_hora_detectado <  ${INICIO_MES}), 0) AS UNSIGNED) AS anterior
        ${JOIN_ALERTAS}
        WHERE f.id_empresa = ?
          AND a.e_reincidente = 1
          AND a.data_hora_detectado >= DATE_SUB(${INICIO_MES}, INTERVAL 1 MONTH)`, [idEmpresa]);
}

// maquinas + componente com reincidente no mes atual, de todas as farms
// primeiro quem tem mais reincidentes criticos, depois quem tem mais reincidentes -YasminEloitaNascimento
function reincidentesDoMes(idEmpresa) {
    return database.executar(`
        SELECT m.id AS id_maquina, c.nome AS componente, f.nome AS farm, s.nome AS sessao,
               COUNT(*) AS total,
               SUM(${EH_CRITICO}) AS criticos,
               MAX(a.data_hora_detectado) AS ultimo_em
        ${JOIN_ALERTAS}
        WHERE f.id_empresa = ?
          AND a.e_reincidente = 1
          AND a.data_hora_detectado >= ${INICIO_MES}
        GROUP BY m.id, c.id, c.nome, f.nome, s.nome
        ORDER BY criticos DESC, total DESC, ultimo_em DESC`, [idEmpresa]);
}

function kpiDiaHorario(idEmpresa) {
    return database.executar(`
        SELECT DAYOFWEEK(a.data_hora_detectado) AS dia,
               HOUR(a.data_hora_detectado) AS hora,
               COUNT(*) AS total
        ${JOIN_ALERTAS}
        WHERE f.id_empresa = ? AND a.e_reincidente = 0 AND a.data_hora_detectado >= NOW() - INTERVAL 30 DAY
        GROUP BY dia, hora
        ORDER BY total DESC
        LIMIT 1`, [idEmpresa]);
}

// alertas so principais e quantos foram resolvidos: mes atual x mes passado -YasminEloitaNascimento
function kpiResolvidos(idEmpresa) {
    return database.executar(`
        SELECT CAST(COALESCE(SUM(a.data_hora_detectado >= ${INICIO_MES}), 0) AS UNSIGNED) AS total,
               CAST(COALESCE(SUM(a.data_hora_detectado >= ${INICIO_MES} AND a.status = 'resolvido'), 0) AS UNSIGNED) AS resolvidos,
               CAST(COALESCE(SUM(a.data_hora_detectado <  ${INICIO_MES}), 0) AS UNSIGNED) AS total_anterior,
               CAST(COALESCE(SUM(a.data_hora_detectado <  ${INICIO_MES} AND a.status = 'resolvido'), 0) AS UNSIGNED) AS resolvidos_anterior
        ${JOIN_ALERTAS}
        WHERE f.id_empresa = ? AND a.e_reincidente = 0
          AND a.data_hora_detectado >= DATE_SUB(${INICIO_MES}, INTERVAL 1 MONTH)`,
        [idEmpresa]);
}


// alertas agrupados e separados por componente -YasminEloitaNascimento
function alertasPorGrupo(idEmpresa, janela, agrupar, idFarm) {
    let intervalo = JANELAS[janela] || JANELAS["7d"];
    let grupo = AGRUPAMENTOS[agrupar] || AGRUPAMENTOS.farm;

    let params = [idEmpresa];
    let filtroFarm = "";
    if (idFarm) {
        filtroFarm = "AND f.id = ?";
        params.push(idFarm);
    }

        return database.executar(`
        SELECT ${grupo} AS grupo,
               MIN(f.id) AS id_farm,
               COUNT(*) AS total,
               SUM(${EH_CRITICO}) AS criticos
        ${JOIN_ALERTAS}
        WHERE f.id_empresa = ? ${filtroFarm}
          AND a.e_reincidente = 0
          AND a.data_hora_detectado >= NOW() - INTERVAL ${intervalo}
        GROUP BY grupo`, params);
    }

// lista de alertas de uma farm no caso abre no modal -YasminEloitaNascimento

function alertasDaFarm(idEmpresa, idFarm, janela) {
    let intervalo = JANELAS[janela] || JANELAS["7d"];

    return database.executar(`
        SELECT a.id, a.descricao, a.severidade, a.valor_detectado, a.status,
               a.data_hora_detectado, a.chave_jira,
               m.id AS id_maquina, s.nome AS sessao, f.nome AS farm,
               c.nome AS componente,
               (SELECT COUNT(*) FROM alerta r WHERE r.id_alerta_principal = a.id) AS reincidentes
        ${JOIN_ALERTAS}
        WHERE f.id_empresa = ? AND f.id = ? AND a.e_reincidente = 0
          AND a.data_hora_detectado >= NOW() - INTERVAL ${intervalo}
        ORDER BY a.data_hora_detectado DESC`, [idEmpresa, idFarm]);
}

// quantidade de alertas abertos por farm  -YasminEloitaNascimento
function alertasAbertosPorFarm(idEmpresa) {
    return database.executar(`
        SELECT f.id AS id_farm, COUNT(*) AS abertos
        ${JOIN_ALERTAS}
        WHERE f.id_empresa = ? AND a.status = 'a resolver' AND a.e_reincidente = 0
        GROUP BY f.id`, [idEmpresa]);
}




// devolve o json inteiro (com gerado_em) -YasminEloitaNascimento
async function lerGoldCompleto(caminho) {
    let resposta = await fetch(encodeURI(`${URL_GOLD}/${caminho}`), { cache: "no-store" });

    if (!resposta.ok) {
        throw new Error(`Arquivo nao encontrado no S3: ${caminho} (${resposta.status})`);
    }

    return await resposta.json();
}

async function lerGold(caminho) {
    let resposta = await fetch(encodeURI(`${URL_GOLD}/${caminho}`), { cache: "no-store" });

    if (!resposta.ok) {
        throw new Error(`Arquivo nao encontrado no S3: ${caminho} (${resposta.status})`);
    }

    let json = await resposta.json();
    return json.dados;
}

module.exports = {
    buscarEmpresa,
    listarComponentes,
    kpiReincidentes,
    kpiReincidentesGeral,
    reincidentesDoMes,
    kpiDiaHorario,
    kpiResolvidos,
    alertasPorGrupo,
    alertasDaFarm,
    alertasAbertosPorFarm,
    lerGold,
    lerGoldCompleto
};