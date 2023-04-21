const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const UserController = require("../controller/userController");
const { loginValidation } = require("../auth/validation");
const verifyToken = require("../auth/vetifyToken");

router.route("/checkUser").post(authController.checkUserExists);
router.route("/signup").post(authController.createUser);
router.route("/login").post(authController.loginUser, loginValidation);
router.route("/logout").get(verifyToken, authController.logOutUser);
router.route("/checkAdmin").get(verifyToken, authController.checkAdmin);
router
    .route("/changePassByNumber")
    .patch(UserController.changePassUserByNumber);
module.exports = router;
