const { default: mongoose } = require("mongoose");
const DatTour = require("../model/DatTourModel");
const Tour = require("../model/TourModel");
const User = require("../model/UserModel");

const getAllTicket = async (req, res, next) => {
    // lấy tất cả vé
    try {
        const listTour = await Tour.find({ TinhTrang: true });
        let data = [];
        for (let index = 0; index < listTour.length; index++) {
            const listTicket = await DatTour.find({
                MaTour: listTour[index].MaTour,
                TinhTrang: {
                    $in: ["DD", "CD"],
                },
            });

            if (listTicket.length > 0) {
                const ticketAndUser = [];
                for (let index = 0; index < listTicket.length; index++) {
                    const user = await User.findOne({
                        MaKH: listTicket[index].MaKH,
                    });
                    ticketAndUser.push({ ticket: listTicket[index], user });
                }
                data.push({ tour: listTour[index], listTicket: ticketAndUser });
            }
        }

        if (data.length > 0) {
            return res.status(201).json({ message: "OK", data });
        }
        return res.status(201).json({ message: "Ko co du lieu" });
    } catch (err) {
        next(err);
    }
};
const getUserTicket = async (req, res, next) => {
    //lấy vé người dùng
    try {
        const MaKH = req.dataToken.MaKH;
        const { filter } = req.params;
        // return res.status(201).json({ filter });
        var data = [];
        var listTicket;
        if (filter == "all") listTicket = await DatTour.find({ MaKH: MaKH });
        else listTicket = await DatTour.find({ MaKH: MaKH, TinhTrang: filter });
        // for (var i = 0; i < listTicket.length; i++) {
        //     const tour = await Tour.findOne({ MaTour: listTicket[i].MaTour });
        //     data.push({
        //         ticket: listTicket[i],
        //         tour,
        //     });
        // }
        if (listTicket)
            return res.status(201).json({ message: "OK", data: listTicket });
        return res.status(201).json({ message: "Ko co du lieu" });
    } catch (err) {
        next(err);
    }
};
const updateTicket = async (req, res, next) => {
    // cập nhật vé
    try {
        const { MaVe } = req.params; //lấy id trên đường link
        const ticket = await DatTour.findOneAndUpdate({ MaVe: MaVe }, req.body); //cập nhật trong csdl
        if (ticket) {
            if (req.body.TinhTrang === "TC") {
                const tour = await Tour.findOne({ MaTour: ticket.MaTour });
                await tour.updateOne({
                    SoLuong: tour.SoLuong + ticket.SLNguoi,
                });
            }
            return res.status(201).json({ message: "OK", ticket });
        }
        return res.status(401).json({ message: "Ko co du lieu" });
    } catch (err) {
        next(err);
    }
};
const newTicket = async (req, res, next) => {
    //đặt vé
    // return res.status(201).json({ message:  });
    try {
        const MaKH = req.dataToken.MaKH;
        const checkBooked = await DatTour.findOne({
            MaTour: req.body.MaTour,
            MaKH: MaKH,
            TinhTrang: {
                $in: ["DD", "CD", "TC"],
            },
        });
        if (checkBooked) {
            return res.status(201).json({ message: "Bạn đã đặt tour này rồi" });
        }
        const tour = await Tour.findOne({ MaTour: req.body.MaTour });
        const SoLuongCon = tour.SoLuong - req.body.SLNguoi;
        if (SoLuongCon < 0) {
            return res
                .status(201)
                .json({ message: "Số lượng đặt quá giới hạn" });
        }
        await tour.updateOne({ SoLuong: SoLuongCon });
        tour.save();

        const data = req.body;
        data.Tour = tour;
        data.MaKH = MaKH;
        data.MaVe = new mongoose.Types.ObjectId();
        const newTicket = await DatTour.create(data); //thêm dữ liệu mới vô csdl
        if (newTicket) {
            return res
                .status(201)
                .json({ message: "OK", newTicket, SoLuongCon });
        }
        return res.status(201).json({ message: "Loi dat tour" });
    } catch (err) {
        next(err);
    }
};
const deleteTicketByUser = async (req, res, next) => {
    //xóa vé từ người dùng
    try {
        const MaKH = req.dataToken.MaKH;
        if (!MaKH)
            return res.status(201).json({ message: "Vui lòng kiểm tra lại" });
        const { MaVe } = req.params;
        const ticket = await DatTour.findOne({ MaKH: MaKH, MaVe: MaVe });
        if (ticket) {
            if (ticket.TinhTrang == "CD" || ticket.TinhTrang == "TC") {
                if (ticket.TinhTrang == "CD") {
                    const tour = await Tour.findOne({ MaTour: ticket.MaTour });
                    await tour.updateOne({
                        SoLuong: tour.SoLuong + ticket.SLNguoi,
                    });
                    await tour.save();
                }
                await ticket.remove();
                return res.status(201).json({ message: "OK" });
            } else {
                return res.status(201).json({ message: "Vé đã được duyệt" });
            }
        }
        return res.status(201).json({ message: "Không có dữ liệu" });
    } catch (err) {
        next(err);
    }
};
const deleteTicketByAdmin = async (req, res, next) => {
    //xóa vé từ admin
    try {
        const { MaVe } = req.params;
        const ticket = await DatTour.findOne({ MaVe: MaVe });
        if (ticket) {
            const tour = await Tour.findOne({ MaTour: ticket.MaTour });
            await tour.updateOne({ SoLuong: tour.SoLuong + ticket.SLNguoi });
            await History.findOneAndDelete({ "DatTour.MaVe": ticket.MaVe });
            await tour.save();
            await ticket.remove();
            return res.status(201).json({ message: "OK" });
        }
        return res.status(201).json({ message: "Không có dữ liệu" });
    } catch (err) {
        next(err);
    }
};
const updateAllTicket = async (req, res, next) => { //cập nhật toàn bộ vé của 1 tour
    try {
        const MaTour = req.body.MaTour; 
        const checkTourOK = await DatTour.findOne({
            MaTour: MaTour,
            TinhTrang: "CD",
        });
        if (checkTourOK) {
            return res
                .status(201)
                .json({ message: "Có vé vẫn đang chờ duyệt" });
        }
        const listTicket = await DatTour.updateMany(
            {
                MaTour: MaTour,
                TinhTrang: "DD", 
            },
            { TinhTrang: "HT" }
        );
        if (listTicket) {
            await Tour.updateOne({ MaTour }, { TinhTrang: false });
            return res.status(201).json({ message: "OK", listTicket });
        }
    } catch (err) {
        next(err);
    }
};
module.exports = {
    getAllTicket,
    updateTicket,
    getUserTicket,
    newTicket,
    deleteTicketByUser,
    deleteTicketByAdmin,
    updateAllTicket,
};
