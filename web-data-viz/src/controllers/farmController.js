var farmModel = require("../models/farmModel");

function list(req, res) {
    var id_empresa = req.params.id_empresa;

    if (id_empresa == undefined) {
        res.status(400).send("O id_empresa está undefined!");
    } else {
        farmModel.listByCompany(id_empresa)
            .then(function (result) {
                res.json(result);
            }).catch(function (error) {
                res.status(500).json(error.sqlMessage);
            });
    }
}

function find(req, res) {
    var id = req.params.id;

    if (id == undefined) {
        res.status(400).send("O id da farm está undefined!");
    } else {
        farmModel.findById(id)
            .then(function (result) {
                if (result.length == 0) {
                    res.status(404).send("Farm não encontrada!");
                } else {
                    res.json(result[0]);
                }
            }).catch(function (error) {
                res.status(500).json(error.sqlMessage);
            });
    }
}

function create(req, res) {
    var nome = req.body.nome;
    var id_empresa = req.body.id_empresa;
    var cep = req.body.cep;
    var logradouro = req.body.logradouro;
    var bairro = req.body.bairro;
    var cidade = req.body.cidade;
    var id_uf = req.body.id_uf;
    var numero = req.body.numero;
    var complemento = req.body.complemento;

    if (nome == undefined) {
        res.status(400).send("O nome está undefined!");
    } else if (id_empresa == undefined) {
        res.status(400).send("O id_empresa está undefined!");
    } else if (cep == undefined) {
        res.status(400).send("O cep está undefined!");
    } else if (logradouro == undefined) {
        res.status(400).send("O logradouro está undefined!");
    } else if (bairro == undefined) {
        res.status(400).send("O bairro está undefined!");
    } else if (cidade == undefined) {
        res.status(400).send("A cidade está undefined!");
    } else if (id_uf == undefined) {
        res.status(400).send("O id_uf está undefined!");
    } else if (numero == undefined) {
        res.status(400).send("O numero está undefined!");
    } else {
        farmModel.create(nome, id_empresa, cep, logradouro, bairro, cidade, id_uf, numero, complemento)
            .then(function (result) {
                res.status(201).json(result);
            }).catch(function (error) {
                res.status(500).json(error.sqlMessage);
            });
    }
}

function update(req, res) {
    var id = req.params.id;
    var nome = req.body.nome;
    var cep = req.body.cep;
    var logradouro = req.body.logradouro;
    var bairro = req.body.bairro;
    var cidade = req.body.cidade;
    var id_uf = req.body.id_uf;
    var numero = req.body.numero;
    var complemento = req.body.complemento;

    if (id == undefined) {
        res.status(400).send("O id da farm está undefined!");
    } else if (nome == undefined) {
        res.status(400).send("O nome está undefined!");
    } else if (cep == undefined) {
        res.status(400).send("O cep está undefined!");
    } else if (logradouro == undefined) {
        res.status(400).send("O logradouro está undefined!");
    } else if (bairro == undefined) {
        res.status(400).send("O bairro está undefined!");
    } else if (cidade == undefined) {
        res.status(400).send("A cidade está undefined!");
    } else if (id_uf == undefined) {
        res.status(400).send("O id_uf está undefined!");
    } else if (numero == undefined) {
        res.status(400).send("O numero está undefined!");
    } else {
        farmModel.findById(id)
            .then(function (farms) {
                if (farms.length == 0) {
                    res.status(404).send("Farm não encontrada!");
                    return;
                }
                return farmModel.update(id, nome, cep, logradouro, bairro, cidade, id_uf, numero, complemento)
                    .then(function () {
                        res.json({ id: Number(id), mensagem: "Farm atualizada com sucesso!" });
                    });
            }).catch(function (error) {
                res.status(500).json(error.sqlMessage);
            });
    }
}

function remove(req, res) {
    var id = req.params.id;

    if (id == undefined) {
        res.status(400).send("O id da farm está undefined!");
    } else {
        farmModel.findById(id)
            .then(function (farms) {
                if (farms.length == 0) {
                    res.status(404).send("Farm não encontrada!");
                    return;
                }
                var id_endereco = farms[0].id_endereco;


                return farmModel.countSessions(id).then(function (count) {
                    if (count[0].total > 0) {
                        res.status(409).send("Não é possível excluir: a farm ainda possui sessões. Exclua as sessões primeiro.");
                        return;
                    }
                    return farmModel.remove(id, id_endereco).then(function () {
                        res.json({ mensagem: "Farm excluída com sucesso!" });
                    });
                });
            }).catch(function (error) {
                res.status(500).json(error.sqlMessage);
            });
    }
}

module.exports = {
    list,
    find,
    create,
    update,
    remove
};