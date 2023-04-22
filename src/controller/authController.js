const User = require("../model/UserModel");
const { signUpValidation, loginValidation } = require("../auth/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
require("dotenv").config();
// import thư viện

const checkUserExists = async (req, res, next) => {// req hàm người dùng gửi lên, res trả về cho người dùng , next chuyển qua app.js hàm báo lỗi
    try {
        const Sdt = req.body.Sdt;// lấy sdt người dùng gửi lên
        // await User.findOneAndDelete({ Sdt: Sdt });
        // return res.json("OK");
        const user = await User.findOne({ Sdt: Sdt });// lấy thông tin người dùng bằng sdt
        if (!user) {//nếu không tồn tại người dùng
            console.log("OK");///// thì oke ở console
            return res.status(201).json({ message: "OK" });//in ra ở màn hình ok
        }
        return res.status(201).json({ message: "Số điện thoại đã tồn tại" });
    } catch (err) {//bắt lỗi
        next(err);//trả về hàm xử lý lỗi ở app.js
    }
};
const createUser = async (req, res, next) => {//đăng ký người dùng
    try {
        const { error } = signUpValidation(req.body);//kiểm dữ liệu gửi lên
        if (error) return res.status(401).send(error.details[0].message);//nếu lỗi thì 
        const check = await User.findOne({ Sdt: req.body.Sdt });// truy vấn người dùng bằng sdt người dùng gửi lên
        var MaKH;
        if (!check) {//nếu người dùng không tồn tại thì tạo acc mới 
            // await User.findOne({})
            //     .sort({ MaKH: "desc" })
            //     .then((last) => {
            //         if (last) MaKH = last.MaKH + 1;
            //         else MaKH = 1;
            //     });
            // const salt = await bcrypt.genSalt(10);
            const data = req.body;//thông tin người dùng gửi lên
            const hashPass = bcrypt.hashSync(req.body.MatKhau);//mã hóa mật khẩu
            data.MaKH = new mongoose.Types.ObjectId();//tạo mã khách hàng
            data.MatKhau = hashPass;// ghi đè mật khẩu của người dùng bằng mật khấu mã hóa

            const newUser = await User.create(data);// tạo user
            const token = jwt.sign(//tạo accsec token để lưu thông tin người dùng
                { MaKH: newUser.MaKH, Sdt: newUser.Sdt },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "12h",// thời hạn của token
                }
            );
            data.token = token;//trả về token cho người dùng

            return res//trả về dữ liệu cho người dùng
                .cookie("access_token", token, { httpOnly: false })//thiết lập cookie cho người dùng(httpOnly:false)
                .status(201)//trả về trạng thái http
                .json({ message: "OK", data, newUser });//trar về dữ liệu cho người dùng ở định dạng json
        } else {
            return res.status(201).json({ message: "Sdt da ton tai" });//trả về trạng thái http
        }
    } catch (err) {
        next(err);
    }
};
const loginUser = async (req, res, next) => {
    try {
        const { error } = loginValidation(req.body);//kiem tra dữ liệu người dùng đưa lên
        var isAdmin = false;
        if (error) return res.status(400).send(error.details[0].message);// nếu lỗi thì trả về lỗi 400
        const user = await User.findOne({//truy vấn lấy user từ csdl
            Sdt: req.body.Sdt,//lấy bằng sdt người dùng đưa lên
        });

        if (user && bcrypt.compareSync(req.body.MatKhau, user.MatKhau)) {//nếu mà user tồn tại và mk trùng khớp
            if (user.Level == 3) {//là admin
                res.cookie("isAdmin", true, { httpOnly: false });//cho phép người dùng truy cập tới token
                isAdmin = true;
            }
            const token = jwt.sign(//người dùng
                { MaKH: user.MaKH, Sdt: user.Sdt, isAdmin: isAdmin },
                process.env.TOKEN_KEY,//mã bí mật trong env
                {
                    expiresIn: "7d",//hạn tolen 7 ngày
                }
            );
            data = user.toJSON();//chuyển đối tượng user thành kiểu json
            data.token = token;//thèn token trong biến data
            return res
                .cookie("access_token", token, {
                    httpOnly: false,
                    // secure: process.env.NODE_ENV === "production",
                })
                .status(201)
                .json({ message: "OK", data });
        } else {//kiểm tra có lỗi thì xóa cookie
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
const logOutUser = async (req, res, next) => {/// xóa cookie
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
const checkAdmin = async (req, res, next) => {
    try {
        const isAdmin = req.dataToken.isAdmin;
        if (isAdmin)
            return res.status(200).json({ message: "OK", data: req.dataToken });
        return res.status(200).json({ message: "Not admin" });
    } catch (err) {
        next(err);
    }
};
module.exports = {
    checkAdmin,
    createUser,
    loginUser,
    logOutUser,
    checkUserExists,
};
