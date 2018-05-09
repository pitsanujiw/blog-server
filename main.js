require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");

// keep log
const logger = function(req, res, next) {
    console.log(req.method, req.url);
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
    resave: true,
    saveUninitialized: false
}));
app.use("/api", require("./routes/index.route"));
app.use("*", (req, res, next) => {
    res.sendFile(path.join(__dirname, "http-status", "404.html"));
});


const server = app.listen(process.env.API_PORT, process.env.API_HOSTNAME, () => {
    const port = server.address().port;
    const hostname = server.address().address;
    console.log(`Server running at ${hostname}:${port}`);
})