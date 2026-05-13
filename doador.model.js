import mongoose from 'mongoose';

const doadorSchema = new mongoose.Schema({
    nomeCompleto: String,
    sexo: String,
    cpf: String,
    dataNascimento: Date,
    celular: String,
    email: String,
    endereco: {
        cep: String,
        rua: String,
        numero: Number,
        bairro: String,
        cidade: String,
        estado: String,
    },
    senhaHash: String,
    tipo: String,
    ativo: Boolean,
    criadoEm: Date,
    atualizadoEm: Date,
});

export const doadorModel = mongoose.model('doador', doadorSchema);
