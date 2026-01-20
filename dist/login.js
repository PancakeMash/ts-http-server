import { BadRequestError, UnauthorisedError } from "./middleware.js";
import { getUserByEmail } from "./db/queries/users.js";
import { checkPasswordHash, makeJWT } from "./auth.js";
import { respondWithJSON } from "./api/readiness.js";
import { config } from "./config.js";
export async function handlerLogin(req, res) {
    const { email, password } = req.body;
    let { expiresInSeconds } = req.body;
    if (!email || !password) {
        throw new BadRequestError("Please enter your email and/or password");
    }
    const getUser = await getUserByEmail(email);
    const checkHash = await checkPasswordHash(password, getUser.hashedPassword);
    if (!getUser || !checkHash) {
        throw new UnauthorisedError("Incorrect email or password");
    }
    const MAX_EXPIRES = 3600;
    if (typeof expiresInSeconds !== "number" || expiresInSeconds > MAX_EXPIRES) {
        expiresInSeconds = MAX_EXPIRES;
    }
    const token = makeJWT(getUser.id, expiresInSeconds, config.secretKey);
    respondWithJSON(res, 200, {
        id: getUser.id,
        createdAt: getUser.createdAt,
        updatedAt: getUser.updatedAt,
        email: getUser.email,
        token: token
    });
}
