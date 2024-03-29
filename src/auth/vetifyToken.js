const jwt = require("jsonwebtoken");
const User = require("../model/UserModel");

const config = process.env;

const verifyToken = async (req, res, next) => {
    const token =
        req.body.token ||
        req.cookies.access_token ||
        req.headers["x-access-token"];
    const isAdmin =
        req.body.token || req.cookies.isAdmin || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const dateNow = new Date();
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        if (isAdmin) req.isAdmin = isAdmin;

        req.dataToken = decoded;
    } catch (err) {
        return res
            .clearCookie("access_token")
            .clearCookie("isAdmin")
            .status(401)
            .send("Invalid Token");
    }
    return next();
};

module.exports = verifyToken;
