const multer = require("multer");

const { GridFsStorage } = require("multer-gridfs-storage");

// const storage = new GridFsStorage({
//     url: process.env.DB_URL,
//     options: { useNewUrlParser: true, useUnifiedTopology: true },
//     file: (req, file) => {
//         const match = ["image/png", "image/jpeg"];

//         if (match.indexOf(file.mimetype) === -1) {
//             const filename = `${Math.round(Math.random() * 1e9)}_${
//                 file.originalname
//             }`;
//             return filename;
//         }
//         return {
//             bucketName: "photos",
//             filename: `${Date.now()}_${file.originalname}`,
//         };
//     },
// });
var storage = multer.diskStorage({
    destination: "uploads",
    filename: function (req, file, cb) {
        cb(
            null,
            `${Date.now()}_${Math.round(Math.random() * 1e9)}_${
                file.originalname
            }`
        );
    },
});

module.exports = multer({ storage });
