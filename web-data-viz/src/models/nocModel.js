var database = require("../database/config");

function buildIntervalExpr(period) {
    switch (period) {
        case '24h':
            return 'NOW() - INTERVAL 24 HOUR';
        case '7d':
            return 'NOW() - INTERVAL 7 DAY';
        case '30d':
        default:
            return 'NOW() - INTERVAL 30 DAY';
    }
}

function getKPIs(id_farm, period) {
    var intervalExpr = buildIntervalExpr(period);
    var instrucaoSql = `
    select 
        sum(em.hashrate) as hashrate,
        sum(em.shares_aceitos) as shares_aceitos,
        sum(em.shares_rejeitados) as shares_rejeitados,
        sum(em.shares_stale) as shares_stale,

        round(
            (sum(em.shares_aceitos) * 100) / 
            nullif(sum(em.shares_aceitos )+ sum(em.shares_rejeitados ) + sum(em.shares_stale), 0), 2
        ) as pct_shares_aceitos,
        
        round(
            (sum(em.shares_rejeitados) * 100) / 
            nullif(sum(em.shares_aceitos )+ sum(em.shares_rejeitados ) + sum(em.shares_stale), 0), 2
        ) as pct_shares_rejeitados,
        
        round(
            (sum(em.shares_stale) * 100) / 
            nullif(sum(em.shares_aceitos )+ sum(em.shares_rejeitados ) + sum(em.shares_stale), 0), 2
        ) as pct_shares_stale
    from eficiencia_maquina em
    join maquina as m
        on em.id_maquina = m.id
    join sessao as s
        on m.id_sessao = s.id
    join farm as f
        on f.id = s.id_farm
    where em.timestamp_medicao >= ${intervalExpr}
    and f.id = ?;
    `;

    console.log("Executando SQL KPIs: \n" + instrucaoSql, id_farm);
    return database.executar(instrucaoSql, [id_farm]);
}

function getEficiencia(id_farm, period) {
    var intervalExpr = buildIntervalExpr(period);
    var instrucaoSql = `
    select 
        em.hashrate as hashrate,
        em.shares_aceitos as shares_aceitos,
        em.shares_rejeitados as shares_rejeitados,
        em.shares_stale as shares_stale,
        em.timestamp_medicao as timestamp_medicao
    from eficiencia_maquina em
    join maquina as m
        on em.id_maquina = m.id
    join sessao as s
        on m.id_sessao = s.id
    join farm as f
        on f.id = s.id_farm
    where em.timestamp_medicao >= ${intervalExpr}
    and f.id = ?
    order by em.timestamp_medicao asc;
    `;

    console.log("Executando SQL Eficiencia: \n" + instrucaoSql, id_farm);
    return database.executar(instrucaoSql, [id_farm]);
}

function getMedicaoRede(id_farm, period) {
    var intervalExpr = buildIntervalExpr(period);
    var instrucaoSql = `
    select *
    from medicao_rede
    where id_farm = ?
    and timestamp_medicao >= ${intervalExpr}
    order by timestamp_medicao asc;
    `;

    console.log("Executando SQL Medicao Rede: \n" + instrucaoSql, id_farm);
    return database.executar(instrucaoSql, [id_farm]);
}

module.exports = {
    getKPIs,
    getEficiencia,
    getMedicaoRede
};
