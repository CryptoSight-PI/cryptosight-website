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
    var instrucaoSql = `delete from maquina where id = ${iddispositivo};`;
    return database.executar(instrucaoSql);
}


module.exports = {  
    cadastrar,
    listar,
    excluir
};