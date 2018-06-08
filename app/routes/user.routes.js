module.exports = function (app) {
    const user = require("../controllers/user.controller");
    var passport = require("passport");

    app.get("/oauth/facebook", passport.authenticate("facebook", {
        failureRedirect: "/login",
        scope: "email"
    }));
    app.get("/oauth/facebook/callback", passport.authenticate("facebook", {
        failureRedirect: "/login",
        successRedirect: "/"
    }));
    app.post("/logout", user.logout);
    app.route("/login")
        .get(user.renderLogin)
        .post(passport.authenticate("local", {
            successRedirect: "/",
            failureRedirect: "/login",
            failureFlash: true
        }));
    app.route("/signup")
        .get(user.renderSignup)
        .post(user.signup)
    app.route("/user")
        .post(user.create)
        .get(user.list)
    app.route("/user/:username") // todo second
        .get(user.read)
        .put(user.update)
        .delete(user.delete)
    app.param("username", user.userByusername) // todo first
}