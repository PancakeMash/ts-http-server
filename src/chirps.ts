import { Request, Response } from "express";
import { NotFoundError } from "./middleware.js";
import { getChirps, getChirpById } from "./db/queries/chirps.js";
import { respondWithJSON } from "./api/readiness.js";
import { get } from "node:http";

export async function handlerGetChirps(req: Request, res: Response) {
    const allChirps = await getChirps();
    console.log(allChirps);
    respondWithJSON(res, 200, allChirps);
}

export async function handlerGetChirpById(req: Request, res: Response) {
    const getChirp = await getChirpById(req.params.chirpID);
    if (!getChirp) {
        throw new NotFoundError("Could not find chirp with given ID");
    }
    console.log(getChirp);

    respondWithJSON(res,200, {
        id: getChirp.id,
        body: getChirp.body,
        userId: getChirp.userId,
        createdAt: getChirp.createdAt,
        updatedAt: getChirp.updatedAt
    });
}