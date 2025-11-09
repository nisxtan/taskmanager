const { DataSource } = require("typeorm");
const { AppConfig } = require("./config");
const Task = require("../entity/Task");
const User = require("../entity/User");
const Role = require("../entity/Role");
const Permission = require("../entity/Permission");

const AppDataSource = new DataSource({
  type: "postgres",
  host: AppConfig.DB_HOST,
  port: AppConfig.DB_PORT,
  username: AppConfig.DB_USER,
  password: AppConfig.DB_PASSWORD,
  database: AppConfig.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [Task, User, Role, Permission],
});

module.exports = AppDataSource;
