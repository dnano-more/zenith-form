import { z, zodUndefinedModel } from "../../schema";
import { userService } from "../../services";
import { getAuthenticationMethodOutputSchema } from "@repo/services/user/model";
import { publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: ["prod", "production"].includes(process.env.NODE_ENV ?? ""),
  sameSite: (["prod", "production"].includes(process.env.NODE_ENV ?? "") ? "none" : "lax") as "none" | "lax",
  path: "/",
};

export const authRouter = router({
  getSupportedAuthenticationProviders: publicProcedure
    .meta({ openapi: { method: "GET", path: getPath("/supported-providers"), tags: TAGS } })
    .input(zodUndefinedModel)
    .output(z.readonly(z.array(getAuthenticationMethodOutputSchema)))
    .query(async () => {
      const supportedMethods = await userService.getAuthenticationMethods();
      return supportedMethods;
    }),
  loginAsGuest: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/guest-login"), tags: TAGS } })
    .input(zodUndefinedModel)
    .output(z.object({ success: z.literal(true) }))
    .mutation(async ({ ctx }) => {
      const { sessionToken } = await userService.loginAsGuest();

      ctx.res.cookie("session_token", sessionToken, {
        ...COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return { success: true };
    }),
  logout: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/logout"), tags: TAGS } })
    .input(zodUndefinedModel)
    .output(z.object({ success: z.literal(true) }))
    .mutation(async ({ ctx }) => {
      ctx.res.clearCookie("session_token", COOKIE_OPTIONS);
      return { success: true };
    }),
});
