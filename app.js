const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");
const app = express();
const db = require("./src/config/db");
const fs = require("fs");
var path = require("path");
require("dotenv").config();

const userRoute = require("./src/router/userRoute");
const tourRoute = require("./src/router/tourRoute");
const authRoute = require("./src/router/authRoute");
const uploadRoute = require("./src/router/upload");
const datTourRoute = require("./src/router/datTourRoute");

const cors = require("cors");

const verifyToken = require("./src/auth/vetifyToken");
const Img = require("./src/model/ImgModel");
const { GridFsStorage } = require("multer-gridfs-storage");

var corsOptions = {
    origin: "http://localhost:3001",
    credentials: true,
};
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
// app.set("view engine", "ejs");
db.connect();

// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "uploads");
//     },
//     filename: function (req, file, cb) {
//         const { MaKH } = req.dataToken.MaKH;
//         cb(null, MaKH + ".png");
//     },
// });
// var upload = multer({ storage: storage });

app.use("/api/user", verifyToken, userRoute);
app.use("/api/tour", tourRoute);
app.use("/api/auth", authRoute);
app.use("/api/datTour", verifyToken, datTourRoute);
app.use("/api/img", express.static("uploads"));

app.use("/api/", uploadRoute);

/////////////////////////////

// app.delete("/", (req, res) => {
//     try {
//         fs.unlinkSync("uploads/rau1.jpg");
//         console.log("successfully deleted /tmp/hello");
//         return res.status(200).send("Successfully! Image has been Deleted");
//     } catch (err) {
//         return res.status(400).send(err);
//     }
// });

/////////////////////////
app.get("/", (req, res) => {
    return res.status(200).json({
        message: "ok",
    });
});

app.use((err, req, res, next) => {
    const error = app.get("env") === "development" ? err : {};
    const status = err.status || 500;
    return res.status(status).json({
        error: {
            message: error.message,
        },
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
