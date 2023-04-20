const { default: mongoose } = require("mongoose");
const DatTour = require("../model/DatTourModel");
const Tour = require("../model/TourModel");
const User = require("../model/UserModel");
const Ticket = require("../model/Ticket");

const getAllTicket = async (req, res, next) => {
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
const updateTicket = async (req, res, next) => {
    try {
        const { MaVe } = req.params;
        const ticket = await DatTour.findOneAndUpdate({ MaVe: MaVe }, req.body);
        if (ticket) return res.status(201).json({ message: "OK", ticket });
        return res.status(401).json({ message: "Ko co du lieu" });
    } catch (err) {
        next(err);
    }
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
    if (newTicket) {
        const ticket = await Ticket.create({ Tour: tour, DatTour: newTicket });
        return res.status(201).json({ message: "OK", newTicket, SoLuongCon });
    }
    return res.status(201).json({ message: "Loi dat tour" });
};
const deleteTicketByUser = async (req, res, next) => {
    const MaKH = req.dataToken.MaKH;
    if (!MaKH)
        return res.status(201).json({ message: "Vui lòng kiểm tra lại" });
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
const deleteTicketByAdmin = async (req, res, next) => {
    try {
        const { MaVe } = req.params;
        const ticket = await DatTour.findOne({ MaVe: MaVe });
        if (ticket) {
            const tour = await Tour.findOne({ MaTour: ticket.MaTour });
            await tour.updateOne({ SoLuong: tour.SoLuong + ticket.SLNguoi });
            await tour.save();
            await ticket.remove();
            return res.status(201).json({ message: "OK" });
        }
        return res.status(201).json({ message: "Không có dữ liệu" });
    } catch (err) {
        next(err);
    }
};
const updateAllTicket = async (req, res, next) => {
    const MaTour = req.body.MaTour;
    const listTicket = await DatTour.updateMany(
        { MaTour: MaTour },
        { TinhTrang: req.body.TinhTrang }
    );
    if (listTicket) return res.status(201).json({ message: "OK", listTicket });
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
