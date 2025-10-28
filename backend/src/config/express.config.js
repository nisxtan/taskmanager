const express = require("express");
const router = require("./router.config");
const AppDataSource = require("./database"); // Import the single instance

const app = express();

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

// Initialize the database
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");

    // Store the initialized AppDataSource in app settings
    app.set("AppDataSource", AppDataSource);
  })
  .catch((err) => {
    console.error("DB connection error:", err);
    process.exit(1);
  });

// Versioning
app.use("/api/v1", router);

// Error handlers
app.use((req, res, next) => {
  next({
    detail: "value",
    message: "Resource not found.",
    code: 404,
    status: "RESOURCE_NOT_FOUND",
    options: null,
  });
});

app.use((error, req, res, next) => {
  console.log(error);
  let code = error.code || 500;
  let detail = error.detail || null;
  let message = error.message || "Internal Server Error";
  let status = error.status || "";

  res.status(code).json({
    error: detail,
    message: message,
    status: code,
    options: null,
  });
});

module.exports = app;
