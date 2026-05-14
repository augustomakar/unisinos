import { Router } from 'express';
import {
    listarTodasDoacoes,
    incluirDoador,
    excluirDoador,
    autenticarUsuario,
    listarDoador,
    listarUsuarios,
} from './doador.controller.js';
import { incluirDoacao, listarDocoesPorDoador } from './doacao.controller.js';

const rotas = Router();

// REVISADAS
rotas.post('/auth/cadastro', incluirDoador);
rotas.post('/auth/login', autenticarUsuario);
rotas.get('/doador/minhas-doacoes/:id_doador', listarDocoesPorDoador);
rotas.get('/doador/perfil/:id_doador', listarDoador);
rotas.get('/admin/usuarios', listarUsuarios);
rotas.post('/doacao', incluirDoacao);

rotas.get('/doacoes', listarTodasDoacoes);
rotas.delete('/excluirdoacao', excluirDoador);

export default rotas;
