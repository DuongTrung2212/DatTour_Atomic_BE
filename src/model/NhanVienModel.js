const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const NhanVienSchema = new Schema({
    MaHDVien: { type: Number },
    TenNV: { type: String },
    GioiTinh: { type: String },
    SdtNV: { type: Number },
    Email: { type: String },
    NgayLV: { type: Date },
});
const NhanVien = mongoose.model("NhanVien", NhanVienSchema);
module.exports = NhanVien;
