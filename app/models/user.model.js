const mongoose = require("mongoose");
const crypto = require("crypto");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    userName: {
        type: String,
        unique: true,
        trim: true,
        required: "Username is require"
    },
    email: {
        type: String,
        index: true
        // match: /.+\@.+\.+/ /* check regular expression */
    },
    password: String,
    salt: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now()
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    provider: {     // type of strategy
        type: String,
        required: "Provider is require"
    },
    providerId: String, // OAuth id
    providerData: {}
});

UserSchema.pre("save", function (next) {
    if (this.password) {
        this.salt = new Buffer(crypto.randomBytes(16).toString("base64"), "base64");
        this.password = this.hashPassword(this.password);
    }
    next();
});

UserSchema.methods.hashPassword = function (password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64, "sha1").toString("base64");
}

UserSchema.methods.authenticate = function (password) {
    console.log(password, this.password);
    return this.password === this.hashPassword(password);
}

mongoose.model("User", UserSchema);