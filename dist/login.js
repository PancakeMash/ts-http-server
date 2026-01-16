import { BadRequestError, UnauthorisedError } from "./middleware.js";
import { getUserByEmail } from "./db/queries/users.js";
import { checkPasswordHash } from "./auth.js";
import { respondWithJSON } from "./api/readiness.js";
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
    respondWithJSON(res, 200, {
        id: getUser.id,
        createdAt: getUser.createdAt,
        updatedAt: getUser.updatedAt,
        email: getUser.email
    });
}
