import { getExpressApp } from "../src";

import router from "./routes";
import { User } from "./entities";

// create routes
const { app, serverlessHandler } = getExpressApp({
  router,
  userModel: User
});

// finish and export
export const handler = serverlessHandler;
export default app;
