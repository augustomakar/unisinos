import { doacaoModel } from './doacao.model.js';

// *** rota REVISADA em 27/05/2026 as 21:29 *** //
export async function incluirDoacao(req, res) {
    const dados = req.body;
    const { valor, nome, email } = req.body;

    if (!nome || !email || !valor) {
        return res.status(400).json({
            msg: 'Todos os campos da doação precisam ser preenchidos',
        });
    }

    let msg = '';

    // grava no Banco de Dados
    try {
        dados.criadoEm = new Date();
        const doacao = new doacaoModel(dados);
        await doacao.save();
        return res.status(201).json(doacao);
    } catch (error) {
        msg = 'msg: Erro ao gravar a doação no BD.' + error;
        return res.status(500).json(msg);
    }
}

export async function listarDocoesPorDoador(req, res) {
    const dados = req.params;
    let msg = '';

    try {
        const doacao = await doacaoModel
            .find({ usuarioId: dados.id_doador })
            .exec();

        res.status(201).json(doacao);
    } catch (error) {
        msg = 'msg: Erro ao gravar a doação no BD.' + error;
        res.status(500).json(msg);
    }
}

// *** rota REVISADA em 27/05/2026 as 21:00 *** //
export async function listarTodasDoacoes(req, res) {
    try {
        console.log('listartodasdoacoes');
        const doacao = await doacaoModel.find({}).exec();
        return res.status(200).json(doacao);
    } catch (error) {
        return res
            .status(500)
            .json({ msg: 'Erro ao listar todas as doações', error });
    }
}
