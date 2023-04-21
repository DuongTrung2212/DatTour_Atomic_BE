const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const DatTourSchema = new Schema(
    {
        MaVe: { type: Schema.ObjectId, unique: true },
        MaTour: { type: Schema.ObjectId },
        MaKH: { type: Schema.ObjectId },
        MaHDVien: { type: Schema.ObjectId },
        CCCD: { type: String },
        NgayDat: { type: String, default: new Date().toLocaleDateString() },
        Tour: { type: Object, default: null },
        TinhTrang: { type: String, default: "CD" },
        SLNguoi: { type: Number },
    },
    { timestamps: true }
);
const DatTour = mongoose.model("DatTour", DatTourSchema);
module.exports = DatTour;
