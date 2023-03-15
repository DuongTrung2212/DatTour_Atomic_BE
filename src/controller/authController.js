const User = require("../model/UserModel");
const { signUpValidation, loginValidation } = require("../auth/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
require("dotenv").config();
const createUser = async (req, res, next) => {
    try {
        const { error } = signUpValidation(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        const check = await User.findOne({ Sdt: req.body.Sdt });
        var MaKH;
        if (!check) {
            // await User.findOne({})
            //     .sort({ MaKH: "desc" })
            //     .then((last) => {
            //         if (last) MaKH = last.MaKH + 1;
            //         else MaKH = 1;
            //     });
            const salt = await bcrypt.genSalt(10);
            const data = req.body;
            const hashPass = await bcrypt.hash(req.body.MatKhau, salt);
            data.MaKH = new mongoose.Types.ObjectId();
            data.MatKhau = hashPass;
            const newUser = await User.create(data);
            const token = jwt.sign(
                { MaKH: newUser.MaKH, Sdt: newUser.Sdt },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "12h",
                }
            );
            data.token = token;

            return res.status(201).json({ message: "Thanh cong", data });
        } else {
            return res.status(201).json({ message: "Sdt da ton tai" });
        }
    } catch (err) {
        next(err);
    }
};
const loginUser = async (req, res, next) => {
    try {
        const { error } = loginValidation(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        const user = await User.findOne({
            Sdt: req.body.Sdt,
        });
        if (user && bcrypt.compare(req.body.MatKhau, user.MatKhau)) {
            const token = jwt.sign(
                { MaKH: user.MaKH, Sdt: user.Sdt },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );
            data = user.toJSON();
            data.token = token;
            return res
                .cookie("access_token", token, {
                    httpOnly: true,
                    // secure: process.env.NODE_ENV === "production",
                })
                .status(201)
                .json(data);
        }
        return res.status(400).json({ message: "Sai TK hoac mkl" });
    } catch (err) {
        next(err);
    }
};
const logOutUser = async (req, res, next) => {
    try {
        return res
            .clearCookie("access_token")
            .status(200)
            .json({ message: "Successfully logged out" });
    } catch (err) {
        next(err);
    }
};
module.exports = { createUser, loginUser, logOutUser };
