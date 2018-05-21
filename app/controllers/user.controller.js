exports.login = function(req, res) {
    res.render("index", {
        title: "Logged in as: " + req.body.email,
        isLoggedIn: true
    })
}

exports.logout = function(req, res) {
    res.render("index", {
        title: "Logout success: " + req.body.email,
        isLoggedIn: false
    })
}