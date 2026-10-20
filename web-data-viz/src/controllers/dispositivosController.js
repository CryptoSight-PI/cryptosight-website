var dispositivosModel = require("../models/dispositivosModel.js");


function cadastrar(req, res) {
  var sessaoId = req.params.idsessao;
  var mac_address = req.body.mac_address;
  var modelo = req.body.modelo;
  var fabricante = req.body.fabricante;
  var tipo = req.body.tipo;

  if (sessaoId == undefined) {
    res.status(400).send("sessaoId está undefined!");
  } else if (mac_address == undefined) {
    res.status(400).send("mac_address está undefined!");
  } else if (modelo == undefined) {
    res.status(400).send("modelo está undefined!");
  } else if (fabricante == undefined) {
    res.status(400).send("fabricante está undefined!");
  } else if (tipo == undefined) {
    res.status(400).send("tipo está undefined!");
  } else {

    
    dispositivosModel.cadastrar(sessaoId, mac_address, modelo, fabricante, tipo).then((resultado) => {
        res.status(201).json(resultado);
    })
    .catch((erro) => {
        console.log(erro);
        console.log(
          "\nHouve um erro ao realizar o cadastro! Erro: ",
          erro.sqlMessage
        );
        res.status(500).json(erro.sqlMessage);
      });
  }
}

module.exports = {
    cadastrar
};