module.exports = function(app) {
    const user = require("../controllers/user.controller");
    app.post("/login", user.login);
    app.post("/logout", user.logout);
    app.route("/user")
        .post(user.create)
        .get(user.list)
    app.route("/user/:userName") // todo second
        .get(user.read)
        .put(user.update)
    app.param("userName", user.userByUserName) // todo first
}