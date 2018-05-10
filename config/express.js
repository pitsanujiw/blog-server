const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const bodyParser = require("body-parser");

module.exports = function() {
    const app = express();
    
    if (process.env.NODE_ENV === "develoment") {
        app.use(morgan("dev"));
        console.warn("Running mode: " + process.env.NODE_ENV)
    } else {
        app.use(compression());
        console.warn("Running mode: " + process.env.NODE_ENV)
    }
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    app.set("views", "./app/views");
    app.set("view engine", "ejs");


    require("../app/routes/index.routes")(app);
    return app;
}