import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { verifySessionToken, type SessionPayload } from "@repo/services/auth/jwt";

export interface Context {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: SessionPayload | null;
}

export async function createContext({ req, res }: CreateExpressContextOptions): Promise<Context> {
  const token = req.cookies?.session_token as string | undefined;
  const session = token ? verifySessionToken(token) : null;

  return {
    req,
    res,
    user: session,
  };
}
