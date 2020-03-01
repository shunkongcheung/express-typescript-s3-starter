import {
  createConnection,
  getConnectionOptions,
  getConnectionManager,
  ConnectionOptions
} from "typeorm";
import moment from "moment";

import "reflect-metadata";
import "./entities";

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
  const startTime = moment().format("YYYY/MM/DD HH:mm");
  console.debug(`${startTime}: begin database connection connected.`);

  const host = process.env.TYPEORM_HOST;
  const username = process.env.TYPEORM_USERNAME;
  const password = process.env.TYPEORM_PASSWORD;
  const { database, port, ...rest } = (await getConnectionOptions()) as any;

  try {
    const config = { database, port, host, username, password, ...rest };
    const [hasConn, isConnected] = await getOrCreateConnection(config);

    const endTime = moment().format("YYYY/MM/DD HH:mm");
    const dbgMsg = `${endTime}: postgresql://${username}:*******@${host}:${port}/${database} ${hasConn} connection and ${isConnected} connected.`;
    console.debug(dbgMsg);
  } catch (err) {
    const endTime = moment().format("YYYY/MM/DD HH:mm");
    const errMsg = `${endTime}: failed postgresql://${username}:*******@${host}:${port}/${database}. ${err}`;
    console.error(errMsg);
    throw err;
  }
}

export default initDb;
