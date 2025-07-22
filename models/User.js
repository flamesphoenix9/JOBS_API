const mongoose = require("mongoose")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name rquired"],
        minlength: 3,
        maxlength:30,
    },
    email: {
        type: String,
        required: [true, "Provide email addess"],
        unique: true, 
        match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],},

    password: {
        type: String,
        required: [true, "password rquired"],
        minlength: 6,
    },
})

const JWT_SECRET = process.env.JWT_SECRET;

UserSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.getName = function () {
    return this.name;
};

UserSchema.methods.createJWT = function () {
    const token = jwt.sign({ userID: this._id, name: this.name }, JWT_SECRET, { expiresIn: "30d" });
    return token;
};

UserSchema.methods.comparePassword = async function(candidatePassword) {
    const ismatch = bcrypt.compare(candidatePassword, this.password)
    return ismatch;
}

module.exports = mongoose.model("User", UserSchema);