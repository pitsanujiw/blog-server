const config = require("./config");
const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const bodyParser = require("body-parser");
const validator = require("express-validator");
// const cookieSession = require("cookie-session");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const passport = require("passport");

module.exports = function() {
    const app = express();
    
    if (process.env.NODE_ENV === "development") {
        app.use(morgan("dev"));
        console.warn("Running mode: " + process.env.NODE_ENV)
    } else {
        app.use(compression());
        console.warn("Running mode: " + process.env.NODE_ENV)
    }
    app.use(session({
        store: new RedisStore({
            host: "localhost",
            port: 6379
        }),
        secret: config.sessionSecret,
        resave: false,
        saveUninitialized: true
    }))
    app.use(function(req, res, next) {
        if (!req.session) {
            return next(new Error("Please check redis"));
        }
        next();
    })
    app.use(passport.initialize());
    app.use(passport.session());
    // app.use(cookieSession({
    //     name: "session",
    //     keys: ["sittikiat", "sujitranon"]
    // }))
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(validator())

    app.set("views", "./app/views");
    app.set("view engine", "ejs");

    require("../app/routes/index.routes")(app);
    require("../app/routes/user.routes")(app);

    app.use(express.static("./public"));
    return app;
}