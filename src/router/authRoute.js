const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const { loginValidation } = require("../auth/validation");
const verifyToken = require("../auth/vetifyToken");

router.route("/signUp").post(authController.createUser);
router.route("/login").post(authController.loginUser, loginValidation);
router.route("/logout").get(verifyToken, authController.logOutUser);
module.exports = router;
