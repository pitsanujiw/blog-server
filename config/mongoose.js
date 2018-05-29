const config = require("./config");
const mongoose = require("mongoose");

module.exports = function () {
    const db = mongoose.connect(config.mongoURI, function (err) {
        if (err) {
            console.error(err);
            return;
        }
    });
    return db;
}