var database = require("../database/config");

function buscarPorId(id) {
  var instrucaoSql = `SELECT * FROM empresa WHERE id = '${id}'`;

  return database.executar(instrucaoSql);
}

function buscarPorCnpj(cnpj) {
  var instrucaoSql = `SELECT * FROM empresa WHERE cnpj = '${cnpj}'`;

  return database.executar(instrucaoSql);
}

function buscarPorEmail(email) {
  var instrucaoSql = `SELECT * FROM empresa WHERE email = '${email}'`;

  return database.executar(instrucaoSql);
}

function cadastrar(razaoSocial, telefone, email, nomeFantasia, cnpj, senha, idEndereco) {
  var instrucaoSql = `INSERT INTO empresa (razao_social, telefone, email, nome_fantasia, cnpj, senha, id_endereco) VALUES ('${razaoSocial}', '${telefone}', '${email}', '${nomeFantasia}','${cnpj}', '${senha}', '${idEndereco}')`;

  return database.executar(instrucaoSql);
}

function cadastrarEndereco(cep, uf, cidade, bairro, logradouro, numero, complemento, sede) {
  var inserirEndereco = `insert into endereco (cep, id_uf, cidade, bairro, logradouro, numero, complemento, sede) values ('${cep}', ${uf}, '${cidade}', '${bairro}', '${logradouro}', '${numero}', '${complemento}', ${sede})`;
  return database.executar(inserirEndereco);
}

function autenticarEmpresa(cnpj, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", cnpj, senha)
    var instrucaoSql = `
        SELECT id, cnpj FROM empresa WHERE cnpj = '${cnpj}' AND senha = '${senha}';   
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function salvarjira(idempresa , url_jira , token_jira){
    var instrucaoSql = `update empresa set url_jira = '${url_jira}' , token_jira = '${token_jira}' where id = ${idempresa} ;`;
    return database.executar(instrucaoSql);
}

module.exports = { buscarPorEmail, buscarPorCnpj, buscarPorId, cadastrar, cadastrarEndereco, autenticarEmpresa , salvarjira };