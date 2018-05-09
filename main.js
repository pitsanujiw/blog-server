require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");

// keep log
const logger = function(req, res, next) {
    console.log(req.ip, req.hostname, req.method, req.url);
    next();
};

const header = function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "localhost:3000");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
};

app.use(logger);
app.use(header);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: "sittikiat",
    resave: false,
    saveUninitialized: true
}));
// app.use(bodyParser.json());

app.use("/api", require("./routes/index.route"));
app.use("*", (req, res, next) => {
    res.sendFile(path.join(__dirname, "http-status", "404.html"));
    res.status(404);
});


const server = app.listen(process.env.API_PORT, process.env.API_HOSTNAME, () => {
    const port = server.address().port;
    const hostname = server.address().address;
    console.log(`Server running at ${hostname}:${port}`);
})