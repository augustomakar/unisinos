import { doadorModel } from './doador.model.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export async function incluirDoador(req, res) {
    const dados = req.body;
    const password = dados.senhaHash;
    const { email } = dados;
    let msg = '';

    // verifica se email e senha foram informados
    if (!password || !email) {
        msg = 'msg: Email ou Password não informados.';
        res.status(400).json(msg);
    }

    // verifica se doador já está cadastrado
    try {
        const usuarioBD = await doadorModel.findOne({ email }).exec();
        if (usuarioBD) {
            msg = 'msg: Usuário já cadastrado.';
            res.status(400).json(msg);
        }
    } catch (error) {
        msg = 'msg: Erro ao consultar se o usuário já esta cadastrado.';
        res.status(500).json(msg);
    }

    // criptografa senha
    try {
        const passwordEncrypted = await encryptPassword(password);
        dados.senhaHash = passwordEncrypted;
    } catch (error) {
        msg = 'msg: Erro ao criptografar a senha do doador.';
        res.status(500).json(msg);
    }

    // grava no Banco de Dados
    try {
        const doador = new doadorModel(dados);
        await doador.save();
        res.status(201).json(doador);
    } catch (error) {
        msg = 'msg: Erro ao gravar o doador no BD.';
        res.status(500).json(msg);
    }
}

export async function listarTodasDoacoes(req, res) {
    const doador = await doadorModel.find({});
    res.status(200).json(doador);
    // console.log(req);
}

export async function excluirDoador(req, res) {
    const email = req.body.email;
    const password = req.body.senha;

    const deletado = await doadorModel.findOneAndDelete({
        email: email,
        senha: password,
    });
    res.status(200).send(deletado);
    // console.log(req);
}

async function encryptPassword(password) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}

export async function autenticarUsuario(req, res) {
    const dados = req.body;
    const password = dados.senhaHash;
    const { email } = dados;
    let msg = '';

    // verifica se email e senha foram informados
    if (!password || !email) {
        msg = 'msg: Email ou Password não informados.';
        res.status(400).json(msg);
    }

    // verifica se o email está cadastrado
    try {
        const doadorBD = await doadorModel.findOne({ email }).exec();
        if (!doadorBD) {
            msg = 'msg: Erro ao validar credenciais.';
            res.status(400).json(msg);
        }

        const passwordHashed = doadorBD.senhaHash;
        const passwordMatch = await bcrypt.compare(password, passwordHashed);
        if (!passwordMatch) {
            msg = 'msg: Erro ao validar credenciais.';
            res.status(400).json(msg);
        }

        const payload = {
            id: doadorBD.id,
            username: doadorBD.nomeCompleto,
            role: doadorBD.tipo,
        };

        const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: '1h',
        });
        res.status(297).json({ payload, token });
    } catch (error) {
        msg = 'msg: Erro ao consultar se o usuário já esta cadastrado.';
        res.status(500).json(msg);
    }

    res.status(299).json('ok');
}
