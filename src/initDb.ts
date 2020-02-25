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
  const host = process.env.TYPEORM_HOST;
  const username = process.env.TYPEORM_USERNAME;
  const password = process.env.TYPEORM_PASSWORD;
  const { database, port, ...rest } = (await getConnectionOptions()) as any;

  const time = moment().format("YYYY/MM/DD HH:mm");
  try {
    const config = { database, port, host, username, password, ...rest };

    const [hasConn, isConnected] = await getOrCreateConnection(config);

    console.log(
      `${time}: postgresql://${username}:*******@${host}:${port}/${database} ${hasConn} connection and ${isConnected} connected.`
    );
  } catch (err) {
    console.error(
      `${time}: failed postgresql://${username}:*******@${host}:${port}/${database}. ${err}`
    );
    throw err;
  }
}

export default initDb;
