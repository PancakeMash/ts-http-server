process.loadEnvFile();
export const config = {
    fileserverHits: 0,
    dbURL: envOrThrow("DB_URL")
};
function envOrThrow(key) {
    if (!process.env[key]) {
        throw new Error(`${key} does not resolve to anything`);
    }
    return process.env[key];
}
