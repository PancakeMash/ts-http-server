import { Request, Response } from "express";
import { BadRequestError } from "./middleware.js";
import { createUser, updateUser } from "./db/queries/users.js";
import { respondWithJSON } from "./api/readiness.js";
import { hashPassword, getBearerToken, validateJWT } from "./auth.js";
import { config } from "./config.js";

export async function postUsers(req: Request, res: Response) {
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
  });
}

export async function handlerUpdateUser(req: Request, res: Response) {
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