var express = require("express");
var router = express.Router();

var dispositivosController = require("../controllers/dispositivosController.js");

router.post("/cadastrar/:idsessao", function (req, res) {
    dispositivosController.cadastrar(req, res);
});


router.get("/listar/:idsessao", function (req, res) {
    dispositivosController.listar(req, res);
});

router.delete("/excluir/:iddispositivo", function (req, res) {
    dispositivosController.excluir(req, res);
});

router.put("/atualizar/:iddispositivo" , function(req , res) {
    dispositivosController.atualizar(req , res);
})

router.get("/catalogocomponente", function (req, res) {
    dispositivosController.catalogocomponente(req, res);
});

router.post("/cadastrarcomponente/:iddispositivocomponente" , function(req , res) {
    dispositivosController.cadastrarcomponente(req , res);
})

router.get("/listarcomponente/:iddispositivocomponente", function (req, res) {
    dispositivosController.listarcomponente(req, res);
});

router.get("/vermonitorado/:idcomponente", function (req, res) {
    dispositivosController.vermonitorado(req, res);
});

router.put("/switchmonitorado/:idcomponente" , function(req , res) {
    dispositivosController.switchmonitorado(req , res);
});

router.put("/switchnaomonitorado/:idcomponente" , function(req , res) {
    dispositivosController.switchnaomonitorado(req , res);
});

router.delete("/excluircomponente/:idcomponenteexcluido", function (req, res) {
    dispositivosController.excluircomponente(req, res);
});

module.exports = router;