import { config } from "./config.js";
export function resetFileserverHits(req, res) {
    config.api.fileserverHits = 0;
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.status(200).send();
}
