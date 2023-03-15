const express = require("express");
const datTourController = require("../controller/datTourController");
const router = express.Router();
router
    .route("/")
    .get(datTourController.getAllTicket)
    .post(datTourController.newTicket);
module.exports = router;
