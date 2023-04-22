const { model, default: mongoose } = require("mongoose");
const Tour = require("../model/TourModel");
const Ve = require("../model/DatTourModel");
const fs = require("fs");
const DatTour = require("../model/DatTourModel");
const NhanVien = require("../model/NhanVienModel");
const getAllTour = async (req, res, next) => {//lấy tất cả các tour
    try {
        const listTour = await Tour.find({});
        if (listTour <= 0) {
            return res.status(201).json({
                message: "ko co du lieu",
            });
        }

        return res.status(201).json({ message: "OK", listTour });
    } catch (err) {
        next(err);
    }
};

const tourSearch = async (req, res, next) => {//tìm tour
    try {
        const { dataSearch } = req.params;//params là lấy biến ở trong link
        const listSearch = await Tour.find({
            TenTour: {
                $regex: `${dataSearch}`,
                $options: "i",
            },
            // $text: { $search: dataSearch },
        });
        if (listSearch <= 0) {
            return res.status(201).json({
                message: "ko co du lieu",
            });
        }
        return res.status(201).json({ message: "OK", listSearch });
    } catch (err) {
        next(err);
    }
};
const getOpenTour = async (req, res, next) => {//lấy tour đang mở
    try {
        const listTour = await Tour.find({ TinhTrang: true });
        if (listTour <= 0) {
            return res.status(201).json({
                message: "ko co du lieu",
            });
        }
        return res.status(201).json({ message: "OK", listTour });
    } catch (err) {
        next(err);
    }
};
const getCategoryTour = async (req, res, next) => {// lấy tất cả các loại tour
    try {
        const tourTN = await Tour.find({ LoaiTour: "TTN" }).limit(5);
        const tourTQ = await Tour.find({ LoaiTour: "TTQ" }).limit(5);
        const tourBien = await Tour.find({ LoaiTour: "TB" }).limit(5);
        if (tourBien <= 0 && tourTQ <= 0 && tourTN <= 0) {
            return res.status(201).json({
                message: "ko co du lieu",
            });
        }
        return res
            .status(201)
            .json({ message: "OK", tourTN, tourTQ, tourBien });
    } catch (err) {
        next(err);
    }
};
const getTour = async (req, res, next) => {//lấy chi tiết tour theo id
    try {
        const { tourId } = req.params;
        const tour = await Tour.findOne({ MaTour: tourId });//truy vấn
        const HDVien = await NhanVien.findOne({ MaHDVien: tour.MaHDVien });
        if (tour) {
            return res.status(201).json({ message: "OK", tour, HDVien });
        }
        return res.status(201).json({ message: "ko tim thay" });
    } catch (err) {
        next(err);
    }
};
const newTour = async (req, res, next) => {//tạo tour
    try {
        const idTour = new mongoose.Types.ObjectId();//tạo id
        const tour = req.body;
        const dataTitleMoTa = req.body.titleMoTa;
        const dataConTentMoTa = req.body.contentMoTa;

        var newArrSlide = [];
        var newArrMoTa = [];
        var MoTa = [];
        const listLinkImg = [];
        const listImg = req.files;
        listImg.forEach((item) => {
            if (item.fieldname == "imgMoTa") newArrMoTa.push(item.filename);
            else newArrSlide.push(item.filename);
            listLinkImg.push(`${process.env.ORIGIN_URL}img/${item.filename}`);
        });
        for (var i in newArrMoTa) {
            if (newArrMoTa.length == 1) {
                MoTa.push({
                    title: dataTitleMoTa,
                    img: newArrMoTa[i],
                    content: dataConTentMoTa,
                });
            } else {
                MoTa.push({
                    title: dataTitleMoTa[i],
                    img: newArrMoTa[i],
                    content: dataConTentMoTa[i],
                });
            }
        }
        tour.MaTour = idTour;
        tour.HinhAnh = newArrSlide;
        tour.MoTa = MoTa;

        const newTour = await Tour.create(tour);
        if (newTour) {
            return res
                .status(201)
                .json({ message: "OK", newTour, listLinkImg, tour });
        }
        return res.status(201).json({ message: "Loi" });
    } catch (err) {
        next(err);
    }
};
const updateTour = async (req, res, next) => {// cập nhật tour
    try {
        const { tourId } = req.params;
        const data = req.body;
        const dataTitleMoTa = req.body.titleMoTa;
        const dataConTentMoTa = req.body.contentMoTa;

        var arrayImg = req.files;
        var newArrSlide = [];
        var newArrMoTa = [];
        var MoTa = [];
        const tour = await Tour.findOne({ MaTour: tourId });//findOne : truy vấn csdl
        var oldArrSlide = tour.HinhAnh;
        var oldArrMoTa = tour.MoTa;
        const datTour = await DatTour.find({
            MaTour: tourId,
            TinhTrang: {
                $in: ["DD", "CD"],
            },
        });
        if (datTour.length > 0) {
            return res
                .status(201)
                .json({ message: "Đơn đặt tour vẫn chưa hoàn thành hết" });
        }
        if (arrayImg) {
            arrayImg.forEach((item) => {//forEach là vòng lặp qua mảng img
                if (item.fieldname == "imgMoTa") newArrMoTa.push(item.filename);//piush là thêm vào mảng img
                else newArrSlide.push(item.filename);
            });
        }

        if (newArrSlide.length > 0) {
            oldArrSlide.forEach((nameImg) => {
                try {
                    fs.unlinkSync(`${process.env.FOLDER_IMG}/${nameImg}`);
                } catch (error) {}
            });
        }
        if (newArrMoTa.length > 0) {
            oldArrMoTa.forEach((MoTa) => {
                try {
                    fs.unlinkSync(`${process.env.FOLDER_IMG}/${MoTa.img}`);
                } catch (error) {}
            });
        }
        if (dataTitleMoTa && dataConTentMoTa) {
            for (const i in newArrMoTa) {
                MoTa.push({
                    title: dataTitleMoTa[i],
                    img: newArrMoTa[i],
                    content: dataConTentMoTa[i],
                });
            }
        }

        if (newArrSlide.length > 0) data.HinhAnh = newArrSlide;
        if (MoTa.length > 0) data.MoTa = MoTa;
        const result = await Tour.findOneAndUpdate({ MaTour: tourId }, data);
        if (result) {
            await DatTour.updateMany(
                { MaTour: tourId, TinhTrang: "CD" },
                { Tour: tour }
            );
            return res.status(201).json({ message: "OK", result, data });
        }
        return res.status(401).json({ message: "Loi" });
    } catch (err) {
        next(err);
    }
};
const deleteTour = async (req, res, next) => {// xóa tour
    try {
        const { tourId } = req.params;
        const datTour = await DatTour.find({
            MaTour: tourId,
            TinhTrang: {
                $in: ["DD", "CD"],
            },
        });
        if (datTour.length > 0) {
            return res
                .status(201)
                .json({ message: "Đơn đặt tour vẫn chưa hoàn thành hết" });
        }
        const tour = await Tour.findOne({ MaTour: tourId });
        try {
            tour.HinhAnh.forEach((item) => {
                fs.unlinkSync(`${process.env.FOLDER_IMG}/${item}`);
            });
            tour.MoTa.forEach((item) => {
                fs.unlinkSync(`${process.env.FOLDER_IMG}/${item.img}`);
            });
        } catch (err) {}
        tour.remove();

        return res.status(201).json({ message: "OK", tour });
    } catch (err) {
        next(err);
    }
};
module.exports = {
    getAllTour,
    getOpenTour,
    getTour,
    updateTour,
    deleteTour,
    newTour,
    getCategoryTour,
    tourSearch,
};
