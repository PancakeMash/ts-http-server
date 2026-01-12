import { BadRequestError } from "./middleware.js";
export async function handlerValidateChirp(req, res) {
    res.header("Content-Type", "application/json");
    const parsed = req.body;
    if (!parsed.body) {
        // return res.status(400).send({ error: "Something went wrong" });
        throw new BadRequestError("Something went wrong");
    }
    if (parsed.body.length > 140) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }
    const validatedBody = checkProfane(parsed.body);
    return res.status(200).send({ "cleanedBody": validatedBody });
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
