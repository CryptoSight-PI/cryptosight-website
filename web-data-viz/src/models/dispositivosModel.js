var database = require("../database/config");


function cadastrar(sessaoId, mac_address, modelo , fabricante, tipo, valor, categoria, id_usuario) {
  var instrucaoSql = `INSERT INTO maquina (id_sessao, mac_address , modelo, fabricante, tipo)  
  VALUES ('${sessaoId}', '${mac_address}', '${modelo}' , '${fabricante}' , '${tipo}')`;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql).then((resultadoCadastro) => {
    if (Number(valor) <= 0) {
      return resultadoCadastro;
    }

    var instrucaoFarmSql = `SELECT id_farm FROM sessao WHERE id = ${sessaoId};`;

    return database.executar(instrucaoFarmSql).then((resultadoSessao) => {
      if (!resultadoSessao || resultadoSessao.length === 0) {
        throw new Error("Sessão não encontrada para registrar o pagamento.");
      }

      var id_farm = resultadoSessao[0].id_farm;
      var instrucaoPagamentoSql = `INSERT INTO pagamento (id_usuario, id_farm, valor, categoria)
      VALUES (${id_usuario}, ${id_farm}, ${valor}, '${categoria}')`;

      return database.executar(instrucaoPagamentoSql).then(() => {
        return resultadoCadastro;
      });
    });
  });
}


function listar(sessaoId) {
    var instrucaoSql = `select id, mac_address, modelo, fabricante, tipo, criacao from maquina where id_sessao = ${sessaoId} order by id;`;
    return database.executar(instrucaoSql);
}



function excluir(iddispositivo) {
    var instrucaoSql = `
        DELETE FROM maquina_componente
        WHERE id_maquina = ${iddispositivo};
    `;

    return database.executar(instrucaoSql)
        .then(() => {
            var instrucaoExcluirMaquina = `
                DELETE FROM maquina
                WHERE id = ${iddispositivo};
            `;

            return database.executar(instrucaoExcluirMaquina);
        });
}


function atualizar(iddispositivo , mac_addresseditado , modeloeditado , fabricanteeditado , tipoeditado, valor, categoria, id_usuario){
    var instrucaoSql = `update maquina set mac_address = '${mac_addresseditado}' , modelo = '${modeloeditado}' , fabricante = '${fabricanteeditado}' , tipo = '${tipoeditado}' where id = ${iddispositivo} ;`;
    return database.executar(instrucaoSql).then((resultadoAtualizacao) => {
        if (Number(valor) <= 0) {
            return resultadoAtualizacao;
        }

        var instrucaoFarmSql = `
            select s.id_farm
            from maquina m
            join sessao s on s.id = m.id_sessao
            where m.id = ${iddispositivo};
        `;

        return database.executar(instrucaoFarmSql).then((resultadoFarm) => {
            if (!resultadoFarm || resultadoFarm.length === 0) {
                throw new Error("Máquina não encontrada para registrar o pagamento.");
            }

            var id_farm = resultadoFarm[0].id_farm;
            var instrucaoPagamentoSql = `insert into pagamento (id_usuario, id_farm, valor, categoria)
            values (${id_usuario}, ${id_farm}, ${valor}, '${categoria}');`;

            return database.executar(instrucaoPagamentoSql).then(() => {
                return resultadoAtualizacao;
            });
        });
    });
}

function catalogocomponente() {
    var instrucaoSql = `select id, nome from componente order by nome;`;
    return database.executar(instrucaoSql);
}
function cadastrarcomponente(iddispositivocomponente, idcomponentecomponente, limmin, limmax, monitorado, valor, categoria, id_usuario) {
    var instrucaoSql = `insert into maquina_componente (id_maquina, id_componente, limite_min, limite_max, monitorado) values (${iddispositivocomponente}, ${idcomponentecomponente}, ${limmin}, ${limmax}, '${monitorado}');`;
    return database.executar(instrucaoSql).then((resultadoCadastro) => {
        if (Number(valor) <= 0) {
            return resultadoCadastro;
        }

        var instrucaoFarmSql = `
            select s.id_farm
            from maquina m
            join sessao s on s.id = m.id_sessao
            where m.id = ${iddispositivocomponente};
        `;

        return database.executar(instrucaoFarmSql).then((resultadoFarm) => {
            if (!resultadoFarm || resultadoFarm.length === 0) {
                throw new Error("Máquina não encontrada para registrar o pagamento.");
            }

            var id_farm = resultadoFarm[0].id_farm;
            var instrucaoPagamentoSql = `insert into pagamento (id_usuario, id_farm, valor, categoria)
            values (${id_usuario}, ${id_farm}, ${valor}, '${categoria}');`;

            return database.executar(instrucaoPagamentoSql).then(() => {
                return resultadoCadastro;
            });
        });
    });
}

