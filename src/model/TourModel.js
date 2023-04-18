const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TourSchema = new Schema({
    MaTour: { type: Schema.ObjectId, unique: true },
    TenTour: { type: String, index: true, unique: true },
    Gia: { type: Number },
    HinhAnh: { type: Array },
    MoTa: { type: Array },
    SoLuong: { type: Number },
    DiemDi: { type: String },
    NgayBD: { type: String },
    NgayKT: { type: String },
    MaHDVien: { type: Schema.ObjectId },
    DiemDon: { type: String },
    Sale: { type: Number },
    LoaiTour: { type: Array },
    TinhTrang: { type: Boolean, default: true },
});
TourSchema.index({ TenTour: 1 });
const Tour = mongoose.model("Tour", TourSchema);
module.exports = Tour;
