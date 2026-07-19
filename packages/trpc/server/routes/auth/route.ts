import { z, zodUndefinedModel } from "../../schema";
import { userService } from "../../services";
import { getAuthenticationMethodOutputSchema } from "@repo/services/user/model";
import { publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

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
        httpOnly: true,
        secure: ["prod", "production"].includes(process.env.NODE_ENV ?? ""),
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return { success: true };
    }),
  logout: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/logout"), tags: TAGS } })
    .input(zodUndefinedModel)
    .output(z.object({ success: z.literal(true) }))
    .mutation(async ({ ctx }) => {
      ctx.res.clearCookie("session_token");
      return { success: true };
    }),
});
