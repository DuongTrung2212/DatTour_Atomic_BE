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
const datTourRoute = require("./src/router/datTourRoute");
const nhanVienRoute = require("./src/router/nhanVienRoute");

const cors = require("cors");

const verifyToken = require("./src/auth/vetifyToken");

var corsOptions = {
    origin: true,
    credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
// app.set("view engine", "ejs");
db.connect();

app.use("/api/user", verifyToken, userRoute);
app.use("/api/tour", tourRoute);
app.use("/api/auth", authRoute);
app.use("/api/nhanVien", verifyToken, nhanVienRoute);
app.use("/api/datTour", verifyToken, datTourRoute);
app.use("/api/img", express.static("uploads"));

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
