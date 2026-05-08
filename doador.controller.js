import { doadorModel } from './doador.model.js';
import bcrypt from 'bcrypt';

export async function incluirDoador(req, res) {
	const dados = req.body;
	const password = dados.senha;
	const { email } = dados;

	console.log(email);
	try {
		const emailCadastrado = await doadorModel.findOne({ email }).exec();
		if (emailCadastrado) {
			res.status(400).json('msg: email já cadastrado');
			return;
		}
	} catch (error) {
		res.status(500).json('msg: erro ao consultar doador');
	}

	try {
		const passwordEncrypted = await encryptPassword(password);
		dados.senha = passwordEncrypted;
	} catch (error) {
		res.status(500).json('msg: erro na criptografia');
		console.error('erro na criptografia: ', error);
	}

	try {
		const doador = new doadorModel(dados);
		await doador.save();
		res.status(201).json(dados);
	} catch (error) {
		res.status(500).json('msg: erro ao gravar no Bd');
		console.error(error);
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
