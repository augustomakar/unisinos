import mongoose from 'mongoose';

const doacaoSchema = new mongoose.Schema({
    usuarioId: String,
    nome: String,
    email: String,
    valor: Number,
    criadoEm: Date,
});

export const doacaoModel = mongoose.model('doacao', doacaoSchema);
