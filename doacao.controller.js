import { doacaoModel } from './doacao.model.js';

export async function incluirDoacao(req, res) {
    const dados = req.body;

    let msg = '';

    // grava no Banco de Dados
    try {
        const doacao = new doacaoModel(dados);
        await doacao.save();
        res.status(201).json(doacao);
    } catch (error) {
        msg = 'msg: Erro ao gravar a doação no BD.' + error;
        res.status(500).json(msg);
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
