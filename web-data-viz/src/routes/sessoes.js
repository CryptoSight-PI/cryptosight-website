var express = require("express");
var router = express.Router();

var dispositivosController = require("../controllers/dispositivosController.js");

router.post("/cadastrar/:idfarm", function (req, res) {
    dispositivosController.cadastrar(req, res);
});


router.get("/listar/:idfarm", function (req, res) {
    dispositivosController.listar(req, res);
});

router.delete("/excluir/:idsessao", function (req, res) {
    dispositivosController.excluir(req, res);
});

router.put("/atualizar/:idsessao" , function(req , res) {
    dispositivosController.atualizar(req , res);
})

module.exports = router;