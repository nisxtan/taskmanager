require("dotenv").config();

const AppConfig = {
  PORT: process.env.PORT || 4000,
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: process.env.DB_PORT || 5432,
  DB_USER: process.env.DB_USER || "postgres",
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME || "taskmanager",
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
};

const SMTPConfig = {
  provider: process.env.SMTP_PROVIDER,
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
  password: process.env.SMTP_PASSWORD,
  fromAddress: process.env.SMTP_FROM_ADDRESS,
};

const GOOGLEConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
};

module.exports = { AppConfig, SMTPConfig, GOOGLEConfig };
