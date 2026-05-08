import { Router } from 'express';
import {
	listarTodasDoacoes,
	incluirDoador,
	excluirDoador,
} from './doador.controller.js';

const rotas = Router();

rotas.post('/doacao', incluirDoador);
rotas.get('/doacoes', listarTodasDoacoes);
rotas.delete('/excluirdoacao', excluirDoador);

export default rotas;
