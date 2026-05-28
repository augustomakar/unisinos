import { Router } from 'express';
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

rotas.get('/doador/minhas-doacoes/:id_doador', listarDocoesPorDoador);
rotas.get('/doador/perfil/:id_doador', listarDoador);
rotas.patch('/doador/perfil/:id_doador', alterarDoador);

// revisadas
rotas.post('/auth/redefinir-senha', redefinirSenha);
rotas.post('/auth/login', autenticarUsuario);
rotas.post('/auth/cadastro', incluirDoador);

// falta midleware
rotas.get('/admin/doacoes', listarTodasDoacoes);
rotas.get('/admin/usuarios', listarUsuarios);
rotas.delete('/admin/usuarios/:id_doador', excluirDoador);
rotas.post('/doacao', incluirDoacao);

export default rotas;
