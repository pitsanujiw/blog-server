const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    userName: { 
        type: String, 
        unique: true, 
        trim: true,
        required: true
    },
    email: { 
        type: String, 
        index: true
        // match: /.+\@.+\.+/ /* check regular expression */
    },
    password: String,
    created: {
        type: Date,
        default: Date.now()
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    }
});

mongoose.model("User", UserSchema);