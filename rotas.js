import { Router } from 'express';
import { middlewareValidarJWT } from './auth.js';

import {
    incluirDoador,
    autenticarUsuario,
    excluirDoador,
    listarDoador,
    listarUsuarios,
    alterarDoador,
    redefinirSenha,
} from './doador.controller.js';
import {
    incluirDoacao,
    listarDocoesPorDoador,
    listarTodasDoacoes,
} from './doacao.controller.js';

const rotas = Router();

// SEM MIDDLEWARE
rotas.post('/auth/redefinir-senha', redefinirSenha);
rotas.post('/auth/login', autenticarUsuario);
rotas.post('/auth/cadastro', incluirDoador);
// COM O MIDDLEWARE E ADMIN
rotas.get('/admin/doacoes', middlewareValidarJWT, listarTodasDoacoes);
rotas.get('/admin/usuarios', middlewareValidarJWT, listarUsuarios);
rotas.delete('/admin/usuarios/:id_doador', middlewareValidarJWT, excluirDoador);
// SOMENTE O MIDDLEWARE
rotas.post('/doacao', middlewareValidarJWT, incluirDoacao);
rotas.get(
    '/doador/minhas-doacoes/:id_doador',
    middlewareValidarJWT,
    listarDocoesPorDoador,
);
rotas.get('/doador/perfil/:id_doador', middlewareValidarJWT, listarDoador);
rotas.patch('/doador/perfil/:id_doador', middlewareValidarJWT, alterarDoador);

export default rotas;
