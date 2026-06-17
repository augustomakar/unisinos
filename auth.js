import { configDotenv } from 'dotenv';
import jwt from 'jsonwebtoken';
import express, { json } from 'express';

configDotenv();

export const middlewareValidarJWT = (req, res, next) => {
    // const jwtToken = req.headers['authorization'];
    const jwtToken = req.headers['authorization']?.split(' ')[1];
    const jwtSecretKey = process.env.JWT_SECRET_KEY;

    jwt.verify(jwtToken, jwtSecretKey, (err, payload) => {
        if (err) {
            res.status(403).json({ msg: 'Usuário não autenticado' });
            return;
        }

        req.payload = payload;
        next();
    });
};
