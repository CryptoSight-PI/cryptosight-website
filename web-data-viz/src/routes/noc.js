var express = require("express");
var router = express.Router();

var nocController = require("../controllers/nocController");

// KPIs agregados (últimos 30 dias)
router.get("/kpis/:id_farm", function (req, res) {
    nocController.kpis(req, res);
});

// série de eficiência por máquina (últimos 30 dias)
router.get("/eficiencia/:id_farm", function (req, res) {
    nocController.eficiencia(req, res);
});

// medições de rede da farm (últimos 30 dias)
router.get("/medicao_rede/:id_farm", function (req, res) {
    nocController.medicaoRede(req, res);
});

module.exports = router;
