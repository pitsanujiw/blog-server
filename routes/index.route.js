const express = require("express");
const app = express();

app.use("/auth", require("./auth/index.route"));

module.exports = app;