const { default: mongoose, ObjectId, Mongoose } = require("mongoose");
const User = require("../model/UserModel");
const Ve = require("../model/DatTourModel");
const fs = require("fs");

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
const getUser = async (req, res, next) => {
    try {
        const MaKH = req.dataToken.MaKH;
        // return res.status(201).json({ MaKH });M
        const user = await User.findOne({ MaKH: MaKH });
        const ve = await Ve.find({ MaKH: MaKH });
        if (user) {
            return res.status(201).json({ user, ve });
        }
    } catch (err) {
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
        try {
            fs.unlinkSync(`${process.env.FOLDER_IMG}/${user.Img}`);
        } catch (error) {}

        const updateData = req.body;
        const img = req.file.filename;
        updateData.Img = img;
        const result = await User.findOneAndUpdate({ MaKH: MaKH }, updateData);
        if (result)
            return res.status(201).json({
                message: "OK",
                result,
                imgLink: process.env.ORIGIN_URL + "img/" + req.file.filename,
            });
        return res.status(301).json({ message: "Loi updateUser" });
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
            .json({ message: "Thanh cong" });
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
    // createUser,
    // createAccount,
    // deleteAccount,
    // loginUser,
    deleteUser,
    updateUser,
};
