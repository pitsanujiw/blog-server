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

exports.login = function (req, res) {
    req.checkBody("email", "Invalid email").notEmpty().isEmail();
    req.sanitizeBody("email").normalizeEmail();
    const errors = req.validationErrors();
    if (errors) {
        res.render("index", {
            title: "Validation error: " + JSON.stringify(errors),
            isLoggedIn: false
        });
        return;
    } else {
        if (req.body.remember === "on") {
            // keep email and remember me in cookie session
            req.session.remember = true;
            req.session.email = req.body.email;
            // req.sessionOptions.maxAge = 60000;
            req.session.cookie.maxAge = 60000;
        }
        res.render("index", {
            title: "Logged in as: " + req.body.email,
            isLoggedIn: true
        })
    }
}

exports.logout = function (req, res) {
    // req.session = null;
    req.session.destroy();
    res.render("index", {
        title: "Logout success: " + req.body.email,
        isLoggedIn: false
    })
}

exports.create = function (req, res, next) {
    const userCtrl = new User(req.body);
    userCtrl.save(function (err) {
        if (err) {
            // error because userName is duplicate key
            return next(err);
        } else {
            res.json(userCtrl);
        }
    })
}

exports.list = function (req, res, next) {
    User.find({}, "firstName lastName userName", {}, function (err, users) {
        if (err) {
            return next(err);
        } else {
            res.json(users);
        }
    })
}

exports.read = function (req, res, next) {
    if (req.user === null) {
        res.json(`Username ${req.userName} has not in system. Please register.`);
    } else {
        res.json(req.user)
    }
}

exports.userByUserName = function (req, res, next, userName) {
    User.findOne({ "userName": userName }, function (err, user) {
        if (err) {
            return next(err);
        } else {
            req.userName = userName;
            req.user = user;
            next();
        }
    });
};

exports.update = function (req, res, next) {
    User.findOneAndUpdate({ "userName": req.user.userName }, req.body, function (err, user) {
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
            messagesError: req.flash("error")
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