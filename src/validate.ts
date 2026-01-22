import { Request, Response } from "express";
import { BadRequestError } from "./middleware.js"
import { createChirp } from "./db/queries/chirps.js";
import { isValidUUID, respondWithJSON } from "./api/readiness.js";
import { getBearerToken, validateJWT } from "./auth.js";
import { config } from "./config.js";

function validateChirp(body: string): string {
  if (!body) {
    throw new BadRequestError("Chirp body is required");
  }

  if (body.length > 140) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  }

  const cleanedBody = checkProfane(body);

  return cleanedBody;
}


export async function handlerChirpsCreate(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  const params: parameters = req.body;

  const token = getBearerToken(req);
  const userId = validateJWT(token, config.secretKey);

  const cleaned = validateChirp(params.body);
  const chirp = await createChirp({ body: cleaned, userId });

  respondWithJSON(res, 201, chirp);
}


function checkProfane(text: string) {
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





