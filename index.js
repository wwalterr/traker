require("dotenv").config();

const express = require("express");

const cookieParser = require("cookie-parser");

const cookieEncrypter = require("cookie-encrypter");

const router = require("./source/router");

// Application
const application = express();

application.set("view engine", "ejs");

// Middleware
application.use(cookieParser()); // process.env.SERVER_COOKIE_SECRET

application.use(cookieEncrypter(process.env.SERVER_COOKIE_SECRET));

application.use("/assets", express.static("assets"));

// Router
application.use("/", router);

// Error
application.use((error, request, response, next) => {
  response.status(404).redirect("/");
});

// Server
application.listen(
  process.env.PORT || parseInt(process.env.SERVER_PORT),
  process.env.SERVER_HOST
);
