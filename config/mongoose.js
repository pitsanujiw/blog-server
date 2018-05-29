const config = require("./config");
const mongoose = require("mongoose");

module.exports = function () {
    mongoose.set("debug", config.debug);
    const db = mongoose.connect(config.mongoURI, function (err) {
        if (err) return err;
    });

    require("../app/models/user.model");
    
    return db;
}