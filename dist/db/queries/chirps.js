import { asc, eq, desc } from "drizzle-orm";
import { db } from "../index.js";
import { chirps } from "../schema.js";
export async function createChirp(chirp) {
    const [result] = await db
        .insert(chirps)
        .values(chirp)
        .returning();
    return result;
}
export async function getChirps(sortBy = 'asc') {
    const result = await db.select().from(chirps).orderBy((sortBy === 'desc' ? desc(chirps.createdAt) : asc(chirps.createdAt)));
    return result;
}
export async function getChirpById(chirpId) {
    const [result] = await db.select().from(chirps).where(eq(chirps.id, chirpId));
    return result;
}
export async function deleteChirpById(chirpId) {
    const [result] = await db
        .delete(chirps)
        .where(eq(chirps.id, chirpId))
        .returning();
    return result;
}
export async function getChirpByAuthorId(authorId, sortBy = 'asc') {
    const result = await db.select().from(chirps).where(eq(chirps.userId, authorId)).orderBy((sortBy === 'desc' ? desc(chirps.createdAt) : asc(chirps.createdAt)));
    return result;
}
