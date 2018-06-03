var passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("mongoose").model("User");

module.exports = function () {
    passport.use(new LocalStrategy(function (username, password, done) {
        User.findOne({ "userName": username }, function (err, user) {
            if (err) { return done(err) };
            if (!user || !user.authenticate(password)) {
                return done(null, false, { message: "Invalid username or password"});
            }
            return done(null, user);
        });
    }));
}