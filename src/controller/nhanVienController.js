const { default: mongoose } = require("mongoose");
const NhanVien = require("../model/NhanVienModel");
const Tour = require("../model/TourModel");

const getAllNhanVien = async (req, res, next) => {//lấy tất cả thông tin nhân viên
    const isAdmin = req.dataToken.isAdmin;
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
const getAllNhanVienFreeTime = async (req, res, next) => {//láy tất cả nhân viên chưa được nhận tour
    try {
        const isAdmin = req.dataToken.isAdmin;
        if (!isAdmin)
            return res
                .status(401)
                .json({ message: "Chỉ Admin mới sử dụng được quyền này" });
        const listNhanVien = await NhanVien.find({});
        var response = [];
        for (let index = 0; index < listNhanVien.length; index++) {
            const check = await Tour.findOne({
                MaHDVien: listNhanVien[index].MaHDVien,
                TinhTrang: true,
            });
            if (!check) response.push(listNhanVien[index]);
        }
        if (response.length > 0) {
            return res
                .status(201)
                .json({ message: "OK", listNhanVien: response });
        }
        return res.status(201).json({ message: "Ko có dữ liệu" });
    } catch (err) {
        next(err);
    }
};
const createNhanVien = async (req, res, next) => {//tạo mới nhân viên
    const isAdmin = req.dataToken.isAdmin;
    if (!isAdmin)
        return res
            .status(401)
            .json({ message: "Chỉ Admin mới sử dụng được quyền này" });

    const check = await NhanVien.find({ SdtNV: req.body.SdtNV });
    if (check.length > 0)
        return res.status(201).json({ message: "Số điện thoại đã tồn tại" });
    const data = req.body;
    data.MaHDVien = new mongoose.Types.ObjectId();
    const nhanVien = await NhanVien.create(data);
    if (nhanVien) {
        return res.status(201).json({ message: "OK", nhanVien });
    }
    return res.status(201).json({ message: "Ko cos du lieu" });
};

const getNhanVien = async (req, res, next) => {//lấy nhân viên bằng id
    const { idNhanVien } = req.params;
    const nhanVien = await NhanVien.findOne({ MaHDVien: idNhanVien });
    if (!nhanVien) return res.status(201).json({ message: "Ko co du lieu" });
    return res.status(201).json({ message: "OK", nhanVien });
};
const updateNhanVien = async (req, res, next) => {// cập nhật nhân viên
    const isAdmin = req.dataToken.isAdmin;
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
const deleteNhanVien = async (req, res, next) => {// xóa nhân viên
    try {
        const isAdmin = req.dataToken.isAdmin;
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

module.exports = {// export hàm ra ngoài để sử dụng
    getAllNhanVienFreeTime,
    getAllNhanVien,
    getNhanVien,
    deleteNhanVien,
    updateNhanVien,
    createNhanVien,
};
