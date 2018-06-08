const User = require("mongoose").model("User");


function getErrorMessage(err) {
    let message = null;

    if (err.code) {
        // error code mongodb
        switch (err.code) {
            case 11001:
                messsage = "Username is already";
                break;
            default:
                message = "Something went wrong";
        }
    } else {
        // validation error
        for (let errName in err.errors) {
            if (err.errors[errName].message) {
                message = err.errors[errName].message;
            }
        }
    }
    return message;
}




exports.create = function (req, res, next) {
    const userCtrl = new User(req.body);
    userCtrl.save(function (err) {
        if (err) {
            // error because username is duplicate key
            return next(err);
        } else {
            res.json(userCtrl);
        }
    })
}

exports.list = function (req, res, next) {
    User.find({}, "firstName lastName username", {}, function (err, users) {
        if (err) {
            return next(err);
        } else {
            res.json(users);
        }
    })
}

exports.read = function (req, res, next) {
    if (req.user === null) {
        res.json(`Username ${req.username} has not in system. Please register.`);
    } else {
        res.json(req.user)
    }
}

exports.userByusername = function (req, res, next, username) {
    User.findOne({ "username": username }, function (err, user) {
        if (err) {
            return next(err);
        } else {
            req.username = username;
            req.user = user;
            next();
        }
    });
};

exports.update = function (req, res, next) {
    User.findOneAndUpdate({ "username": req.user.username }, req.body, function (err, user) {
        if (err) {
            return next(err);
        } else {
            res.json(user);
        }
    });
};

exports.delete = function (req, res, next) {
    req.user.remove(function (err) {
        if (err) {
            return next(err);
        } else {
            res.json(req.user);
        }
    });
};

exports.renderSignup = function (req, res, next) {
    if (!req.user) {
        res.render("signup", {
            title: "Sign up",
            messages: req.flash("error")
        });
    } else {
        return res.redirect("/");
    }
}

exports.signup = function (req, res, next) {
    if (!req.user) {
        let user = new User(req.body);
        user.provider = "local";

        user.save(function (err) {
            if (err) {
                let message = getErrorMessage(err);
                console.log(message)
                req.flash("error", message)
                return res.redirect("/signup");
            }
            req.login(user, function (err) {
                if (err) {
                    return next(err);
                }
                return res.redirect("/");
            });
        });
    } else {
        return res.redirect("/");
    }
}

exports.renderLogin = function (req, res, next) {
    if (!req.user) {
        res.render("login", {
            title: "Log in",
            messages: req.flash("error")
        })
    } else {
        return res.redirect("/");
    }
}

exports.logout = function (req, res) {
    req.logout();
    res.redirect("/");
}

exports.saveOAuthUserProfile = function (req, profile, done) {
    console.log(profile)
    User.findOne({
        "provider": profile.provider,
        "providerId": profile.providerId
    }, function (err, user) {
        if (err) {
            return done(err);
        } else {
            if (!user) {
                let possibleUsername = profile.username || profile.email ? profile.email.split("@")[0] : "";
                User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
                    profile.username = availableUsername;
                    let user = new User(profile);
                    user.save(function (err) {
                        if (err) {
                            let message = getErrorMessage(err);
                            req.flash("error", message);
                            return res.redirect("/signup");
                        }
                        return done(err, user);
                    });
                });

            } else {
                return done(err, user);
            }
        }

    });
}



// exports.login = function (req, res) {
//     req.checkBody("email", "Invalid email").notEmpty().isEmail();
//     req.sanitizeBody("email").normalizeEmail();
//     const errors = req.validationErrors();
//     if (errors) {
//         res.render("index", {
//             title: "Validation error: " + JSON.stringify(errors),
//             isLoggedIn: false
//         });
//         return;
//     } else {
//         if (req.body.remember === "on") {
//             // keep email and remember me in cookie session
//             req.session.remember = true;
//             req.session.email = req.body.email;
//             // req.sessionOptions.maxAge = 60000;
//             req.session.cookie.maxAge = 60000;
//         }
//         res.render("index", {
//             title: "Logged in as: " + req.body.email,
//             isLoggedIn: true
//         })
//     }
// }

// exports.logout = function (req, res) {
//     // req.session = null;
//     req.session.destroy();
//     res.render("index", {
//         title: "Logout success: " + req.body.email,
//         isLoggedIn: false
//     })
// }