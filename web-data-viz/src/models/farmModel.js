var database = require("../database/config");
var mysql = require("mysql2");

var SELECT_FARM = `
    SELECT f.id, f.nome, f.id_empresa, f.criacao, f.atualizacao,
           e.id AS id_endereco, e.cep, e.numero, e.complemento,
           e.logradouro, e.bairro, e.cidade, e.id_uf, u.sigla
    FROM farm f
    LEFT JOIN endereco e ON e.id = f.id_endereco
    LEFT JOIN uf u ON u.id = e.id_uf
`;

// function ensureCep(cep, logradouro, bairro, cidade, id_uf) {
//     var sql = mysql.format(`
//         INSERT INTO cep (cep, logradouro, bairro, cidade, id_uf)
//         VALUES (?, ?, ?, ?, ?)
//         ON DUPLICATE KEY UPDATE cep = cep;
//     `, [cep, logradouro, bairro, cidade, id_uf]);
//     return database.executar(sql);
// }

function listByCompany(id_empresa) {
    var sql = mysql.format(SELECT_FARM + ` WHERE f.id_empresa = ?;`, [id_empresa]);
    return database.executar(sql);
}

function findById(id) {
    var sql = mysql.format(SELECT_FARM + ` WHERE f.id = ?;`, [id]);
    return database.executar(sql);
}

function create(nome, id_empresa, cep, logradouro, bairro, cidade, id_uf, numero, complemento) {
    // return ensureCep(cep, logradouro, bairro, cidade, id_uf).then(function () {
        var addressSql = mysql.format(`
        INSERT INTO endereco (cep, logradouro, bairro, cidade, id_uf, numero, complemento, sede) 
        VALUES (?, ?, ?, ?, ?, ?, ?, 0);
    `, [cep, logradouro, bairro, cidade, id_uf, numero, complemento]);

    return database.executar(addressSql).then(function (addressResult) {
        var id_endereco = addressResult.insertId;
        var farmSql = mysql.format(`
            INSERT INTO farm (nome, id_empresa, id_endereco) VALUES (?, ?, ?);
        `, [nome, id_empresa, id_endereco]);

        return database.executar(farmSql)
            .then(function (farmResult) {
                return { id: farmResult.insertId, id_endereco: id_endereco };
            })
            .catch(function (error) {
                var undoSql = mysql.format(`DELETE FROM endereco WHERE id = ?;`, [id_endereco]);
                return database.executar(undoSql).then(function () {
                    throw error;
                });
            });
    });
}

function update(id, nome, cep, logradouro, bairro, cidade, id_uf, numero, complemento) {
    // return ensureCep(cep, logradouro, bairro, cidade, id_uf).then(function () {
    var findFarmSql = mysql.format(`SELECT id_endereco FROM farm WHERE id = ?;`, [id]);
        return database.executar(findFarmSql).then(function (result) {
        if (result.length === 0) {
            throw new Error("Farm não encontrada para atualização.");
        }
        var id_endereco = result[0].id_endereco;

        var sql = mysql.format(`
            UPDATE endereco e
            JOIN farm f ON e.id = f.id_endereco
            SET f.nome = ?, e.cep = ?, e.logradouro = ?, e.bairro = ?, e.cidade = ?, e.id_uf = ?, e.numero = ?, e.complemento = ?
            WHERE f.id = ?;
        `, [nome, cep, logradouro, bairro, cidade, id_uf, numero, complemento, id]);
        
        return database.executar(sql);
    });
}

function countSessions(id_farm) {
    var sql = mysql.format(`SELECT COUNT(*) AS total FROM sessao WHERE id_farm = ?;`, [id_farm]);
    return database.executar(sql);
}

function remove(id, id_endereco) {
    var cryptoMachinesSql = mysql.format(`DELETE mc FROM maquina_criptomoeda mc JOIN maquina m ON mc.id_maquina = m.id JOIN sessao s ON m.id_sessao = s.id WHERE s.id_farm = ?;`, [id]);
    var machinesSql = mysql.format(`DELETE m FROM maquina m JOIN sessao s ON m.id_sessao = s.id WHERE s.id_farm = ?;`, [id]);
    var sessionsSql = mysql.format(`DELETE FROM sessao WHERE id_farm = ?;`, [id]);
    var linksSql = mysql.format(`DELETE FROM usuario_farm WHERE id_farm = ?;`, [id]);
    var farmSql = mysql.format(`DELETE FROM farm WHERE id = ?;`, [id]);
    var addressSql = mysql.format(`DELETE FROM endereco WHERE id = ?;`, [id_endereco]);

    return database.executar(cryptoMachinesSql)
        .then(function () { return database.executar(machinesSql); })
        .then(function () { return database.executar(sessionsSql); })
        .then(function () { return database.executar(linksSql); })
        .then(function () { return database.executar(farmSql); })
        .then(function () { return database.executar(addressSql); });
}

module.exports = {
    listByCompany,
    findById,
    create,
    update,
    countSessions,
    remove
};