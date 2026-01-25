import { BadRequestError, NotFoundError } from "./middleware.js";
import { createUser, updateUser, updateUserRed } from "./db/queries/users.js";
import { respondWithJSON } from "./api/readiness.js";
import { hashPassword, getBearerToken, validateJWT, getAPIKey } from "./auth.js";
import { config } from "./config.js";
export async function postUsers(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError("Missing required fields");
    }
    const hashedPassword = await hashPassword(password);
    const user = await createUser({ email, hashedPassword });
    respondWithJSON(res, 201, {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isChirpyRed: user.isChirpyRed
    });
}
export async function handlerUpdateUser(req, res) {
    const AccessToken = getBearerToken(req);
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError("Missing email or new password");
    }
    const validateTokenForUserId = validateJWT(AccessToken, config.secretKey);
    const hashedPassword = await hashPassword(password);
    const updatedUser = await updateUser(validateTokenForUserId, email, hashedPassword);
    respondWithJSON(res, 200, {
        id: updatedUser.id,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
    });
}
export async function handlerUpdateRed(req, res) {
    const authHeader = getAPIKey(req);
    const { event, data } = req.body;
    if (event !== "user.upgraded") {
        return respondWithJSON(res, 204, []);
    }
    const upgradeUser = await updateUserRed(data['userId']);
    if (!upgradeUser) {
        throw new NotFoundError("User could not be found or upgraded");
    }
    return respondWithJSON(res, 204, '');
}
