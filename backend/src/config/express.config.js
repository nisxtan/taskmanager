const express = require("express");
const router = require("./router.config");

const app = express();

// app.use(
//   rateLimit({
//     windowMs: 60000,
//     limit: 30,
//   })
// );

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

//versioning

app.use("api/v1", router);

//errors
app.use((req, res, next) => {
  next({
    detail: "value",
    message: "Resource not found.",
    code: 404,
    status: "RESOURCE_NOT_FOUND",
    options: null,
  });
  console.log("iamhere");
});

app.use((error, req, res, next) => {
  console.log(error);
  let code = error.code || 500;
  let detail = error.detail || null;
  let message = error.message || "Internal Server Error";
  let status = error.status || "";

  //del condition pachi halne

  //mongodb chalaune vaye yeta chaicha unique validator

  //? generic middleware
  res.status(code).json({
    error: detail,
    message: message,
    status: code,
    options: null,
  });
});

module.exports = app;
