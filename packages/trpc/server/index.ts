import { router } from "./trpc";

import { healthRouter } from "./routes/health/route";
import { authRouter } from "./routes/auth/route";
import { userRouter } from "./routes/user/route";
import { formRouter } from "./routes/form/route";
import { fieldRouter } from "./routes/field/route";
import { responseRouter } from "./routes/response/route";

export const serverRouter = router({
  health: healthRouter,
  auth: authRouter,
  user: userRouter,
  form: formRouter,
  field: fieldRouter,
  response: responseRouter,
});

export { createContext } from "./context";
export * from "./services";
export type ServerRouter = typeof serverRouter;
