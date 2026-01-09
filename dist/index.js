import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { getFileserverHits } from "./metrics.js";
import { resetFileserverHits } from "./reset.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./middleware.js";
const app = express();
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", getFileserverHits);
app.get("/admin/reset", resetFileserverHits);
