import { doadorModel } from './doador.model.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

// *** rota REVISADA em 27/05/2026 as 20:18 *** //
export async function incluirDoador(req, res) {
    const dados = req.body;
    const { email, password1, password2 } = req.body;

    // testa se todos os campos estão preenchidos
    if (!email || !password1 || !password2) {
        return res
            .status(400)
            .json({ msg: 'Todos os campos precisam ser preenchidos !' });
    }

    // testa se os passwords são iguais
    if (password1 !== password2) {
        return res.status(400).json({
            msg: 'A senha e sua confirmação precisam ser iguais !',
        });
    }

    // verifica se doador já está cadastrado
    try {
        const usuarioBD = await doadorModel.findOne({ email }).exec();
        if (usuarioBD) {
            return res.status(400).json({ msg: 'Usuário já cadastrado.' });
        }
    } catch (error) {
        return res.status(500).json({
            msg: 'Erro ao consultar se o usuário já esta cadastrado.',
            error,
        });
    }

    // criptografa senha
    try {
        const passwordEncrypted = await encryptPassword(password1);
        dados.senhaHash = passwordEncrypted;
    } catch (error) {
        return res
            .status(500)
            .json({ msg: 'Erro ao criptografar a senha do doador.', error });
    }

    // grava no Banco de Dados
    try {
        const doador = new doadorModel(dados);
        await doador.save();
        return res.status(201).json(doador);
    } catch (error) {
        return res
            .status(500)
            .json({ msg: 'Erro ao gravar o doador no BD.', error });
    }
}

async function encryptPassword(password) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}

// *** rota REVISADA em 27/05/2026 as 20:03 *** //
export async function autenticarUsuario(req, res) {
    const dados = req.body;
    const password = dados.senhaHash;
    const { email } = dados;
    let msg = '';

    // verifica se email e senha foram informados
    if (!password || !email) {
        msg = 'msg: Email ou Password não informados.';
        return res.status(400).json({ msg });
    }

    // verifica se o email está cadastrado
    try {
        const doadorBD = await doadorModel.findOne({ email }).exec();
        if (!doadorBD) {
            msg = 'msg: Erro ao validar credenciais.';
            return res.status(400).json(msg);
        }

        const passwordHashed = doadorBD.senhaHash;
        const passwordMatch = await bcrypt.compare(password, passwordHashed);
        if (!passwordMatch) {
            msg = 'msg: Erro ao validar credenciais.';
            return res.status(400).json(msg);
        }

        const payload = {
            id: doadorBD.id,
            username: doadorBD.nomeCompleto,
            role: doadorBD.tipo,
        };

        const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: '1h',
        });
        res.status(200).json({ payload, token });
    } catch (error) {
        msg = 'msg: Erro ao consultar se o usuário já esta cadastrado.';
        res.status(500).json(msg);
    }
}

// *** rota REVISADA em 28/05/2026 as 18:39 *** //
export async function listarDoador(req, res) {
    const idDoador = req.params.id_doador;
    let msg = '';

    try {
        const doador = await doadorModel.findById(idDoador).exec();
        return res.status(200).json(doador);
    } catch (error) {
        msg = 'msg: Erro ao retornar dados do doador.' + error;
        return res.status(500).json(msg);
    }
}

// *** rota REVISADA em 27/05/2026 as 21:05 *** //
export async function listarUsuarios(req, res) {
    let msg = '';

    const admin = req.payload.role;

    if (admin !== 'admin') {
        return res
            .status(403)
            .json({ msg: 'Rota exclusiva para administradores' });
    }

    try {
        const usuarios = await doadorModel.find({}).exec();
        return res.status(200).json(usuarios);
    } catch (error) {
        msg = 'msg: Erro ao retornar dados dos usuários.' + error;
        return res.status(500).json(msg);
    }
}

// *** rota REVISADA em 27/05/2026 as 21:09 *** //
export async function excluirDoador(req, res) {
    const idDoador = req.params.id_doador;
    let msg = '';
    const admin = req.payload.role;

    if (admin !== 'admin') {
        return res
            .status(403)
            .json({ msg: 'Rota exclusiva para administradores' });
    }

    try {
        const doador = await doadorModel
            .findByIdAndUpdate(idDoador, { ativo: false })
            .exec();
        doador.save();
        return res.status(200).json(doador);
    } catch (error) {
        msg = 'msg: Erro ao excluir dados do doador.' + error;
        return res.status(500).json(msg);
    }
}

// *** rota REVISADA em 28/05/2026 as 18:41 *** //
export async function alterarDoador(req, res) {
    const idDoador = req.params.id_doador;
    const dados = req.body;
    let msg = '';

    try {
        const doador = await doadorModel
            .findByIdAndUpdate(idDoador, dados)
            .exec();
        doador.save();
        return res.status(200).json(doador);
    } catch (error) {
        msg = 'msg: Erro ao alterar dados do doador.' + error;
        return res.status(500).json(msg);
    }
}

// *** rota REVISADA em 27/05/2026 as 17:38 *** //
export async function redefinirSenha(req, res) {
    const { email, oldPassword, newPassword1, newPassword2 } = req.body;

    // testa se todos os campos estão preenchidos
    if (!email || !oldPassword || !newPassword1 || !newPassword2) {
        return res
            .status(400)
            .json({ msg: 'Todos os campos precisam ser preenchidos !' });
    }

    // testa se os passwords são iguais
    if (newPassword1 !== newPassword2) {
        return res.status(400).json({
            msg: 'A nova senha e sua confirmação precisam ser iguais !',
        });
    }

    // testa se a senha antiga e a nova são iguais
    if (oldPassword === newPassword1) {
        return res.status(400).json({
            msg: 'A nova senha e anterior são iguais !',
        });
    }

    try {
        // testa se o email anterior existe
        const doador = await doadorModel.findOne({ email }).exec();
        if (!doador) {
            return res
                .status(400)
                .json({ msg: 'Usuário não cadastrado ou senha incorreta !' });
        }

        // Verifica se a senha anterior está correta
        const passwordMatch = await bcrypt.compare(
            oldPassword,
            doador.senhaHash,
        );
        if (!passwordMatch) {
            return res
                .status(400)
                .json({ msg: 'Usuário não cadastrado ou senha incorreta !' });
        }

        // POR FIM criptografa nova senha e grava no BD
        const senhaHash = await bcrypt.hash(
            newPassword1,
            Number(process.env.SALT_ROUNDS),
        );
        const data = await doadorModel.findOneAndUpdate(
            { email },
            { senhaHash },
        );
        return res.status(200).json({ msg: 'Senha alterada com sucesso !' });
    } catch (error) {
        return res.status(500).json({ msg: 'Erro do servidor !', error });
    }
}
