const { default: mongoose } = require("mongoose");
const DatTour = require("../model/DatTourModel");

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
    const data = req.body;
    data.MaVe = new mongoose.Types.ObjectId();
    const newTicket = await DatTour.create(data);
    if (newTicket) return res.status(201).json({ message: "OK", data });
};
// const updateTicket = async (req, res, next) => {
//     const data = req.body;
//     data.MaVe = new mongoose.Types.ObjectId();
//     const newTicket = await DatTour.create(data);
//     if (newTicket) return res.status(201).json({ message: "OK", data });
// };
module.exports = { getAllTicket, getUserTicket, newTicket };
