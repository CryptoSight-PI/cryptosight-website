var database = require("../database/config");


function cadastrar(sessaoId, mac_address, modelo , fabricante, tipo) {
  var instrucaoSql = `INSERT INTO maquina (id_sessao, mac_address , modelo, fabricante, tipo)  
  VALUES ('${sessaoId}', '${mac_address}', '${modelo}' , '${fabricante}' , '${tipo}')`;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}


function listar(sessaoId) {
    var instrucaoSql = `select id, mac_address, modelo, fabricante, tipo, criacao from maquina where id_sessao = ${sessaoId} order by id;`;
    return database.executar(instrucaoSql);
}



function excluir(iddispositivo) {
    var instrucaoSql = `
        DELETE FROM maquina_componente
        WHERE id_maquina = ${iddispositivo};
    `;

    return database.executar(instrucaoSql)
        .then(() => {
            var instrucaoExcluirMaquina = `
                DELETE FROM maquina
                WHERE id = ${iddispositivo};
            `;

            return database.executar(instrucaoExcluirMaquina);
        });
}


function atualizar(iddispositivo , mac_addresseditado , modeloeditado , fabricanteeditado , tipoeditado){
    var instrucaoSql = `update maquina set mac_address = '${mac_addresseditado}' , modelo = '${modeloeditado}' , fabricante = '${fabricanteeditado}' , tipo = '${tipoeditado}' where id = ${iddispositivo} ;`;
    return database.executar(instrucaoSql);
}

function catalogocomponente() {
    var instrucaoSql = `select id, nome from componente order by nome;`;
    return database.executar(instrucaoSql);
}
function cadastrarcomponente(iddispositivocomponente, idcomponentecomponente, limmin, limmax, monitorado) {
    var instrucaoSql = `insert into maquina_componente (id_maquina, id_componente, limite_min, limite_max, monitorado) values (${iddispositivocomponente}, ${idcomponentecomponente}, ${limmin}, ${limmax}, '${monitorado}');`;
    return database.executar(instrucaoSql);
}

function listarcomponente(iddispositivocomponente) {
    var instrucaoSql = `select mc.id, c.nome , mc.id_maquina, mc.id_componente, mc.limite_min, mc.limite_max, mc.monitorado , mc.criacao from maquina_componente mc join componente c on mc.id_componente = c.id where id_maquina = ${iddispositivocomponente} order by id;`;
    return database.executar(instrucaoSql);
}

function vermonitorado(idcomponente){
    var instrucaoSql = `select monitorado from maquina_componente where id = ${idcomponente};`
    return database.executar(instrucaoSql);
}

function switchmonitorado(idcomponente){
    var instrucaoSql = `update maquina_componente set monitorado = 1 where id = ${idcomponente}`
    return database.executar(instrucaoSql);
}

function switchnaomonitorado(idcomponente){
    var instrucaoSql = `update maquina_componente set monitorado = 0 where id = ${idcomponente}`
    return database.executar(instrucaoSql);
}

function excluircomponente(idcomponenteexcluido){
    var instrucaoSql = `delete from maquina_componente where id = ${idcomponenteexcluido}`
    return database.executar(instrucaoSql);
}


module.exports = {  
    cadastrar,
    listar,
    excluir,
    atualizar,
    catalogocomponente,
    cadastrarcomponente,
    listarcomponente,
    vermonitorado,
    switchmonitorado,
    switchnaomonitorado,
    excluircomponente
};