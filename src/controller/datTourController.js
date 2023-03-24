const { default: mongoose } = require("mongoose");
const DatTour = require("../model/DatTourModel");
const Tour = require("../model/TourModel");

const getAllTicket = async (req, res, next) => {
    const listTicket = await DatTour.find({});
    if (listTicket > 0) return res.status(201).json({ listTicket });
    return res.status(201).json({ message: "Ko co du lieu" });
};
const getUserTicket = async (req, res, next) => {
    const { MaKH } = req.dataToken.MaKH;
    const listTicket = await DatTour.find({ MaKH: MaKH });
    if (listTicket > 0) return res.status(201).json({ listTicket });
    return res.status(201).json({ message: "Ko co du lieu" });
};
const newTicket = async (req, res, next) => {
    const tour = await Tour.findOne({ MaTour: req.body.MaTour });
    const SoLuongCon = tour.SoLuong - req.body.SLNguoi;
    await tour.updateOne({ SoLuong: SoLuongCon });
    tour.save();
    const MaKH = req.dataToken.MaKH;
    const data = req.body;
    data.MaKH = MaKH;
    data.MaVe = new mongoose.Types.ObjectId();
    const newTicket = await DatTour.create(data);
    if (newTicket)
        return res.status(201).json({ message: "OK", newTicket, SoLuongCon });
    return res.status(201).json({ message: "Loi dat tour" });
};
// const updateTicket = async (req, res, next) => {
//     const data = req.body;
//     data.MaVe = new mongoose.Types.ObjectId();
//     const newTicket = await DatTour.create(data);
//     if (newTicket) return res.status(201).json({ message: "OK", data });
// };
module.exports = { getAllTicket, getUserTicket, newTicket };
