const mongoose = require("mongoose");
const Grid = require("gridfs-stream");

let gfs, gridfsBucket;
const conn = mongoose.connection;
conn.once("open", function () {
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "photos",
    });
    // gfs = "ASBCD";
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("photos");
});

const uploadImg = async (req, res) => {
    if (req.file === undefined) return res.send("you must select a file.");
    const imgUrl = `${process.env.ORIGIN_URL}img/${req.file.filename}`;
    return res.send(imgUrl);
};

const getImg = async (req, res) => {
    try {
        const file = await gfs.files.findOne({ filename: req.params.filename });
        const readStream = gridfsBucket.openDownloadStream(file._id);
        readStream.pipe(res);
    } catch (error) {
        res.send("not found : " + error);
    }
};

const deleteImg = async (req, res) => {
    try {
        await gfs.files.deleteOne({ filename: req.params.filename });
        res.send("success");
    } catch (error) {
        console.log(error);
        res.send("An error occured." + error);
    }
};

module.exports = { getImg, deleteImg, uploadImg };