function listarcomponente(iddispositivocomponente) {
    var instrucaoSql = `select mc.id, c.nome , mc.id_maquina, mc.id_componente, mc.limite_min, mc.limite_max, mc.monitorado , mc.criacao from maquina_componente mc join componente c on mc.id_componente = c.id where id_maquina = ${iddispositivocomponente} order by id;`;
    return database.executar(instrucaoSql);
}

function vermonitorado(idcomponente){
    var instrucaoSql = `select monitorado from maquina_componente where id = ${idcomponente};`
    return database.executar(instrucaoSql);
}

function switchmonitorado(idcomponente){
    var instrucaoSql = `update maquina_componente set monitorado = 1 where id = ${idcomponente};`
    return database.executar(instrucaoSql);
}

function switchnaomonitorado(idcomponente){
    var instrucaoSql = `update maquina_componente set monitorado = 0 where id = ${idcomponente};`
    return database.executar(instrucaoSql);
}

function excluircomponente(idcomponenteexcluido){
    var instrucaoSql = `delete from maquina_componente where id = ${idcomponenteexcluido};`
    return database.executar(instrucaoSql);
}

function editarcomponente(idcomponenteeditado , limmineditado , limmaxeditado , monitoradoeditado, valor, categoria, id_usuario){
    var instrucaoSql = `update maquina_componente set limite_min = ${limmineditado} , limite_max = ${limmaxeditado} , monitorado = ${monitoradoeditado} where id = ${idcomponenteeditado};`
    return database.executar(instrucaoSql).then((resultadoEdicao) => {
        if (Number(valor) <= 0) {
            return resultadoEdicao;
        }

        var instrucaoFarmSql = `
            select s.id_farm
            from maquina_componente mc
            join maquina m on m.id = mc.id_maquina
            join sessao s on s.id = m.id_sessao
            where mc.id = ${idcomponenteeditado};
        `;

        return database.executar(instrucaoFarmSql).then((resultadoFarm) => {
            if (!resultadoFarm || resultadoFarm.length === 0) {
                throw new Error("Componente não encontrado para registrar o pagamento.");
            }

            var id_farm = resultadoFarm[0].id_farm;
            var instrucaoPagamentoSql = `insert into pagamento (id_usuario, id_farm, valor, categoria)
            values (${id_usuario}, ${id_farm}, ${valor}, '${categoria}');`;

            return database.executar(instrucaoPagamentoSql).then(() => {
                return resultadoEdicao;
            });
        });
    });
}

function catalogocripto() {
    var instrucaoSql = `select id, nome , simbolo from criptomoeda order by nome;`;
    return database.executar(instrucaoSql);
}

function listarcripto(iddispositivo) {
    var instrucaoSql = `select mc.id, c.nome, c.simbolo from maquina_criptomoeda mc join criptomoeda c on c.id = mc.id_criptomoeda where mc.id_maquina = ${iddispositivo};`;
    return database.executar(instrucaoSql);
}

function adicionarcripto(iddispositivo, idcripto) {
    var instrucaoSql = `insert into maquina_criptomoeda (id_maquina, id_criptomoeda) values (${iddispositivo}, ${idcripto});`;
    return database.executar(instrucaoSql);
}

function removercripto(idligacao) {
    var instrucaoSql = `delete from maquina_criptomoeda where id = ${idligacao};`;
    return database.executar(instrucaoSql);
}

function listarcomponenteprincipal(iddispositivo){
    var instrucaoSql = `select count(a.id) as contador , sum(count(a.id)) over () as total , c.nome, round(100 * count(a.id) / sum(count(a.id)) over (), 1) as percentual, sum(a.severidade = 'Crítica') as criticos , sum(a.severidade = 'Aviso') as atencoes from maquina_componente mc join alerta a on a.id_mc = mc.id join componente c on mc.id_componente = c.id where mc.id_maquina = ${iddispositivo} and a.data_hora_detectado >= NOW() - interval 30 day   group by c.nome order by contador desc limit 1;`;
    return database.executar(instrucaoSql);
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
    excluircomponente,
    editarcomponente,
    catalogocripto,
    listarcripto,
    adicionarcripto,
    removercripto,
    listarcomponenteprincipal
};
