const mongoose = require("mongoose");
// var autoIncrement = require("mongoose-auto-increment");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    MaKH: {
        type: Schema.ObjectId,
    },
    Img: { type: String,  },
    TenKH: { type: String },
    Sdt: { type: String, required: true },
    MatKhau: { type: String },
    Email: { type: String },
    DiaChi: { type: String, default: "KTX" },
    Level: { type: String, default: 0 },
});
// autoIncrement.initialize(mongoose.connection);
// UserSchema.plugin(autoIncrement.plugin, {
//     model: "User",
//     field: "MaKH",
//     startAt: 1,
//     incrementBy: 1,
// });
const User = mongoose.model("User", UserSchema);
module.exports = User;
