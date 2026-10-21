var express = require("express");
var router = express.Router();

var sessoesController = require("../controllers/sessoesController.js");

router.post("/cadastrar/:idfarm", function (req, res) {
    sessoesController.cadastrar(req, res);
});


router.get("/listar/:idfarm", function (req, res) {
    sessoesController.listar(req, res);
});

router.delete("/excluir/:idsessao", function (req, res) {
    sessoesController.excluir(req, res);
});

router.put("/atualizar/:idsessao" , function(req , res) {
    sessoesController.atualizar(req , res);
})

module.exports = router;