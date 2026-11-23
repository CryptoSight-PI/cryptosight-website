var model = require("../models/dashboardGeralModel");

const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

// ordem do mapa de saude (mais grave primeiro) -YasminEloitaNascimento
const ORDEM_STATUS = { critico: 0, atencao: 1, offline: 2, normal: 3, sem_dados: 3 };

// pega o nome da empresa -> pasta do S3 -YasminEloitaNascimento
async function pegarEmpresa(idEmpresa) {
    let resultado = await model.buscarEmpresa(idEmpresa);
    if (resultado.length == 0) throw new Error("Empresa nao encontrada");
    return resultado[0];
}



async function kpis(req, res) {
    try {
        let idEmpresa = req.params.idEmpresa;

        let reincidentes = await model.kpiReincidentes(idEmpresa);
        let diaHorario = await model.kpiDiaHorario(idEmpresa);
        let resolvidos = await model.kpiResolvidos(idEmpresa);

        let farm = reincidentes[0] || null;
        let pico = diaHorario[0] || null;
        let total = Number(resolvidos[0].total);
        let feitos = Number(resolvidos[0].resolvidos);

        res.json({
            farm_reincidentes: farm ? { id: farm.id, nome: farm.nome, maquinas: Number(farm.maquinas) } : null,
            dia_horario: pico ? {
                dia: DIAS[pico.dia - 1], // DAYOFWEEK do mysql: 1 = domingo -YasminEloitaNascimento
                hora: String(pico.hora).padStart(2, "0") + "h",
                total: Number(pico.total)
            } : null,
            alertas_resolvidos: {
                resolvidos: feitos,
                total: total,
                percentual: total > 0 ? Math.round((feitos / total) * 100) : 0
            }
        });
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ erro: erro.message });
    }
}


async function alertasPorFarm(req, res) {
    try {
        let idEmpresa = req.params.idEmpresa;
        let janela = req.query.janela || "7d";
        let agrupar = req.query.agrupar || "farm";
        let idFarm = req.query.farm || null;

        let linhas = await model.alertasPorGrupo(idEmpresa, janela, agrupar, idFarm);

        let lista = linhas.map(l => {
            let nome = l.grupo;
            if (agrupar == "dia") nome = DIAS[l.grupo - 1];
            if (agrupar == "horario") nome = String(l.grupo).padStart(2, "0") + "h";

            let total = Number(l.total);
            let criticos = Number(l.criticos);

            return { nome: nome, ordem: l.grupo, total: total, criticos: criticos, atencoes: total - criticos };
        });

        // farm: maior primeiro | dia e horario: ordem natural -YasminEloitaNascimento
        if (agrupar == "farm") {
            lista.sort((a, b) => b.total - a.total);
        } else {
            lista.sort((a, b) => a.ordem - b.ordem);
        }

        let totalAlertas = lista.reduce((soma, b) => soma + b.total, 0);
        let totalCriticos = lista.reduce((soma, b) => soma + b.criticos, 0);

        res.json({ janela: janela, agrupar: agrupar, total_alertas: totalAlertas, total_criticos: totalCriticos, barras: lista });
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ erro: erro.message });
    }
}



async function alertasDaFarm(req, res) {
    try {
        let { idEmpresa, idFarm } = req.params;
        let janela = req.query.janela || "7d";

        let empresa = await pegarEmpresa(idEmpresa);
        let linhas = await model.alertasDaFarm(idEmpresa, idFarm, janela);

        // monta o link do Jira com a url da empresa + chave do chamado -YasminEloitaNascimento
        let base = empresa.url_jira ? empresa.url_jira.replace(/\/+$/, "") : null;

        let alertas = linhas.map(a => ({
            id: a.id,
            maquina: a.id_maquina,
            farm: a.farm,
            sessao: a.sessao,
            componente: a.componente,
            descricao: a.descricao,
            severidade: a.severidade,
            status: a.status,
            detectado_em: a.data_hora_detectado,
            chave_jira: a.chave_jira,
            link_jira: (base && a.chave_jira) ? `${base}/browse/${a.chave_jira}` : null
        }));

        let criticos = alertas.filter(a => a.severidade == "critico").length;

        res.json({ farm: linhas.length ? linhas[0].farm : null, total: alertas.length, criticos: criticos, alertas: alertas });
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ erro: erro.message });
    }
}

// UPTIME (ETL) 

async function uptime(req, res) {
    try {
        let idEmpresa = req.params.idEmpresa;
        let empresa = await pegarEmpresa(idEmpresa);
        let base = `${idEmpresa}/${empresa.nome_fantasia}/operacional`;

        let catalogo = await model.lerGold(`${base}/catalogo/estrutura.json`);
        let status = await model.lerGold(`${base}/geral/tempo_real/status.json`);

        // maquina que nao aparece no status  conta como offline -YasminEloitaNascimento
        let online = 0;
        for (let i = 0; i < catalogo.maquinas.length; i++) {
            let st = status.find(s => s.id_maquina == catalogo.maquinas[i].id_maquina);
            if (st && st.status_geral != "offline") online++;
        }

        let total = catalogo.maquinas.length;

        res.json({
            online: online,
            total: total,
            percentual: total > 0 ? Math.round((online / total) * 1000) / 10 : 0
        });
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ erro: erro.message });
    }
}



async function mapaSaude(req, res) {
    try {
        let idEmpresa = req.params.idEmpresa;
        let empresa = await pegarEmpresa(idEmpresa);
        let base = `${idEmpresa}/${empresa.nome_fantasia}/operacional`;

        let catalogo = await model.lerGold(`${base}/catalogo/estrutura.json`);
        let status = await model.lerGold(`${base}/geral/tempo_real/status.json`);
        let abertos = await model.alertasAbertosPorFarm(idEmpresa);

        // monta farm > sessao > rigs usando o catalogo -YasminEloitaNascimento
        let farms = {};
        for (let i = 0; i < catalogo.maquinas.length; i++) {
            let m = catalogo.maquinas[i];

            if (!farms[m.id_farm]) {
                let ab = abertos.find(x => x.id_farm == m.id_farm);
                farms[m.id_farm] = { id: m.id_farm, nome: m.farm, alertas_abertos: ab ? Number(ab.abertos) : 0, sessoes: {} };
            }
            if (!farms[m.id_farm].sessoes[m.id_sessao]) {
                farms[m.id_farm].sessoes[m.id_sessao] = { id: m.id_sessao, nome: m.sessao, rigs: [] };
            }

            let st = status.find(s => s.id_maquina == m.id_maquina);

            farms[m.id_farm].sessoes[m.id_sessao].rigs.push({
                id: m.id_maquina,
                status: st ? st.status_geral : "offline"
            });
        }

        // transforma em lista e ordena rigs por gravidade, farms por alertas abertos -YasminEloitaNascimento
        let lista = Object.values(farms).map(f => {
            let sessoes = Object.values(f.sessoes);
            sessoes.forEach(s => s.rigs.sort((a, b) => (ORDEM_STATUS[a.status] ?? 3) - (ORDEM_STATUS[b.status] ?? 3) || a.id - b.id));
            return { id: f.id, nome: f.nome, alertas_abertos: f.alertas_abertos, sessoes: sessoes };
        });

        lista.sort((a, b) => b.alertas_abertos - a.alertas_abertos);

        res.json(lista);
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ erro: erro.message });
    }
}

module.exports = { kpis, alertasPorFarm, alertasDaFarm, uptime, mapaSaude };