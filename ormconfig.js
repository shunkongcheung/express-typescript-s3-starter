const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  type: "postgres",
  host: process.env.TYPEORM_HOST,
  port: 5432,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  syncchronize: false,
  logging: false,
  entities: ["dist/example/entities/**/*.js"],
  migrations: ["dist/example/migrations/**/*.js"],
  cli: {
    migrationsDir: "example/migrations"
  }
};
