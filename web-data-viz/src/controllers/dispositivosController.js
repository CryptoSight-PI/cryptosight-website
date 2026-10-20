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



function listar(req, res) {
    var sessaoId = req.params.idsessao;

    if (sessaoId == undefined) {
        res.status(400).send("sessaoId está undefined!");
    } else {
        dispositivosModel.listar(sessaoId)
            .then((resultado) => {
                res.status(200).json(resultado);
            })
            .catch((erro) => {
                console.log(erro);
                console.log("\nHouve um erro ao listar! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}


function excluir(req , res){
    var iddispositivo = req.params.iddispositivo;
    if (iddispositivo == undefined) {
        res.status(400).send("iddispositivo undefined");
    } else {
        dispositivosModel.excluir(iddispositivo)
            .then((resultado) => {
                res.status(200).json(resultado);
            }).catch((erro) => {
                console.log("erro")
                res.status(500).json(erro.sqlMessage);
            })
    }

}

function atualizar(req , res){
    var iddispositivo = req.params.iddispositivo;
    var mac_addresseditado = req.body.mac_address;
    var modeloeditado = req.body.modelo;
    var fabricanteeditado = req.body.fabricante;
    var tipoeditado = req.body.tipo;

    if (iddispositivo == undefined) {
        res.status(400).send("iddispositivo está undefined!");
    } else if (mac_addresseditado == undefined) {
        res.status(400).send("mac_address está undefined!");
    } else if (modeloeditado == undefined) {
        res.status(400).send("modelo está undefined!");
    } else if (fabricanteeditado == undefined) {
        res.status(400).send("fabricante está undefined!");
    } else if (tipoeditado == undefined) {
        res.status(400).send("tipo está undefined!");
    } else {
        dispositivosModel.atualizar(iddispositivo , mac_addresseditado , modeloeditado , fabricanteeditado , tipoeditado).then((resultado) => {
            res.status(201).json(resultado);
        }).catch((erro) => {
            res.status(400).send(erro.sqlMessage)
        })

    }
}

function catalogocomponente(req, res) {
    dispositivosModel.catalogocomponente()
        .then((resultado) => {
            res.status(200).json(resultado);
        })
        .catch((erro) => {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function cadastrarcomponente(req, res) {
    var iddispositivocomponente = req.params.iddispositivocomponente;
    var idcomponentecomponente = req.body.idcomponente;
    var limmin = req.body.limmin;
    var limmax = req.body.limmax;
    var monitorado = req.body.monitorado;

    if (iddispositivocomponente == undefined) {
        res.status(400).send("iddispositivo está undefined!");
    } else if (idcomponentecomponente == undefined) {
        res.status(400).send("componente está undefined!");
    } else if (limmin == undefined) {
        res.status(400).send("limmin está undefined!");
    } else if (limmax == undefined) {
        res.status(400).send("limmax está undefined!");
    } else if (monitorado == undefined) {
        res.status(400).send("monitorado está undefined!");
    } else {
        dispositivosModel.cadastrarcomponente(iddispositivocomponente, idcomponentecomponente, limmin, limmax, monitorado)
            .then((resultado) => {
                res.status(201).json(resultado);
            })
            .catch((erro) => {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function listarcomponente(req, res) {
    var iddispositivocomponente = req.params.iddispositivocomponente;

    if (iddispositivocomponente == undefined) {
        res.status(400).send("iddispositivocomponente está undefined!");
    } else {
        dispositivosModel.listarcomponente(iddispositivocomponente)
            .then((resultado) => {
                res.status(200).json(resultado);
            })
            .catch((erro) => {
                console.log(erro);
                console.log("\nHouve um erro ao listar! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function vermonitorado(req, res){
    var idcomponente = req.params.idcomponente;
    if (idcomponente == undefined) {
        res.status(400).send("idcomponente está undefined!");
    } else {
        dispositivosModel.vermonitorado(idcomponente)
            .then((resultado) => {
                res.status(200).json(resultado);
            })
            .catch((erro) => {
                console.log(erro);
                console.log("\nHouve um erro ao listar! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function switchmonitorado(req, res){
    var idcomponente = req.params.idcomponente;
    if(idcomponente == undefined){
        res.status(400).send("idcomponente esta undefined")
    }else{
        dispositivosModel.switchmonitorado(idcomponente).then((resultado) => {
            res.status(200).json(resultado)
        }).catch((erro) => {
            console.log(erro)
        })
    }

}

function switchnaomonitorado(req, res){
    var idcomponente = req.params.idcomponente;
    if(idcomponente == undefined){
        res.status(400).send("idcomponente esta undefined")
    }else{
        dispositivosModel.switchnaomonitorado(idcomponente).then((resultado) => {
            res.status(200).json(resultado)
        }).catch((erro) => {
            console.log(erro)
        })
    }

}

function excluircomponente(req , res){
    var idcomponenteexcluido = req.params.idcomponenteexcluido;
    if(idcomponenteexcluido == undefined){
        res.status(400).send("idcomponenteexcluido undefined")
    }else {
        dispositivosModel.excluircomponente(idcomponenteexcluido).then((resultado) => {
            res.status(200).json(resultado)
        }).catch((erro) => {
            console.log(erro)
        })
    }

}

module.exports = {
    cadastrar,
    listar,
    excluir,
    atualizar,
    catalogocomponente,
    cadastrarcomponente,
    listarcomponente,
    vermonitorado,
    switchmonitorado,
    switchnaomonitorado,
    excluircomponente
};