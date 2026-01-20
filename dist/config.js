process.loadEnvFile();
const migrationConfig = {
    migrationsFolder: "./src/db/migrations",
};
const dbConfig = {
    dbURL: envOrThrow("DB_URL"),
    migrationConfig: migrationConfig
};
const apiConfig = {
    fileserverHits: 0
};
export const config = {
    db: dbConfig,
    api: apiConfig,
    secretKey: envOrThrow("JWT_KEY")
};
function envOrThrow(key) {
    if (!process.env[key]) {
        throw new Error(`${key} does not resolve to anything`);
    }
    return process.env[key];
}
