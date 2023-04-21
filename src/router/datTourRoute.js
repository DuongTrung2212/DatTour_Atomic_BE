const express = require("express");
const datTourController = require("../controller/datTourController");
const router = express.Router();

router
    .route("/")
    .get(datTourController.getAllTicket)
    .post(datTourController.newTicket);
router.route("/filter/:filter").get(datTourController.getUserTicket);
router.route("/completeAll").post(datTourController.updateAllTicket);
router.route("/manager/:MaVe").delete(datTourController.deleteTicketByAdmin);
router
    .route("/:MaVe")
    .patch(datTourController.updateTicket)
    .delete(datTourController.deleteTicketByUser);

module.exports = router;
