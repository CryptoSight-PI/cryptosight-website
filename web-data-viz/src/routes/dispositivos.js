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

module.exports = router;