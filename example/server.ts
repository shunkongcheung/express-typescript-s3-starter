import serverless from "serverless-http";
import getExpressApp from "../src/getExpressApp";

import router from "./routes";
import { User } from "./entities";

// create routes
const app = getExpressApp({
  router,
  userModel: User
});

// finish and export
export const handler = serverless(app);
export default app;
