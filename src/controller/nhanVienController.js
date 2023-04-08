const { default: mongoose } = require("mongoose");
const NhanVien = require("../model/NhanVienModel");
const Tour = require("../model/TourModel");

const getAllNhanVien = async (req, res, next) => {
    const listNhanVien = await NhanVien.find({});
    if (listNhanVien.length > 0) {
        return res.status(201).json({ message: "OK", listNhanVien });
    }
    return res.status(201).json({ message: "Ko cos du lieu" });
};
const createNhanVien = async (req, res, next) => {
    const data = req.body;
    data.MaHDVien = new mongoose.Types.ObjectId();
    const listNhanVien = await NhanVien.create(data);
    if (listNhanVien) {
        return res.status(201).json({ message: "OK", listNhanVien });
    }
    return res.status(201).json({ message: "Ko cos du lieu" });
};

const getNhanVien = async (req, res, next) => {
    const { idNhanVien } = req.params;
    const nhanVien = await NhanVien.find({ MaHDVien: idNhanVien });
    if (!nhanVien) return res.status(201).json({ message: "Ko co du lieu" });
    return res.status(201).json({ message: "OK", nhanVien });
};
const updateNhanVien = async (req, res, next) => {
    const { idNhanVien } = req.params;
    const data = req.body;
    const nhanVien = await NhanVien.findOneAndUpdate(
        { MaHDVien: idNhanVien },
        data
    );
    if (!nhanVien) return res.status(201).json({ message: "Ko co du lieu" });
    return res.status(201).json({ message: "OK", nhanVien });
};
const deleteNhanVien = async (req, res, next) => {
    const { idNhanVien } = req.params;
    const listTour = await Tour.find({ MaHDVien: idNhanVien });
    if (listTour.length)
        return res
            .status(201)
            .json({ message: "Đang có nhân viên nhận Tour!" });
    const nhanVien = await NhanVien.findOneAndDelete({ MaHDVien: idNhanVien });
    if (nhanVien) return res.status(201).json({ message: "OK" });
};

module.exports = {
    getAllNhanVien,
    getNhanVien,
    deleteNhanVien,
    updateNhanVien,
    createNhanVien,
};
