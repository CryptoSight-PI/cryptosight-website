var database = require("../database/config");

function autenticar(email, senha) {
    var sql = `select id, nome, email, cargo, id_empresa as idEmpresa
               from usuario where email = ? and senha = ?;`;
    return database.executar(sql, [email, senha]);
}

function buscarPorId(id) {
    var sql = `select id, cargo, id_empresa as idEmpresa from usuario where id = ?;`;
    return database.executar(sql, [id]);
}

function contarSuperAdmin(idEmpresa) {
    var sql = `select count(*) as total from usuario where id_empresa = ? and cargo = 'SuperAdmin';`;
    return database.executar(sql, [idEmpresa]);
}

function cadastrarSuperAdmin(nome, cpf, email, senha, idEmpresa) {
    var sql = `insert into usuario (nome, cargo, cpf, email, senha, id_empresa)
               values (?, 'SuperAdmin', ?, ?, ?, ?);`;
    return database.executar(sql, [nome, cpf, email, senha, idEmpresa]);
}


function cadastrarPendente(nome, cargo, cpf, email, idEmpresa) {
    var sql = `insert into usuario (nome, cargo, cpf, email, id_empresa)
               values (?, ?, ?, ?, ?);`;
    return database.executar(sql, [nome, cargo, cpf, email, idEmpresa]);
}


function finalizarCadastro(cpf, senha) {
    var sql = `update usuario set senha = ?
               where cpf = ? and senha is null;`;
    return database.executar(sql, [senha, cpf]);
}

function buscarPendentePorCpf(cpf) {
    var sql = `select nome, cargo, email from usuario where cpf = ? and senha is null;`;
    return database.executar(sql, [cpf]);
}

function listar(idEmpresa) {
    var sql = `select id, nome, cargo, cpf, email,
                      date_format(criacao, '%d/%m/%Y %H:%i') as criacao
               from usuario
               where id_empresa = ?
               order by nome;`;
    return database.executar(sql, [idEmpresa]);
}

function editar(id, nome, cargo, cpf, email) {
    var sql = `update usuario set nome = ?, cargo = ?, cpf = ?, email = ? where id = ?;`;
    return database.executar(sql, [nome, cargo, cpf, email, id]);
}


function excluirVinculos(id) {
    return database.executar(`delete from usuario_farm where id_usuario = ?;`, [id]);
}

function excluir(id) {
    return database.executar(`delete from usuario where id = ?;`, [id]);
}

function buscarFarmsDoUsuario(idUsuario) {
    var instrucaoSql = `
        select id_farm as id from usuario_farm where id_usuario = ${idUsuario};
    `;
    return database.executar(instrucaoSql);
}

function deletarFarmsDoUsuario(idUsuario) {
    var instrucaoSql = `
        delete from usuario_farm WHERE id_usuario = ${idUsuario};
    `;
    return database.executar(instrucaoSql);
}

function inserirFarmUsuario(idUsuario, idFarm) {
    var instrucaoSql = `
        insert into usuario_farm (id_usuario, id_farm) values (${idUsuario}, ${idFarm});
    `;
    return database.executar(instrucaoSql);
}



module.exports = {
    autenticar,
    buscarPorId,
    contarSuperAdmin,
    cadastrarSuperAdmin,
    cadastrarPendente,
    finalizarCadastro,
    buscarPendentePorCpf,
    listar,
    editar,
    excluirVinculos,
    excluir,
    buscarFarmsDoUsuario,
    deletarFarmsDoUsuario,
    inserirFarmUsuario
};