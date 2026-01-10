import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { getFileserverHits } from "./metrics.js";
import { resetFileserverHits } from "./reset.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./middleware.js";
import { handlerValidateChirp } from "./validate.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use(express.json());

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", getFileserverHits);
app.post("/admin/reset", resetFileserverHits);
app.post("/api/validate_chirp", handlerValidateChirp);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
