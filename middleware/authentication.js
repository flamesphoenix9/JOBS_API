const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors")

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        throw new UnauthenticatedError("Authentication Invalid- provide token");
    }    
    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(payload.userID).select("-password");
        req.user = {userId: user._id, name: user.name};
        next()
    } catch (error) {
        throw new UnauthenticatedError("Authentication Invalid-Bad token")
    }
}

module.exports = auth;