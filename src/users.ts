import { Request, Response } from "express";
import { BadRequestError } from "./middleware.js";
import { createUser } from "./db/queries/users.js";
import { respondWithJSON } from "./api/readiness.js";
import { hashPassword } from "./auth.js";

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