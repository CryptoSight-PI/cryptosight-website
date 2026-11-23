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

// sobre a EMPRESA 

function buscarEmpresa(idEmpresa) {
   
    return database.executar(
        "SELECT nome_fantasia, url_jira FROM empresa WHERE id = ?",
        [idEmpresa]
    );
}

// sobre as kpos

// farm com mais maquinas que tiveram 3+ alertas do mesmo componente em 30 dias -YasminEloitaNascimento
function kpiReincidentes(idEmpresa) {
    return database.executar(`
        SELECT f.id, f.nome, COUNT(DISTINCT t.id_maquina) AS maquinas
        FROM (
            SELECT mc.id_maquina, mc.id_componente
            FROM alerta a
            JOIN maquina_componente mc ON mc.id = a.id_mc
            WHERE a.data_hora_detectado >= NOW() - INTERVAL 30 DAY
            GROUP BY mc.id_maquina, mc.id_componente
            HAVING COUNT(*) >= 3
        ) t
        JOIN maquina m ON m.id = t.id_maquina
        JOIN sessao s ON s.id = m.id_sessao
        JOIN farm f ON f.id = s.id_farm
        WHERE f.id_empresa = ?
        GROUP BY f.id, f.nome
        ORDER BY maquinas DESC
        LIMIT 1`, [idEmpresa]);
}

function kpiDiaHorario(idEmpresa) {
    return database.executar(`
        SELECT DAYOFWEEK(a.data_hora_detectado) AS dia,
               HOUR(a.data_hora_detectado) AS hora,
               COUNT(*) AS total
        ${JOIN_ALERTAS}
        WHERE f.id_empresa = ? AND a.data_hora_detectado >= NOW() - INTERVAL 30 DAY
        GROUP BY dia, hora
        ORDER BY total DESC
        LIMIT 1`, [idEmpresa]);
}

// total de alertas e quantos foram resolvidos em 30d -YasminEloitaNascimento
function kpiResolvidos(idEmpresa) {
    return database.executar(`
        SELECT COUNT(*) AS total,
               COALESCE(SUM(a.status = 'resolvido'), 0) AS resolvidos
        ${JOIN_ALERTAS}
        WHERE f.id_empresa = ? AND a.data_hora_detectado >= NOW() - INTERVAL 30 DAY`,
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
               SUM(a.severidade = 'critico') AS criticos
        ${JOIN_ALERTAS}
        WHERE f.id_empresa = ? ${filtroFarm}
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
               c.nome AS componente
        ${JOIN_ALERTAS}
        WHERE f.id_empresa = ? AND f.id = ?
          AND a.data_hora_detectado >= NOW() - INTERVAL ${intervalo}
        ORDER BY a.data_hora_detectado DESC`, [idEmpresa, idFarm]);
}

// quantidade de alertas abertos por farm  -YasminEloitaNascimento
function alertasAbertosPorFarm(idEmpresa) {
    return database.executar(`
        SELECT f.id AS id_farm, COUNT(*) AS abertos
        ${JOIN_ALERTAS}
        WHERE f.id_empresa = ? AND a.status = 'a resolver'
        GROUP BY f.id`, [idEmpresa]);
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
    kpiReincidentes,
    kpiDiaHorario,
    kpiResolvidos,
    alertasPorGrupo,
    alertasDaFarm,
    alertasAbertosPorFarm,
    lerGold
};