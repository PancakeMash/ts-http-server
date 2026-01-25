import { BadRequestError, UnauthorisedError } from "./middleware.js";
import { getUserByEmail } from "./db/queries/users.js";
import { checkPasswordHash, makeJWT, makeRefreshToken } from "./auth.js";
import { respondWithJSON } from "./api/readiness.js";
import { config } from "./config.js";
import { storeRefreshToken } from "./db/queries/refreshTokens.js";
export async function handlerLogin(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError("Please enter your email and/or password");
    }
    const getUser = await getUserByEmail(email);
    const checkHash = await checkPasswordHash(password, getUser.hashedPassword);
    if (!getUser || !checkHash) {
        throw new UnauthorisedError("Incorrect email or password");
    }
    const token = makeJWT(getUser.id, 3600, config.secretKey);
    const refreshToken = makeRefreshToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 60);
    await storeRefreshToken({
        token: refreshToken,
        userId: getUser.id,
        expiresAt: expiresAt
    });
    respondWithJSON(res, 200, {
        id: getUser.id,
        createdAt: getUser.createdAt,
        updatedAt: getUser.updatedAt,
        email: getUser.email,
        token: token,
        refreshToken: refreshToken,
        isChirpyRed: getUser.isChirpyRed
    });
}
