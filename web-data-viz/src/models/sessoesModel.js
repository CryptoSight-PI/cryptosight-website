var database = require("../database/config");


function cadastrar(idfarm, nomesessao, descsessao) {
  var instrucaoSql = `insert into sessao (id_farm, nome , descricao)  
  values ('${idfarm}', '${nomesessao}', '${descsessao}';)`;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}


function listar(idfarm) {
    var instrucaoSql = `select id, nome, descricao, id_farm, criacao from sessao where id_farm = ${idfarm} order by id;`;
    return database.executar(instrucaoSql);
}



function excluir(idsessao) {
   var instrucaoSql = `delete from sessao where id = ${idsessao};`
   return database.executar(instrucaoSql);
}


function atualizar(idsessaoeditado , nomesessaoeditado , descsessaoeditado){
    var instrucaoSql = `update sessao set nome = '${nomesessaoeditado}' , descricao = '${descsessaoeditado}' where id = ${idsessaoeditado} ;`;
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrar , 
    listar , 
    atualizar , 
    excluir
}