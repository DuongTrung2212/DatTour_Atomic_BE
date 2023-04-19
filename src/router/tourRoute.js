const express = require("express");
const router = express.Router();
const TourController = require("../controller/tourController");
const multer = require("multer");
const { default: mongoose } = require("mongoose");
const upload = require("../middleware/upload");
// var idTour = new mongoose.Types.ObjectId();
// function storage() {
//     var idTour = new mongoose.Types.ObjectId();
//     const data = multer.diskStorage({
//         destination: "src/static/imgTour/",
//         filename: function (req, file, cb) {
//             req.idTour = idTour;
//             const uniqueSuffix =
//                 Date.now() + "_" + Math.round(Math.random() * 1e9) + ".png";
//             cb(null, uniqueSuffix);
//         },
//     });
//     return data;
// }
// var upload = multer({ storage: storage() });

router
    .route("/")
    .get(TourController.getAllTour)
    .post(upload.any(), TourController.newTour);
router.route("/categoryTour").get(TourController.getCategoryTour);
router.route("/open").get(TourController.getOpenTour);
router
    .route("/:tourId")
    .get(TourController.getTour)
    .delete(TourController.deleteTour)
    .patch(
        // upload.array("HinhAnh", 10),
        upload.any(),
        TourController.updateTour
    );
router.route("/search/:dataSearch").get(TourController.tourSearch);
module.exports = router;
