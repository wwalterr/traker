const express = require("express");

const cookieParser = require("cookie-parser");

const cookieEncrypter = require("cookie-encrypter");

const settings = require("./settings");

const router = require("./router");

// Application
const application = express();

application.set("view engine", "ejs");

// Middleware
application.use(cookieParser()); // settings.cookie.secret

application.use(cookieEncrypter(settings.cookie.secret));

application.use("/assets", express.static("assets"));

// Router
application.use("/", router);

// Error
application.get("*", (request, response) => {
  response.status(404).redirect("/");
});

// Server
application.listen(settings.express.port, settings.express.host);
