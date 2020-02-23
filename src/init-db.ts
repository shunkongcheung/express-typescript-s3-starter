import { createConnection } from "typeorm";
import moment from "moment";

interface Props {
  host: string;
  port?: number;
  database: string;
  username: string;
  password: string;
}

async function initDb({
  host,
  port = 5432,
  database,
  username,
  password
}: Props) {
  const time = moment().format("YYYY/MM/DD HH:mm");
  try {
    await createConnection({
      type: "postgres",
      host,
      port,
      username,
      password,
      database,
      synchronize: true,
      logging: false,
      entities: [`${__dirname}/entities/**/*.js`],
      migrations: [`${__dirname}/migration/**/*.js`],
      subscribers: [`${__dirname}/subscriber/**/*.js`]
    });
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
