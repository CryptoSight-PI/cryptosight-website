var database = require("../database/config");


function cadastrar(sessaoId, mac_address, modelo , fabricante, tipo) {
  var instrucaoSql = `INSERT INTO maquina (id_sessao, mac_address , modelo, fabricante, tipo)  
  VALUES ('${sessaoId}', '${mac_address}', '${modelo}' , '${fabricante}' , '${tipo}')`;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

module.exports = {
    cadastrar
};