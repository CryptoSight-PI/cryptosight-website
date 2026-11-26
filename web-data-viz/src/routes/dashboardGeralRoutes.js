var express = require("express");
var router = express.Router();

var controller = require("../controllers/dashboardGeralController");

// KPIs de alertas : reincidentes, dia/horario, resolvidos -YasminEloitaNascimento
router.get("/kpis/:idEmpresa", controller.kpis);

// grafico Alertas por Farm  -YasminEloitaNascimento
router.get("/alertas-por-farm/:idEmpresa", controller.alertasPorFarm);

// alertas de uma farm para o modal  -YasminEloitaNascimento
router.get("/alertas/:idEmpresa/:idFarm", controller.alertasDaFarm);

// KPI de uptime -YasminEloitaNascimento
router.get("/uptime/:idEmpresa", controller.uptime);

// mapa de saude -YasminEloitaNascimento
router.get("/mapa-saude/:idEmpresa", controller.mapaSaude);

router.get("/config", (req, res) => res.json({ urlGold: process.env.URL_GOLD_env }));

module.exports = router;