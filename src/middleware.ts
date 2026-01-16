import { Request, Response, NextFunction } from "express";
import { config } from "./config.js";

export function middlewareLogResponses(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
        const status = res.statusCode;
        if (status !== 200) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${status}`);
        }
    });

    next();
}

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
    config.api.fileserverHits += 1;
    next();
}

export function middlewareErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.log(err);

    if (err instanceof BadRequestError || err instanceof UnauthorisedError || err instanceof ForbiddenError || err instanceof NotFoundError) {
        res.status(err.statusCode).json({ error: err.message });
        return;
    }

    res.status(500).json({ error: "Internal Server Error" });

}

export class BadRequestError extends Error {

    statusCode: number;

    constructor(message: string) {
        super(message);
        this.statusCode = 400;
    }
}

export class UnauthorisedError extends Error {
    statusCode: number;

    constructor(message: string) {
        super(message);
        this.statusCode = 401;
    }
}

class ForbiddenError extends Error {
    statusCode: number;

    constructor(message: string) {
        super(message);
        this.statusCode = 403;
    }
}

export class NotFoundError extends Error {
    statusCode: number;

    constructor(message: string) {
        super(message);
        this.statusCode = 404;
    }
}