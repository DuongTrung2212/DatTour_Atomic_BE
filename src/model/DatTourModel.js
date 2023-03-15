const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const DatTourSchema = new Schema(
    {
        MaVe: { type: Schema.ObjectId, index: true },
        MaTour: { type: Schema.ObjectId },
        MaKH: { type: Schema.ObjectId },
        MaNV: { type: Schema.ObjectId },
        NgayDat: { type: Date, default: Date.now().toFixed("'DD-MM-YYYY'") },
        NgayBD: { type: Date },
        NgayKT: { type: Date },
        TinhTrang: { type: String },
        SLNguoi: { type: Number },
    },
    { timestamps: true }
);
const DatTour = mongoose.model("DatTour", DatTourSchema);
module.exports = DatTour;
