import express from "express";
import cookieParser from "cookie-parser";
import { logger } from "@repo/logger";
import cors from "cors";

import * as trpcExpress from "@trpc/server/adapters/express";
import { generateOpenApiDocument, createOpenApiExpressMiddleware } from "trpc-to-openapi";
import { apiReference } from "@scalar/express-api-reference";

import { serverRouter, createContext } from "@repo/trpc/server";
import { userService } from "@repo/trpc/server/services";

import { env } from "./env";

export const app = express();
const openApiDocument = generateOpenApiDocument(serverRouter, {
  title: "Zenith Form OpenAPI",
  version: "1.0.0",
  baseUrl: env.BASE_URL.concat("/api"),
});

if (env.NODE_ENV !== "prod") {
  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
    }),
  );
}

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  return res.json({ message: "Zenith Form is up and running..." });
});

app.get("/health", (req, res) => {
  return res.json({ message: "Zenith Form server is healthy", healthy: true });
});

logger.debug(`openapi.json: ${env.BASE_URL}/openapi.json`);
app.get("/openapi.json", (req, res) => {
  return res.json(openApiDocument);
});

logger.debug(`docs: ${env.BASE_URL}/docs`);
app.use("/docs", apiReference({ url: "/openapi.json" }));

app.get("/api/authentication/google/callback", async (req, res) => {
  const code = typeof req.query.code === "string" ? req.query.code : undefined;

  if (!code) {
    return res.redirect(`${env.FRONTEND_URL}/login?error=missing_code`);
  }

  try {
    const { sessionToken } = await userService.loginWithGoogleCode(code);

    res.cookie("session_token", sessionToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "prod" || env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(`${env.FRONTEND_URL}/dashboard`);
  } catch (err) {
    logger.error("Google OAuth callback failed", { err });
    return res.redirect(`${env.FRONTEND_URL}/login?error=oauth_failed`);
  }
});

app.use(
  "/api",
  createOpenApiExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

export default app;
