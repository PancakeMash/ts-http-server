import { Request, Response } from "express";
import { NotFoundError } from "./middleware.js";
import { getChirps, getChirpById, deleteChirpById } from "./db/queries/chirps.js";
import { respondWithJSON } from "./api/readiness.js";
import { getBearerToken, validateJWT } from "./auth.js";
import { ForbiddenError } from "./middleware.js";
import { config } from "./config.js";

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

export async function handlerDeleteChirp(req: Request, res: Response) {
    const accessUserId = validateJWT(getBearerToken(req), config.secretKey);

    const chirpId = req.params.chirpID;
    
    const chirp = await getChirpById(chirpId);
    if (chirp.userId !== accessUserId) {
        throw new ForbiddenError("You do not have permission to delete this chirp");
    }

    const deletedChirp = await deleteChirpById(chirpId);
    if (!deletedChirp) {
        throw new NotFoundError("Could not find chirp with given ID to delete");
    }

    return res.status(204).send();
}