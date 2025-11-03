const { DataSource } = require("typeorm");
const { AppConfig } = require("./config");
const Task = require("../entity/Task");
const User = require("../entity/User");

const AppDataSource = new DataSource({
  type: "postgres",
  host: AppConfig.DB_HOST,
  port: AppConfig.DB_PORT,
  username: AppConfig.DB_USER,
  password: AppConfig.DB_PASSWORD,
  database: AppConfig.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [Task, User],
});

module.exports = AppDataSource;
