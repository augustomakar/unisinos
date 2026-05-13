import { Router } from 'express';
import {
    listarTodasDoacoes,
    incluirDoador,
    excluirDoador,
    autenticarUsuario,
} from './doador.controller.js';
import { incluirDoacao, listarDocoesPorDoador } from './doacao.controller.js';

const rotas = Router();

rotas.post('/auth/cadastro', incluirDoador);
rotas.post('/auth/login', autenticarUsuario);
rotas.get('/doador/minhas-doacoes', listarDocoesPorDoador);

rotas.get('/doacoes', listarTodasDoacoes);
rotas.delete('/excluirdoacao', excluirDoador);

export default rotas;
