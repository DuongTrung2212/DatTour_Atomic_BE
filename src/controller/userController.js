const { default: mongoose, ObjectId, Mongoose } = require("mongoose");
const User = require("../model/UserModel");
const DatTour = require("../model/DatTourModel");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const Grid = require("gridfs-stream");
const Tour = require("../model/TourModel");

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
const checkPass = async (req, res, next) => {// kiểm tra mật khẩu
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
const getUser = async (req, res, next) => {// lấy thông tin người dùng
    try {
        const MaKH = req.dataToken.MaKH;
        // return res.status(201).json({ MaKH });M
        const user = await User.findOne({ MaKH: MaKH });

        const ve = await DatTour.find({ MaKH: MaKH });
        if (user) {
            return res.status(201).json({ message: "OK", user, ve });
        }
    } catch (err) {
        next(err);
    }
};
const getUserById = async (req, res, next) => {// lấy user bằng id
    try {
        const { MaKH } = req.params;
        // return res.status(201).json({ MaKH });M
        const user = await User.findOne({ MaKH: MaKH });

        const ve = await DatTour.find({ MaKH: MaKH });
        if (user) {
            return res.status(201).json({ message: "OK", user, ve });
        }
    } catch (err) {
        next(err);
    }
};
const getAllUser = async (req, res, next) => {// lấy tất cả user
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

const updateUser = async (req, res, next) => {// cập nhật user
    try {
        const MaKH = req.dataToken.MaKH;
        const user = await User.findOne({ MaKH: MaKH });
        // await gfs.files.deleteOne({ filename: user.Img });
        var updateData = req.body;
        if (req.body.MatKhau) {
            const hashPass = bcrypt.hashSync(req.body.MatKhau);
            req.body.MatKhau = hashPass;
        }
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
const deleteUserById = async (req, res, next) => {// xóa người dùng bằng id
    try {
        const { MaKH } = req.params;
        if (MaKH == req.dataToken.MaKH)// lấy mã KH qua token
            return res.status(201).json({
                message: "Ko thể xóa chính mình",
            });
        const isAdmin = req.dataToken.isAdmin;
        if (isAdmin) {
            const ve = await DatTour.find({ MaKH: MaKH, TinhTrang: "GD3" });
            if (ve.length > 0) {
                return res.status(201).json({
                    message: "Chưa thể xóa vì user này còn vé đang hoạt động",
                });
            }
            const listTicketUser = await DatTour.find({
                MaKH: MaKH,
                TinhTrang: {
                    $in: ["DD", "CD"],
                },
            });
            if (listTicketUser.length > 0) {
                return res.status(201).json({
                    message: "Khách hàng này đang có 1 số đơn chờ duyệt",
                });
            }
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
const deleteUser = async (req, res, next) => {// xóa người dùng dựa trên token
    try {
        const MaKH = req.dataToken.MaKH;
        const user = User.findOneAndRemove({ MaKH: MaKH });
        const ve = DatTour.findOneAndRemove({ MaKH: MaKH });
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
const changePassUser = async (req, res, next) => {// đổi mk người dùng
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
const changePassUserByNumber = async (req, res, next) => {// đổi sdt
    try {
        const Sdt = req.body.Sdt;
        const user = await User.findOne({ Sdt: Sdt });
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
    changePassUserByNumber,
};
