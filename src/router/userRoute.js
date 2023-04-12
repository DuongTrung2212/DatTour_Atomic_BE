const express = require("express");
const router = express.Router();
const UserController = require("../controller/userController");
const verifyToken = require("../auth/vetifyToken");
const multer = require("multer");
const fs = require("fs");
const upload = require("../middleware/upload");
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "uploads");
//     },
//     filename: function (req, file, cb) {
//         const MaKH = req.dataToken.MaKH;
//         cb(null, MaKH + ".png");
//     },
// });
// var upload = multer({ storage: storage });
// // router.route("/").post(UserController.createUser);
router
    .route("/")
    .get(UserController.getUser)
    .delete(UserController.deleteUser)
    .patch(upload.single("Img"), UserController.updateUser);
router.route("/getAllUser").get(UserController.getAllUser);
router.route("/verify").post(UserController.checkPass);
router.route("/changePass").patch(UserController.changePassUser);

router
    .route("/:MaKH")
    .get(UserController.getUserById)
    .delete(UserController.deleteUserById);

// router.route("/createacc").post(UserController.createAccount);
// router.route("/account/:accountId").delete(UserController.deleteAccount);

module.exports = router;
