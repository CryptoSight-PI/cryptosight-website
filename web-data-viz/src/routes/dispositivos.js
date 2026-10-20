var express = require("express");
var router = express.Router();

var dispositivosController = require("../controllers/dispositivosController.js");

router.post("/cadastrar/:idsessao", function (req, res) {
    dispositivosController.cadastrar(req, res);
})

module.exports = router;