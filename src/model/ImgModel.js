const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ImgSchema = new Schema({
    image: {
        data: Buffer,
        contentType: String,
    },
});
const Img = mongoose.model("img", ImgSchema);
module.exports = Img;
