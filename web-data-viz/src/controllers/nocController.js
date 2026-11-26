var nocModel = require("../models/nocModel");

function kpis(req, res) {
    var id_farm = req.params.id_farm;
    var period = req.query.period || '30d';

    if (id_farm == undefined) {
        res.status(400).send("O id_farm está undefined!");
        return;
    }

    if (!['24h','7d','30d'].includes(period)) {
        res.status(400).send("Período inválido. Use 24h, 7d ou 30d");
        return;
    }

    nocModel.getKPIs(id_farm, period)
        .then(function (result) {
            if (result.length == 0) {
                res.json({});
            } else {
                res.json(result[0]);
            }
        }).catch(function (error) {
            res.status(500).json(error.sqlMessage);
        });
}

function eficiencia(req, res) {
    var id_farm = req.params.id_farm;
    var period = req.query.period || '30d';

    if (id_farm == undefined) {
        res.status(400).send("O id_farm está undefined!");
        return;
    }

    if (!['24h','7d','30d'].includes(period)) {
        res.status(400).send("Período inválido. Use 24h, 7d ou 30d");
        return;
    }

    nocModel.getEficiencia(id_farm, period)
        .then(function (result) {
            res.json(result);
        }).catch(function (error) {
            res.status(500).json(error.sqlMessage);
        });
}

function medicaoRede(req, res) {
    var id_farm = req.params.id_farm;
    var period = req.query.period || '30d';

    if (id_farm == undefined) {
        res.status(400).send("O id_farm está undefined!");
        return;
    }

    if (!['24h','7d','30d'].includes(period)) {
        res.status(400).send("Período inválido. Use 24h, 7d ou 30d");
        return;
    }

    nocModel.getMedicaoRede(id_farm, period)
        .then(function (result) {
            res.json(result);
        }).catch(function (error) {
            res.status(500).json(error.sqlMessage);
        });
}

module.exports = {
    kpis,
    eficiencia,
    medicaoRede
};
