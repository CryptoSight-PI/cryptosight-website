var database = require("../database/config");
var mysql = require("mysql2");

var SELECT_FARM = `
    SELECT f.id, f.nome, f.id_empresa, f.criacao, f.atualizacao,
           e.id AS id_endereco, e.cep, e.numero, e.complemento,
           c.logradouro, c.bairro, c.cidade, c.id_uf, u.sigla
    FROM farm f
    LEFT JOIN endereco e ON e.id = f.id_endereco
    LEFT JOIN cep c ON c.cep = e.cep
    LEFT JOIN uf u ON u.id = c.id_uf
`;

function ensureCep(cep, logradouro, bairro, cidade, id_uf) {
    var sql = mysql.format(`
        INSERT INTO cep (cep, logradouro, bairro, cidade, id_uf)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE cep = cep;
    `, [cep, logradouro, bairro, cidade, id_uf]);
    return database.executar(sql);
}

function listByCompany(id_empresa) {
    var sql = mysql.format(SELECT_FARM + ` WHERE f.id_empresa = ?;`, [id_empresa]);
    return database.executar(sql);
}

function findById(id) {
    var sql = mysql.format(SELECT_FARM + ` WHERE f.id = ?;`, [id]);
    return database.executar(sql);
}

function create(nome, id_empresa, cep, logradouro, bairro, cidade, id_uf, numero, complemento) {
    return ensureCep(cep, logradouro, bairro, cidade, id_uf).then(function () {
        var addressSql = mysql.format(`
            INSERT INTO endereco (cep, numero, complemento, sede) VALUES (?, ?, ?, 0);
        `, [cep, numero, complemento]);

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
    });
}

function update(id, nome, cep, logradouro, bairro, cidade, id_uf, numero, complemento) {
    return ensureCep(cep, logradouro, bairro, cidade, id_uf).then(function () {
        var sql = mysql.format(`
            UPDATE farm f
            JOIN endereco e ON e.id = f.id_endereco
            SET f.nome = ?, e.cep = ?, e.numero = ?, e.complemento = ?
            WHERE f.id = ?;
        `, [nome, cep, numero, complemento, id]);
        return database.executar(sql);
    });
}

function countSessions(id_farm) {
    var sql = mysql.format(`SELECT COUNT(*) AS total FROM sessao WHERE id_farm = ?;`, [id_farm]);
    return database.executar(sql);
}

function remove(id, id_endereco) {
    var linksSql = mysql.format(`DELETE FROM usuario_farm WHERE id_farm = ?;`, [id]);
    var farmSql = mysql.format(`DELETE FROM farm WHERE id = ?;`, [id]);
    var addressSql = mysql.format(`DELETE FROM endereco WHERE id = ?;`, [id_endereco]);

    return database.executar(linksSql)
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