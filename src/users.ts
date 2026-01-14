import { Request, Response } from "express";
import { BadRequestError } from "./middleware.js";
import { createUser } from "./db/queries/users.js";
import { respondWithJSON } from "./api/readiness.js";

export async function postUsers(req: Request, res: Response) {
  const { email } = req.body;

  if (!email) {
    throw new BadRequestError("Missing required fields");
  }

  const user = await createUser({ email });

  // with no onConflictDoNothing, user should always exist if DB is clean
  respondWithJSON(res, 201, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
}