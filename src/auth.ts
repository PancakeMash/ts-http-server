import argon2 from 'argon2';
import type { Request } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UnauthorisedError } from './middleware.js';

export async function hashPassword(password: string): Promise<string> {

    const hash = await argon2.hash(password);

    return hash
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {

    return await argon2.verify(hash, password);

}

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    const payload: payload = {
        iss: 'chirpy',
        sub: userID,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + expiresIn,
    };

    return jwt.sign(payload, secret);
}

export function validateJWT(tokenString: string, secret: string): string {
    let validatedJWT;
    try {
        validatedJWT = jwt.verify(tokenString, secret);
    } catch (err) {
        throw new UnauthorisedError(`Invalid token: ${err}`);
    }

    const payload = validatedJWT as JwtPayload;

    if (!payload.sub) {
        throw new UnauthorisedError("Token payload missing sub");
    }

    return payload.sub as string;
}


type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function getBearerToken(req: Request): string {
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