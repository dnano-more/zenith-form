import jwt from "jsonwebtoken";
import { env } from "../env";

export interface SessionPayload {
  userId: string;
  email: string;
}

const JWT_EXPIRY = "7d";

export function signSessionToken(payload: SessionPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, env.JWT_SECRET) as SessionPayload;
  } catch {
    // token expired, tampered, or invalid — treat as "not logged in"
    return null;
  }
}