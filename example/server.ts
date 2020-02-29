import { getExpressApp } from "../src";

import router from "./routes";
import { File, User } from "./entities";

// create routes
const { app, serverlessHandler } = getExpressApp({
  fileModel: File,
  router,
  userModel: User
});

// finish and export
export const handler = serverlessHandler;
export default app;
