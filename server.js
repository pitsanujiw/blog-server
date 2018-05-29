// set default NODE_ENV if env uninitialze is development
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const mongoose = require("./config/mongoose");
const express = require("./config/express");

const db = mongoose()
const app = express();

const server = app.listen(3000, "localhost", () => {
    const port = server.address().port;
    const hostname = server.address().address;
    console.log(`Server running at ${hostname}:${port}`);
})