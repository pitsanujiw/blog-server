module.exports = function(app) {
    const user = require("../controllers/user.controller");
    app.post("/login", user.login);
    app.post("/logout", user.logout);

    app.route("/signup")
        .get(user.renderSignup)
        .post(user.signup)
    app.route("/user")
        .post(user.create)
        .get(user.list)
    app.route("/user/:userName") // todo second
        .get(user.read)
        .put(user.update)
        .delete(user.delete)
    app.param("userName", user.userByUserName) // todo first
}