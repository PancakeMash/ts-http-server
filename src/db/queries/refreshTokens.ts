import { db } from "../index.js";
import { eq } from "drizzle-orm";
import {refreshTokens, newRefreshToken} from "../schema.js";

export async function storeRefreshToken(refreshToken: newRefreshToken) {
    const [result] = await db
        .insert(refreshTokens)
        .values(refreshToken)
        .returning();
    return result;
}

export async function getRefreshTokenByToken(token: string) {
    const [result] = await db
        .select()
        .from(refreshTokens)
        .where(eq(refreshTokens.token, token));
    
    return result;
}

export async function revokeRefreshToken(token: string, revokedAt: Date) {
    const [result] = await db
        .update(refreshTokens)
        .set({ revokedAt: revokedAt })
        .where(eq(refreshTokens.token, token))
        .returning();
    
    return result;
}