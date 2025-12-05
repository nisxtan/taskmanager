require("./passport");
const passport = require("passport");
const express = require("express");
const cors = require("cors");
const router = require("./router.config");
const AppDataSource = require("./database"); // Import the single instance

const session = require("express-session");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

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

//session middleware
app.use(
  session({
    secret: "djkfhdkfldsfkdsfdskjfd",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

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

  // Ensure code is always a number
  let code = 500; // default

  if (typeof error.code === "number") {
    code = error.code;
  } else if (error.code === "invalid_grant") {
    code = 400; // Bad request for OAuth errors
  }

  let detail = error.detail || null;
  let message = error.message || "Internal Server Error";
  let status = error.status || "";

  // Clean up OAuth error messages
  if (message.includes("invalid_grant")) {
    message = "Authentication failed. Please try logging in again.";
  }

  res.status(code).json({
    error: detail,
    message: message,
    status: code,
    options: null,
  });
});

module.exports = app;
