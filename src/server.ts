import express from "express";

import router from "./routes";
import { bodyFormatter } from "./middlewares";

const app = express();
app.use(bodyFormatter);

app.use("/", router); // path must route to lambda
app.use("/.netlify/functions/server", router); // path must route to lambda

module.exports = app;
