const { default: mongoose } = require("mongoose");
const DatTour = require("../model/DatTourModel");
const Tour = require("../model/TourModel");

const getAllTicket = async (req, res, next) => {
    const listTicket = await DatTour.find({});
    if (listTicket) return res.status(201).json({ listTicket });
    return res.status(201).json({ message: "Ko co du lieu" });
};
const getUserTicket = async (req, res, next) => {
    const MaKH = req.dataToken.MaKH;
    const { filter } = req.params;
    // return res.status(201).json({ filter });
    var data = [];
    var listTicket;
    if (filter == "all") listTicket = await DatTour.find({ MaKH: MaKH });
    else listTicket = await DatTour.find({ MaKH: MaKH, TinhTrang: filter });
    for (var i = 0; i < listTicket.length; i++) {
        const tour = await Tour.findOne({ MaTour: listTicket[i].MaTour });
        data.push({
            ticket: listTicket[i],
            tour,
        });
    }
    if (listTicket) return res.status(201).json({ message: "OK", data });
    return res.status(201).json({ message: "Ko co du lieu" });
};
const newTicket = async (req, res, next) => {
    // return res.status(201).json({ message:  });
    const MaKH = req.dataToken.MaKH;
    const checkBooked = await DatTour.findOne({
        MaTour: req.body.MaTour,
        MaKH: MaKH,
    });
    if (checkBooked) {
        return res.status(201).json({ message: "Bạn đã đặt tour này rồi" });
    }
    const tour = await Tour.findOne({ MaTour: req.body.MaTour });
    const SoLuongCon = tour.SoLuong - req.body.SLNguoi;
    if (SoLuongCon < 0) {
        return res.status(201).json({ message: "Số lượng đặt quá giới hạn" });
    }
    await tour.updateOne({ SoLuong: SoLuongCon });
    tour.save();

    const data = req.body;

    data.MaKH = MaKH;
    data.MaVe = new mongoose.Types.ObjectId();
    const newTicket = await DatTour.create(data);
    if (newTicket)
        return res.status(201).json({ message: "OK", newTicket, SoLuongCon });
    return res.status(201).json({ message: "Loi dat tour" });
};
const deleteTicketByUser = async (req, res, next) => {
    const MaKH = req.dataToken.MaKH;
    const { MaVe } = req.params;
    const ticket = await DatTour.findOne({ MaKH: MaKH, MaVe: MaVe });
    if (ticket) {
        if (ticket.TinhTrang == "CD") {
            const tour = await Tour.findOne({ MaTour: ticket.MaTour });
            await tour.updateOne({ SoLuong: tour.SoLuong + ticket.SLNguoi });
            await tour.save();
            await ticket.remove();
            return res.status(201).json({ message: "OK" });
        } else {
            return res.status(201).json({ message: "Vé đã được duyệt" });
        }
    }
    return res.status(201).json({ message: "Không có dữ liệu" });
};
// const updateTicket = async (req, res, next) => {
//     const data = req.body;
//     data.MaVe = new mongoose.Types.ObjectId();
//     const newTicket = await DatTour.create(data);
//     if (newTicket) return res.status(201).json({ message: "OK", data });
// };
module.exports = { getAllTicket, getUserTicket, newTicket, deleteTicketByUser };
