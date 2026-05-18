import { Router } from 'express';
import {
    incluirDoador,
    autenticarUsuario,
    listarTodasDoacoes,
    excluirDoador,
    listarDoador,
    listarUsuarios,
    alterarDoador,
} from './doador.controller.js';
import { incluirDoacao, listarDocoesPorDoador } from './doacao.controller.js';

const rotas = Router();

// REVISADAS
rotas.post('/auth/cadastro', incluirDoador);
rotas.post('/auth/login', autenticarUsuario);
rotas.post('/doacao', incluirDoacao);
rotas.get('/doador/minhas-doacoes/:id_doador', listarDocoesPorDoador);
rotas.get('/admin/doacoes', listarTodasDoacoes);
rotas.get('/admin/usuarios', listarUsuarios);
rotas.get('/doador/perfil/:id_doador', listarDoador);
rotas.delete('/admin/usuarios/:id_doador', excluirDoador);
rotas.patch('/doador/perfil/:id_doador', alterarDoador);

export default rotas;
