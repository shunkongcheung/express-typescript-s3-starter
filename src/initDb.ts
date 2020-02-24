import { createConnection, getConnectionOptions } from "typeorm";
import moment from "moment";

import "reflect-metadata";
import "./entities";

async function initDb() {
  const { database, port } = await getConnectionOptions();
  const host = process.env.TYPEORM_HOST;
  const username = process.env.TYPEORM_USERNAME;

  const time = moment().format("YYYY/MM/DD HH:mm");
  try {
    await createConnection();
    console.log(
      `${time}: connected postgresql://${username}:*******@${host}:${port}/${database}.`
    );
  } catch (err) {
    console.error(
      `${time}: failed postgresql://${username}:*******@${host}:${port}/${database}. ${err}`
    );
  }
}

export default initDb;
