const express = require("express");
const router = express.Router();
const UserController = require("../controller/userController");
const verifyToken = require("../auth/vetifyToken");
const multer = require("multer");
const fs = require("fs");
const upload = require("../middleware/upload");
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

module.exports = router;
