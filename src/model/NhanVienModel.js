const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const NhanVienSchema = new Schema({
    MaHDVien: { type: Schema.ObjectId },
    TenHDVien: { type: String },
    GioiTinh: { type: String },
    SdtNV: { type: String },
    Email: { type: String },
    NgayLV: { type: String, default: new Date().toLocaleDateString() },
});
const NhanVien = mongoose.model("NhanVien", NhanVienSchema);
module.exports = NhanVien;
