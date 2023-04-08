const { default: mongoose, ObjectId, Mongoose } = require("mongoose");
const User = require("../model/UserModel");
const Ve = require("../model/DatTourModel");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const Grid = require("gridfs-stream");

// let gfs, gridfsBucket;
// const conn = mongoose.connection;
// conn.once("open", function () {
//     gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
//         bucketName: "photos",
//     });
//     // gfs = "ASBCD";
//     gfs = Grid(conn.db, mongoose.mongo);
//     gfs.collection("photos");
//     console.log("GFS ok");
// });
/////////////////////////////////////////////////////////////
const checkPass = async (req, res, next) => {
    try {
        const MaKH = req.dataToken.MaKH;
        const user = await User.findOne({ MaKH: MaKH });
        // return res.status(201).json({ user: req.body.MatKhau });
        if (user && bcrypt.compareSync(req.body.MatKhau, user.MatKhau)) {
            return res.status(201).json({ message: "OK" });
        } else {
            return res.status(201).json({ message: "Sai mật khẩu" });
        }
    } catch (err) {
        next(err);
    }
};
const getUser = async (req, res, next) => {
    try {
        const MaKH = req.dataToken.MaKH;
        // return res.status(201).json({ MaKH });M
        const user = await User.findOne({ MaKH: MaKH });

        const ve = await Ve.find({ MaKH: MaKH });
        if (user) {
            return res.status(201).json({ message: "OK", user, ve });
        }
    } catch (err) {
        next(err);
    }
};
const getUserById = async (req, res, next) => {
    try {
        const { MaKH } = req.params;
        // return res.status(201).json({ MaKH });M
        const user = await User.findOne({ MaKH: MaKH });

        const ve = await Ve.find({ MaKH: MaKH });
        if (user) {
            return res.status(201).json({ message: "OK", user, ve });
        }
    } catch (err) {
        next(err);
    }
};
const getAllUser = async (req, res, next) => {
    try {
        const userList = await User.find({});
        if (userList) {
            return res.status(201).json({ message: "OK", userList });
        }
    } catch (err) {
        return res.status(201).json({ message: "Err" });
        next(err);
    }
};

// const createUser = async (req, res, next) => {
//     try {
//         const MaKH = "KH" + ((await User.find({})).length + 1);
//         const check = await Account.find({ SdtKH: req.SdtKH });
//         if (!check) {
//             const data = req.body;
//             data.MaKH = MaKH;
//             data.MaTK = MaTK;
//             const newUser = await User.create(data);
//             const newAccount = await Account.create(data);
//             return res
//                 .status(201)
//                 .json({ message: "Thanh cong", newUser, newAccount });
//         } else {
//             return res.status(201).json({ message: "Sdt da ton tai" });
//         }
//     } catch (err) {
//         next(err);
//     }
// };
const updateUser = async (req, res, next) => {
    try {
        const MaKH = req.dataToken.MaKH;
        const user = await User.findOne({ MaKH: MaKH });
        // await gfs.files.deleteOne({ filename: user.Img });
        var updateData = req.body;
        var imgLink;
        if (req.file) {
            var img = req.file.filename;
            try {
                if (user.Img != "default.png") {
                    fs.unlinkSync(`${process.env.FOLDER_IMG}/${user.Img}`);
                }
            } catch (error) {}
            updateData.Img = img;
            imgLink = process.env.ORIGIN_URL + "img/" + req.file.filename;
        } else {
            imgLink = process.env.ORIGIN_URL + "img/" + user.Img;
        }

        const result = await User.findOneAndUpdate({ MaKH: MaKH }, updateData);
        if (result)
            return res.status(201).json({
                message: "OK",
                result,
                imgLink: imgLink,
            });
        return res.status(301).json({ message: "Loi updateUser" });
    } catch (err) {
        next(err);
    }
};
const deleteUserById = async (req, res, next) => {
    try {
        const { MaKH } = req.params;
        const isAdmin = req.isAdmin;
        if (isAdmin) {
            const ve = await Ve.find({ MaKH: MaKH, TinhTrang: "GD3" });
            if (ve.length > 0) {
                return res.status(201).json({
                    message: "Chưa thể xóa vì user này còn vé đang hoạt động",
                });
            }
            await Ve.findOneAndRemove({ MaKH: MaKH });
            await User.findOneAndRemove({ MaKH: MaKH });
            return res.status(201).json({ message: "OK" });
            // await user.remove();
            // await ve.remove();
        }
        return res.status(201).json({ message: "Làm Admin rồi mới được xóa" });
    } catch (err) {
        next(err);
    }
};
const deleteUser = async (req, res, next) => {
    try {
        const MaKH = req.dataToken.MaKH;
        const user = User.findOneAndRemove({ MaKH: MaKH });
        const ve = Ve.findOneAndRemove({ MaKH: MaKH });
        await user.remove();
        await ve.remove();
        return res
            .clearCookie("access_token")
            .status(201)
            .json({ message: "OK" });
    } catch (err) {
        next(err);
    }
};
const changePassUser = async (req, res, next) => {
    try {
        const MaKH = req.dataToken.MaKH;
        const user = await User.findOne({ MaKH: MaKH });
        if (user) {
            const newPass = bcrypt.hashSync(req.body.MatKhau);
            await user.updateOne({ MatKhau: newPass });
            await user.save();
            return res.status(201).json({ message: "OK" });
        }
        return res.status(201).json({ message: "Lỗi" });
    } catch (err) {
        next(err);
    }
};

// const createAccount = async (req, res, next) => {
//     try {
//         const newAccount = await new Account(req.body);
//         await newAccount.save();
//         return res.status(201).json({ message: "Thanh cong", newAccount });
//     } catch (err) {
//         next(err);
//     }
// };
// const deleteAccount = async (req, res, next) => {
//     try {
//         const { accountId } = req.params;
//         const account = Account.findOne({ MaTK: accountId });
//         const user = User.findOne({ MaTK: accountId });
//         await user.remove();
//         await account.remove();
//         return res.status(201).json({ message: "Thanh cong" });
//     } catch (err) {
//         next(err);
//     }
// };

module.exports = {
    getUser,
    changePassUser,
    getUserById,
    deleteUser,
    getAllUser,
    updateUser,
    deleteUserById,
    checkPass,
};
