import { BadRequestError } from "./middleware.js";
import { createChirp } from "./db/queries/chirps.js";
import { respondWithJSON } from "./api/readiness.js";
export async function handlerValidateChirp(req, res) {
    const { body, userId } = req.body;
    if (!body) {
        // return res.status(400).send({ error: "Something went wrong" });
        throw new BadRequestError("Something went wrong");
    }
    if (body.length > 140) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }
    // if(!isValidUUID(userId)) {
    //   throw new BadRequestError("Invalid userId");
    // }
    const validatedBody = checkProfane(body);
    const newChirp = await createChirp({
        body,
        userId
    });
    respondWithJSON(res, 201, {
        id: newChirp.id,
        createdAt: newChirp.createdAt,
        updatedAt: newChirp.updatedAt,
        body: newChirp.body,
        userId: newChirp.userId
    });
}
function checkProfane(text) {
    const profanity = ["kerfuffle", "sharbert", "fornax"];
    const words = text.split(" ");
    const newWords = [];
    for (const word of words) {
        let cleaned = word;
        for (const profane of profanity) {
            if (word.toLowerCase() === profane) {
                cleaned = "****";
                console.log(`${word} is now ${cleaned}`);
            }
        }
        newWords.push(cleaned);
    }
    return newWords.join(" ");
}
