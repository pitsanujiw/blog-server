// set default NODE_ENV if env uninitialze is development
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const mongoose = require("./config/mongoose");
const express = require("./config/express");
var passport = require("./config/passport");

const db = mongoose()
const app = express();
var passport = passport();

const server = app.listen(3000, "localhost", () => {
    const port = server.address().port;
    const hostname = server.address().address;
    console.log(`Server running at ${hostname}:${port}`);
})