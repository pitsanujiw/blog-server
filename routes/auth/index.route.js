const db = require("../../utility/db");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    if (req.session.isLoggedIn !== undefined && req.session.isLoggedIn === true) {
        res.redirect("/api/auth/profile");
    } else {
        res.redirect("/api/auth/login");
    }
});

router.post("/signup", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    const sql = `INSERT INTO login (login_username, login_password, login_email) VALUES ('${username}', '${password}', '${email}')`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        if (result) {
            res.json({ "status": "success" });
        } else {
            res.json({ "status": "fail" });
        }
    })
})

router.route("/login")
    .get((req, res) => {
        res.send("please login");
    })
    .post((req, res) => {
        const email = req.body.email;
        const password = req.body.password;

        const sql = `SELECT * FROM login WHERE login_email = '${email}' AND login_password = '${password}'`;
        db.query(sql, (err, result, fields) => {
            if (err) throw err;
            if (result.length === 1) {
                req.session.isLoggedIn = true;
                req.session.username = result[0].login_username; // set username in req.session
                res.json({ "status": true, "message": "login success" });
            } else {
                res.json({ "status": false, "message": "email or password invalid" });
            }
        })
    });

router.get("/profile", (req, res) => {
    if (req.session.isLoggedIn !== undefined && req.session.isLoggedIn === true) {
        res.send("Hello: " + req.session.username);
    } else {
        res.send("please login first");
    }
});

router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.json({ "status": true, "message": "logout success" });
    })
})


module.exports = router;
