import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { getFileserverHits } from "./metrics.js";
import { resetFileserverHits } from "./reset.js";
import { middlewareLogResponses, middlewareMetricsInc, middlewareErrorHandler } from "./middleware.js";
import { handlerChirpsCreate } from "./validate.js";
import { handlerGetChirpById, handlerGetChirps, handlerDeleteChirp } from "./chirps.js";
import { postUsers, handlerUpdateUser, handlerUpdateRed } from "./users.js";
import { handlerLogin } from "./login.js";
import { handlerRefreshToken, handlerRevokeToken } from "./tokens.js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";
const migrationClient = postgres(config.db.dbURL, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);
const app = express();
const PORT = 8080;
app.use(middlewareLogResponses);
app.use(express.json());
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", getFileserverHits);
app.post("/admin/reset", resetFileserverHits);
app.post("/api/chirps", async (req, res, next) => {
    try {
        await handlerChirpsCreate(req, res);
    }
    catch (err) {
        next(err);
    }
});
app.get("/api/chirps", handlerGetChirps);
app.get("/api/chirps/:chirpID", handlerGetChirpById);
app.post("/api/users", postUsers);
app.post("/api/login", handlerLogin);
app.post("/api/refresh", handlerRefreshToken);
app.post("/api/revoke", handlerRevokeToken);
app.post('/api/polka/webhooks', handlerUpdateRed);
app.put("/api/users", handlerUpdateUser);
app.delete("/api/chirps/:chirpID", handlerDeleteChirp);
app.use(middlewareErrorHandler);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
