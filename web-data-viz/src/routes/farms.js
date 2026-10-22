var express = require("express");
var router = express.Router();

var farmController = require("../controllers/farmController");

router.post("/create", function (req, res) {
    farmController.create(req, res);
});

router.get("/list/:id_empresa", function (req, res) {
    farmController.list(req, res);
});

router.get("/find/:id", function (req, res) {
    farmController.find(req, res);
});

router.put("/update/:id", function (req, res) {
    farmController.update(req, res);
});

router.delete("/delete/:id", function (req, res) {
    farmController.remove(req, res);
});

module.exports = router;