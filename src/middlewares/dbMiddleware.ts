import { NextFunction } from "express";
import {
  createConnection,
  getConnectionOptions,
  getConnectionManager,
  ConnectionOptions
} from "typeorm";

import "reflect-metadata";

import getTimeOrTab from "./getTimeOrTab";
import "../entities";

async function getOrCreateConnection(config: ConnectionOptions) {
  const CONNECTION_NAME = "default";
  const connManager = getConnectionManager();
  const hasConn = connManager.has(CONNECTION_NAME);
  if (hasConn) {
    let conn = connManager.get(CONNECTION_NAME);
    const isConnected = conn.isConnected;
    if (!isConnected) conn = await conn.connect();
    return ["has", isConnected ? "was" : "was not"];
  } else {
    await createConnection(config);
    return ["has no", "was not"];
  }
}

async function initDb() {
  console.debug(`${getTimeOrTab()}begin database connection connected.`);

  const host = process.env.TYPEORM_HOST;
  const username = process.env.TYPEORM_USERNAME;
  const password = process.env.TYPEORM_PASSWORD;
  const { database, port, ...rest } = (await getConnectionOptions()) as any;

  try {
    const config = { database, port, host, username, password, ...rest };
    const [hasConn, isConnected] = await getOrCreateConnection(config);

    const dbgMsg = `${getTimeOrTab()}postgresql://${username}:*******@${host}:${port}/${database} ${hasConn} connection and ${isConnected} connected.`;
    console.debug(dbgMsg);
  } catch (err) {
    const errMsg = `${getTimeOrTab()}failed postgresql://${username}:*******@${host}:${port}/${database}. ${err}`;
    console.error(errMsg);
    throw err;
  }
}

async function dbMiddleware(_: any, __: any, next: NextFunction) {
  try {
    await initDb();
  } catch (err) {
    next(err.message);
  }
  next();
}

export default dbMiddleware;
