import { db } from "../index.js";
import { users } from "../schema.js";
import { eq } from "drizzle-orm";
export async function createUser(user) {
    const [result] = await db
        .insert(users)
        .values(user)
        .returning();
    return result;
}
export async function getUserByEmail(email) {
    const [result] = await db.select().from(users).where(eq(users.email, email));
    return result;
}
export async function updateUser(userId, email, hashedPassword) {
    const [result] = await db
        .update(users)
        .set({ email: email, hashedPassword: hashedPassword })
        .where(eq(users.id, userId))
        .returning();
    return result;
}
export async function updateUserRed(userId) {
    const [result] = await db
        .update(users)
        .set({ isChirpyRed: true })
        .where(eq(users.id, userId))
        .returning();
    return result;
}
