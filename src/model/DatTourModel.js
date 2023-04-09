const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const DatTourSchema = new Schema(
    {
        MaVe: { type: Schema.ObjectId },
        MaTour: { type: Schema.ObjectId },
        MaKH: { type: Schema.ObjectId },
        MaHDVien: { type: Schema.ObjectId },
        NgayDat: { type: String, default: new Date().toLocaleDateString() },
        NgayBD: { type: String },
        NgayKT: { type: String },
        TinhTrang: { type: String, default: "CD" },
        SLNguoi: { type: Number },
    },
    { timestamps: true }
);
const DatTour = mongoose.model("DatTour", DatTourSchema);
module.exports = DatTour;
