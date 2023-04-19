const User = require("../model/UserModel");
const { signUpValidation, loginValidation } = require("../auth/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

const checkUserExists = async (req, res, next) => {
    try {
        const Sdt = req.body.Sdt;
        // await User.findOneAndDelete({ Sdt: Sdt });
        // return res.json("OK");
        const user = await User.findOne({ Sdt: Sdt });
        if (!user) {
            console.log("OK");
            return res.status(201).json({ message: "OK" });
        }
        return res.status(201).json({ message: "Số điện thoại đã tồn tại" });
    } catch (err) {
        next(err);
    }
};
const createUser = async (req, res, next) => {
    try {
        const { error } = signUpValidation(req.body);
        if (error) return res.status(401).send(error.details[0].message);
        const check = await User.findOne({ Sdt: req.body.Sdt });
        var MaKH;
        if (!check) {
            // await User.findOne({})
            //     .sort({ MaKH: "desc" })
            //     .then((last) => {
            //         if (last) MaKH = last.MaKH + 1;
            //         else MaKH = 1;
            //     });
            // const salt = await bcrypt.genSalt(10);
            const data = req.body;
            const hashPass = bcrypt.hashSync(req.body.MatKhau);
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

            return res
                .cookie("access_token", token, { httpOnly: false })
                .status(201)
                .json({ message: "OK", data, newUser });
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
        var isAdmin = false;
        if (error) return res.status(400).send(error.details[0].message);
        const user = await User.findOne({
            Sdt: req.body.Sdt,
        });

        if (user && bcrypt.compareSync(req.body.MatKhau, user.MatKhau)) {
            if (user.Level == 3) {
                res.cookie("isAdmin", true, { httpOnly: false });
                isAdmin = true;
            }
            const token = jwt.sign(
                { MaKH: user.MaKH, Sdt: user.Sdt, isAdmin: isAdmin },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "30s",
                }
            );
            data = user.toJSON();
            data.token = token;
            return res
                .cookie("access_token", token, {
                    httpOnly: false,
                    // secure: process.env.NODE_ENV === "production",
                })
                .status(201)
                .json({ message: "OK", data });
        } else {
            return res
                .clearCookie("access_token")
                .clearCookie("isAdmin")
                .status(201)
                .json({ message: "Sai TK hoac MK" });
        }
    } catch (err) {
        next(err);
    }
};
const logOutUser = async (req, res, next) => {
    try {
        return res
            .clearCookie("access_token")
            .clearCookie("isAdmin")
            .status(200)
            .json({ message: "OK" });
        // .end();
    } catch (err) {
        next(err);
    }
};
module.exports = { createUser, loginUser, logOutUser, checkUserExists };
