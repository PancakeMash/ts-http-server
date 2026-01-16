import argon2 from 'argon2';
export async function hashPassword(password) {
    const hash = await argon2.hash(password);
    return hash;
}
export async function checkPasswordHash(password, hash) {
    return await argon2.verify(hash, password);
}
