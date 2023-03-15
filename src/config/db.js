const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

require("dotenv").config();

const url = process.env.DB_URL;
// "mongodb+srv://duongtrung:trung2001@cluster0.fqjpats.mongodb.net/DoAnCNPM";

async function connect() {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("Connected");
    } catch (error) {
        console.log(error);
    }
}

module.exports = { connect };
