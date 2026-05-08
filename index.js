import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import rotas from './rotas.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

dotenv.config();

app.use('/api', rotas);

try {
	await mongoose.connect(process.env.MONGODB_URI);
	console.log('Servidor conectado ao MongoDB');
} catch (error) {
	console.log(`Erro ao iniciar o MongoDB: ` + error);
}

try {
	app.listen(process.env.PORT);
	console.log(`Servidor está rodando na porta ==> ${process.env.PORT}`);
} catch (error) {
	console.log(`Erro ao iniciar o servidor: ` + error);
}
