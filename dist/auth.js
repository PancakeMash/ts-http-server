import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { UnauthorisedError } from './middleware.js';
import crypto from 'crypto';
export async function hashPassword(password) {
    const hash = await argon2.hash(password);
    return hash;
}
export async function checkPasswordHash(password, hash) {
    return await argon2.verify(hash, password);
}
export function makeJWT(userID, expiresIn, secret) {
    const payload = {
        iss: 'chirpy',
        sub: userID,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + expiresIn,
    };
    return jwt.sign(payload, secret);
}
export function validateJWT(tokenString, secret) {
    let validatedJWT;
    try {
        validatedJWT = jwt.verify(tokenString, secret);
    }
    catch (err) {
        throw new UnauthorisedError(`Invalid token: ${err}`);
    }
    const payload = validatedJWT;
    if (!payload.sub) {
        throw new UnauthorisedError("Token payload missing sub");
    }
    return payload.sub;
}
export function getBearerToken(req) {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        throw new UnauthorisedError('Missing Authorization header');
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        throw new UnauthorisedError('Invalid Authorization header format');
    }
    return parts[1].trim();
}
export function makeRefreshToken() {
    return crypto.randomBytes(32).toString('hex');
}
export function getAPIKey(req) {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        throw new UnauthorisedError('Missing Authorization header');
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'ApiKey') {
        throw new UnauthorisedError('Invalid Authorization header format');
    }
    return parts[1].trim();
}
