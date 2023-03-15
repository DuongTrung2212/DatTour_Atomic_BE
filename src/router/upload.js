const express = require("express");
const { getImg, uploadImg, deleteImg } = require("../controller/upload");
const router = express.Router();
const multer = require("../middleware/upload");

// router.post("/upload", upload.single("file"), async (req, res) => {
//     if (req.file === undefined) return res.send("you must select a file.");
//     const imgUrl = `http://localhost:8080/file/${req.file.filename}`;
//     return res.send(imgUrl);
// });

router.route("/uploadImg").post(multer.single("img"), uploadImg);
router.route("/img/:filename").get(getImg).delete(deleteImg);

module.exports = router;
