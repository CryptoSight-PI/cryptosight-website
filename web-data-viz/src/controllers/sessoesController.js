var dispositivosModel = require("../models/dispositivosModel.js");


function cadastrar(req, res) {
  var idfarm = req.params.idfarm;
  var nomesessao = req.body.nomesessao
  var descsessao = req.body.descsessao
  

  if (idfarm == undefined) {
    res.status(400).send("idfarm está undefined!");
  } else if (nomesessao == undefined) {
    res.status(400).send("nomesessao está undefined!");
  } else if (descsessao == undefined) {
    res.status(400).send("desc esta undefined")
  }else {

    
    dispositivosModel.cadastrar(idfarm, nomesessao, descsessao).then((resultado) => {
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
    var idfarm = req.params.idfarm;

    if (idfarm == undefined) {
        res.status(400).send("idfarm está undefined!");
    } else {
        dispositivosModel.listar(idfarm)
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
    var idsessao = req.params.idsessao;
    if (idsessao == undefined) {
        res.status(400).send("iddispositivo undefined");
    } else {
        dispositivosModel.excluir(idsessao)
            .then((resultado) => {
                res.status(200).json(resultado);
            }).catch((erro) => {
                console.log("erro")
                res.status(500).json(erro.sqlMessage);
            })
    }

}

function atualizar(req , res){
    var idsessaoeditado = req.params.idsessaoeditado;
    var nomesessaoeditado = req.body.nomesessaoeditado;
    var descsessaoeditado = req.body.descsessaoeditado;
    

    if (idsessaoeditado == undefined) {
        res.status(400).send("idsessaoeditado está undefined!");
    } else if (nomesessaoeditado == undefined) {
        res.status(400).send("nomesessaoeditado está undefined!");
    } else if (descsessaoeditado == undefined) {
        res.status(400).send("descsessaoeditado esta undefined")
    }else {



        dispositivosModel.atualizar(idsessaoeditado , nomesessaoeditado , descsessaoeditado).then((resultado) => {
            res.status(201).json(resultado);
        }).catch((erro) => {
            res.status(400).send(erro.sqlMessage)
        })

    }
}

module.exports = {
    cadastrar ,
    listar ,
    excluir ,
    atualizar
}