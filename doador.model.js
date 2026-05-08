import mongoose from 'mongoose';
import mongodb from 'mongodb';

const doadorSchema = new mongoose.Schema({
    nome: String,
    logradouro: String,
    numero: Number,
    complemento: String,
    cidade: String,
    UF: String,
    CPF: String,
    email: String,
    senha: String,
    valor_doacao: Number,
});

export const doadorModel = mongoose.model('doador', doadorSchema);
