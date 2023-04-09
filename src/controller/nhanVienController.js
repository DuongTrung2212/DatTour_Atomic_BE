const { default: mongoose } = require("mongoose");
const NhanVien = require("../model/NhanVienModel");
const Tour = require("../model/TourModel");

const getAllNhanVien = async (req, res, next) => {
    const isAdmin = req.isAdmin;
    if (!isAdmin)
        return res
            .status(401)
            .json({ message: "Chỉ Admin mới sử dụng được quyền này" });
    const listNhanVien = await NhanVien.find({});
    if (listNhanVien.length > 0) {
        return res.status(201).json({ message: "OK", listNhanVien });
    }
    return res.status(201).json({ message: "Ko có dữ liệu" });
};
const getAllNhanVienFreeTime = async (req, res, next) => {
    try {
        const isAdmin = req.isAdmin;
        if (!isAdmin)
            return res
                .status(401)
                .json({ message: "Chỉ Admin mới sử dụng được quyền này" });
        const listNhanVien = await NhanVien.find({});
        listNhanVien.forEach(async (nhanVien, index) => {
            const check = await Tour.findOne({
                MaHDVien: nhanVien.MaHDVien,
                TinhTrang: true,
            });
            if (check) listNhanVien[index].remove();
        });
        if (listNhanVien.length > 0) {
            return res.status(201).json({ message: "OK", listNhanVien });
        }
        return res.status(201).json({ message: "Ko có dữ liệu" });
    } catch (err) {
        next(err);
    }
};
const createNhanVien = async (req, res, next) => {
    const isAdmin = req.isAdmin;
    if (!isAdmin)
        return res
            .status(401)
            .json({ message: "Chỉ Admin mới sử dụng được quyền này" });
    const data = req.body;
    data.MaHDVien = new mongoose.Types.ObjectId();
    const nhanVien = await NhanVien.create(data);
    if (nhanVien) {
        return res.status(201).json({ message: "OK", nhanVien });
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
    const isAdmin = req.isAdmin;
    if (!isAdmin)
        return res
            .status(401)
            .json({ message: "Chỉ Admin mới sử dụng được quyền này" });
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
    try {
        const isAdmin = req.isAdmin;
        if (!isAdmin)
            return res
                .status(401)
                .json({ message: "Chỉ Admin mới sử dụng được quyền này" });
        const { idNhanVien } = req.params;

        const listTour = await Tour.find({ MaHDVien: idNhanVien });
        if (listTour.length > 0)
            return res
                .status(201)
                .json({ message: "Nhân viên này đang nhận tour!" });

        const nhanVien = await NhanVien.findOneAndDelete({
            MaHDVien: idNhanVien,
        });

        if (nhanVien) return res.status(201).json({ message: "OK" });
        return res.status(201).json({ message: "Ko tồn tại nhân viên" });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllNhanVienFreeTime,
    getAllNhanVien,
    getNhanVien,
    deleteNhanVien,
    updateNhanVien,
    createNhanVien,
};
