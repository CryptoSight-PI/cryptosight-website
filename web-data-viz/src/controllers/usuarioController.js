var usuarioModel = require("../models/usuarioModel");


async function validarAdmin(idSolicitante) {
    if (!idSolicitante) return null;
    var r = await usuarioModel.buscarPorId(idSolicitante);
    if (r.length == 0) return null;
    if (r[0].cargo != "SuperAdmin" && r[0].cargo != "Administrador") return null;
    return r[0];
}


async function buscarAlvo(id, admin) {
    var r = await usuarioModel.buscarPorId(id);
    if (r.length == 0 || r[0].idEmpresa != admin.idEmpresa) return null;
    return r[0];
}

function normalizarCargo(cargo) {
    var c = String(cargo || "").trim();
    if (c.length == 0 || c.length > 30) return null;
    var semEspaco = c.toLowerCase().replace(/\s/g, "");
    if (semEspaco == "superadmin") return null;
    if (semEspaco == "administrador") return "Administrador";
    return c;
}

function erro(res, e) {
    console.log(e);
    if (e && e.code == "ER_DUP_ENTRY") {
        return res.status(409).send("CPF ou e-mail já cadastrado");
    }
    return res.status(500).send("Erro interno do servidor");
}

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (!email || !senha) {
        return res.status(400).send("Preencha todos os campos");
    }

    usuarioModel.autenticar(email, senha)
        .then(function (resultado) {
            if (resultado.length == 1) {
                res.json(resultado[0]);
            } else {
                res.status(403).send("Email e/ou senha inválido(s)");
            }
        })
        .catch(function (e) { erro(res, e); });
}

// primeiro usuario da empresa o SUPERADMIN -YasminEloitaNascimento
async function cadastrarSuperAdmin(req, res) {
    var { nome, cpf, email, senha, idEmpresa } = req.body;

    if (!nome || !cpf || !email || !senha || !idEmpresa) {
        return res.status(400).send("Preencha todos os campos");
    }
    if (String(cpf).length != 11) {
        return res.status(400).send("CPF precisa ter 11 caracteres");
    }
    if (isNaN(idEmpresa)) {
        return res.status(400).send("Empresa inválida. Cadastre a empresa novamente.");
    }

    try {
        var r = await usuarioModel.contarSuperAdmin(idEmpresa);
        if (r[0].total > 0) {
            return res.status(403).send("Essa empresa já possui um Super Admin");
        }
        await usuarioModel.cadastrarSuperAdmin(nome, cpf, email, senha, idEmpresa);
        res.json({ ok: true });
    } catch (e) { erro(res, e); }
}

// admin cadastra usuario sem senha -YasminEloitaNascimento
async function cadastrarPendente(req, res) {
    var { nome, cpf, cargo, email, idSolicitante } = req.body;

    if (!nome || !cpf || !cargo || !email) {
        return res.status(400).send("Preencha todos os campos");
    }
    if (String(cpf).length != 11) {
        return res.status(400).send("CPF precisa ter 11 caracteres");
    }
    var cargoFinal = normalizarCargo(cargo);
    if (!cargoFinal) {
        return res.status(400).send("Cargo inválido");
    }

    try {
        var admin = await validarAdmin(idSolicitante);
        if (!admin) {
            return res.status(403).send("Sem permissão para cadastrar usuários");
        }
        await usuarioModel.cadastrarPendente(nome, cargoFinal, cpf, email, admin.idEmpresa);
        res.json({ ok: true });
    } catch (e) { erro(res, e); }
}

// o funcionario coloca o cpf e recebe os dados que o admin cadastrou -YasminEloitaNascimento
async function buscarPorCpf(req, res) {
    var cpf = req.params.cpf;

    if (String(cpf).length != 11 || isNaN(cpf)) {
        return res.status(400).send("CPF precisa ter 11 números");
    }

    try {
        var r = await usuarioModel.buscarPendentePorCpf(cpf);
        if (r.length == 0) {
            return res.status(404).send("CPF não encontrado ou cadastro já finalizado");
        }
        res.json(r[0]);
    } catch (e) { erro(res, e); }
}


async function finalizarCadastro(req, res) {
    var { cpf, senha } = req.body;

    if (!cpf || !senha) {
        return res.status(400).send("Preencha todos os campos");
    }
    if (senha.length < 6) {
        return res.status(400).send("A senha precisa ter pelo menos 6 caracteres");
    }

    try {
        var r = await usuarioModel.finalizarCadastro(cpf, senha);
        if (r.affectedRows == 0) {
            return res.status(404).send("Cadastro não encontrado ou já finalizado");
        }
        res.json({ ok: true });
    } catch (e) { erro(res, e); }
}

async function listar(req, res) {
    try {
        var admin = await validarAdmin(req.params.idSolicitante);
        if (!admin) {
            return res.status(403).send("Sem permissão");
        }
        var usuarios = await usuarioModel.listar(admin.idEmpresa);
        res.json(usuarios);
    } catch (e) { erro(res, e); }
}

async function editar(req, res) {
    var { nome, cpf, cargo, email, idSolicitante } = req.body;

    if (!nome || !cpf || !cargo || !email) {
        return res.status(400).send("Preencha todos os campos");
    }
    if (String(cpf).length != 11) {
        return res.status(400).send("CPF precisa ter 11 caracteres");
    }
    var cargoFinal = normalizarCargo(cargo);
    if (!cargoFinal) {
        return res.status(400).send("Cargo inválido");
    }

    try {
        var admin = await validarAdmin(idSolicitante);
        if (!admin) return res.status(403).send("Sem permissão");

        var alvo = await buscarAlvo(req.params.id, admin);
        if (!alvo) return res.status(404).send("Usuário não encontrado");
        if (alvo.cargo == "SuperAdmin") {
            return res.status(403).send("O Super Admin não pode ser alterado");
        }

        await usuarioModel.editar(alvo.id, nome, cargoFinal, cpf, email);
        res.json({ ok: true });
    } catch (e) { erro(res, e); }
}

async function excluir(req, res) {
    try {
        var admin = await validarAdmin(req.query.idSolicitante);
        if (!admin) return res.status(403).send("Sem permissão");

        var alvo = await buscarAlvo(req.params.id, admin);
        if (!alvo) return res.status(404).send("Usuário não encontrado");
        if (alvo.cargo == "SuperAdmin") {
            return res.status(403).send("O Super Admin não pode ser excluído");
        }
        if (alvo.id == admin.id) {
            return res.status(403).send("Você não pode excluir a si mesmo");
        }

        await usuarioModel.excluirVinculos(alvo.id);
        await usuarioModel.excluir(alvo.id);
        res.json({ ok: true });
    } catch (e) { erro(res, e); }
}

module.exports = {
    autenticar,
    cadastrarSuperAdmin,
    cadastrarPendente,
    finalizarCadastro,
    buscarPorCpf,
    listar,
    editar,
    excluir
};