let passport = require("passport");
const mongoose = require("mongoose");

module.exports = function () {
    const User = mongoose.model("User");

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findOne({ "_id": id }, function (err, user) {
            done(err, user);
        });
    });

}