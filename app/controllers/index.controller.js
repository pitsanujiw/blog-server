exports.render = function(req, res) {
    /* 
        remember me use express session 
    */
    // let isLoggedIn = false;
    // if (req.session.remember === true) {
    //     // เคย login แล้ว
    //     isLoggedIn = true;
    // }
    // res.render("index", { 
    //     title: "Welcome blog", isLoggedIn: isLoggedIn
    // });
    res.render("index", {
        title: "Welcome blog",
        userName: req.user ? req.user.userName : null
    })
}