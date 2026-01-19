import argon2 from 'argon2';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UnauthorisedError } from './middleware';

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

    return payload.sub as string;
}

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;