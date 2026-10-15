var empresaModel = require("../models/empresaModel");

function buscarPorCnpj(req, res) {
  var cnpj = req.query.cnpj;
  empresaModel.buscarPorCnpj(cnpj)
    .then(function (resultado) {
      res.status(200).json(resultado);
    })
    .catch(function (erro) {
      console.log(erro);
      res.status(500).json(erro.sqlMessage);
    });
}

function buscarPorId(req, res) {
  var id = req.params.id;
  empresaModel.buscarPorId(id)
    .then(function (resultado) {
      res.status(200).json(resultado);
    })
    .catch(function (erro) {
      console.log(erro);
      res.status(500).json(erro.sqlMessage);
    });
}

function cadastrar(req, res) {
  var razaoSocial = req.body.razaoSocial;
  var telefone = req.body.telefone;
  var email = req.body.email;
  var nomeFantasia = req.body.nomeFantasia;
  var cnpj = req.body.cnpj;
  var senha = req.body.senha;

  var cep = req.body.cep;
  var uf = req.body.uf;
  var cidade = req.body.cidade;
  var bairro = req.body.bairro;
  var logradouro = req.body.logradouro;
  var numero = req.body.numero;
  var complemento = req.body.complemento;
  var sede = req.body.sede;

  empresaModel.buscarPorCnpj(cnpj)
    .then(function (resultadoCNPJ) {
      if (resultadoCNPJ.length > 0) {
        res.status(409).json({ mensagem: `A empresa com o CNPJ ${cnpj} já existe` });
      } else {
        empresaModel.buscarPorEmail(email)
          .then(function (resultadoEmail) {
            if (resultadoEmail.length > 0) {
              res.status(409).json({ mensagem: `A empresa com o email ${email} já existe` });
            } else {
              empresaModel.cadastrarEndereco(cep, uf, cidade, bairro, logradouro, numero, complemento, sede)
                .then(function (resultadoEndereco) {
                  var idEndereco = resultadoEndereco.insertId;
                  empresaModel.cadastrar(razaoSocial, telefone, email, nomeFantasia, cnpj, senha, idEndereco)
                    .then(function (resultadoEmpresa) {
                      res.status(201).json(resultadoEmpresa);
                    })
                    .catch(function (erro) {
                      console.log(erro);
                      res.status(500).json(erro.sqlMessage);
                    });
                })
                .catch(function (erro) {
                  console.log(erro);
                  res.status(500).json(erro.sqlMessage);
                });
            }
          })
          .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
          });
      }
    })
    .catch(function (erro) {
      console.log(erro);
      res.status(500).json(erro.sqlMessage);
    });
}

function autenticarEmpresa(req, res) {
    var cnpj = req.body.cnpjServer;
    var senha = req.body.senhaServer;

    if (cnpj == undefined) {
        res.status(400).send("Seu CNPJ está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        empresaModel.autenticarEmpresa(cnpj, senha)
            .then(function (resultadoAutenticar) {
                if (resultadoAutenticar.length == 1) {
                    res.json({
                        id: resultadoAutenticar[0].id,
                        cnpj: resultadoAutenticar[0].cnpj,
                        nomeFantasia: resultadoAutenticar[0].nome_fantasia,
                        senha: resultadoAutenticar[0].senha
                    });
                } else if (resultadoAutenticar.length == 0) {
                    res.status(403).send("CNPJ e/ou senha inválido(s)");
                } else {
                    res.status(403).send("Mais de um cadastro com o mesmo login e senha!");
                }
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
          }
}


module.exports = {
  buscarPorCnpj,
  buscarPorId,
  cadastrar,
  autenticarEmpresa
};