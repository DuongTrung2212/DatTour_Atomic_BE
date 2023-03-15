const { default: mongoose, ObjectId, Mongoose } = require("mongoose");
const User = require("../model/UserModel");
const Ve = require("../model/DatTourModel");

const uploadImgUser = async (req, res, next) => {
    const { MaKH } = req.params;
    return res.send(req.file);
    const user = await User.findOne({ MaKH: MaKH });
};

module.exports = {
    uploadImgUser,
};
