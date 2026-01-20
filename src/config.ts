import type { MigrationConfig } from "drizzle-orm/migrator";
process.loadEnvFile();

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

const dbConfig: DBConfig = {
    dbURL: envOrThrow("DB_URL"),
    migrationConfig: migrationConfig
}

const apiConfig: APIConfig = {
    fileserverHits: 0
}

type DBConfig = {
    dbURL: string,
    migrationConfig: MigrationConfig
}

type APIConfig = {
    fileserverHits: number;
}

export const config = {
    db: dbConfig,
    api: apiConfig,
    secretKey: envOrThrow("JWT_KEY")
};

function envOrThrow(key: string) {
    if(!process.env[key]) {
        throw new Error(`${key} does not resolve to anything`);
    }

    return process.env[key];
}