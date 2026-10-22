var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

router.post("/autenticar", usuarioController.autenticar);
router.post("/cadastrarSuperAdmin", usuarioController.cadastrarSuperAdmin);
router.post("/cadastrarPendente", usuarioController.cadastrarPendente);
router.post("/finalizarCadastro", usuarioController.finalizarCadastro);

router.get("/listar/:idSolicitante", usuarioController.listar);
router.get("/buscarPorCpf/:cpf", usuarioController.buscarPorCpf);

router.put("/:id", usuarioController.editar);
router.delete("/:id", usuarioController.excluir);

module.exports = router;