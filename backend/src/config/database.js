const { DataSource } = require("typeorm");
const config = require("./config");
const Task = require("../entity/Task");
const User = require("../entity/User");

const AppDataSource = new DataSource({
  type: "postgres",
  host: config.DB_HOST,
  port: config.DB_PORT,
  username: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [Task, User],
});

module.exports = AppDataSource;
