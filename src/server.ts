import express from "express";

import router from "./routes";

const app = express();

app.use("/", router); // path must route to lambda

app.use("/.netlify/functions/server", router); // path must route to lambda

module.exports = app;
