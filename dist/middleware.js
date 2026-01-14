import { config } from "./config.js";
export function middlewareLogResponses(req, res, next) {
    res.on('finish', () => {
        const status = res.statusCode;
        if (status !== 200) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${status}`);
        }
    });
    next();
}
export function middlewareMetricsInc(req, res, next) {
    config.api.fileserverHits += 1;
    next();
}
export function middlewareErrorHandler(err, req, res, next) {
    console.log(err);
    if (err instanceof BadRequestError || err instanceof UnauthorisedError || err instanceof ForbiddenError || err instanceof NotFoundError) {
        res.status(err.statusCode).json({ error: err.message });
        return;
    }
    res.status(500).json({ error: "Internal Server Error" });
}
export class BadRequestError extends Error {
    statusCode;
    constructor(message) {
        super(message);
        this.statusCode = 400;
    }
}
class UnauthorisedError extends Error {
    statusCode;
    constructor(message) {
        super(message);
        this.statusCode = 401;
    }
}
class ForbiddenError extends Error {
    statusCode;
    constructor(message) {
        super(message);
        this.statusCode = 403;
    }
}
class NotFoundError extends Error {
    statusCode;
    constructor(message) {
        super(message);
        this.statusCode = 404;
    }
}
