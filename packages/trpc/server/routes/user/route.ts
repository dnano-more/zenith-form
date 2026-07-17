import { z, zodUndefinedModel } from "../../schema";
import { protectedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";

const TAGS = ["User"];
const getPath = generatePath("/user");

export const userRouter = router({
  whoAmI: protectedProcedure
    .meta({ openapi: { method: "GET", path: getPath("/me"), tags: TAGS } })
    .input(zodUndefinedModel)
    .output(
      z.object({
        userId: z.string(),
        email: z.string(),
      }),
    )
    .query(async ({ ctx }) => {
      return {
        userId: ctx.user.userId,
        email: ctx.user.email,
      };
    }),
});
