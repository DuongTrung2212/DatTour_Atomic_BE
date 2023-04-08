const express = require("express");
const router = express.Router();
const NhanVienController = require("../controller/nhanVienController");
router
    .route("/")
    .get(NhanVienController.getAllNhanVien)
    .post(NhanVienController.createNhanVien);
router
    .route("/:idNhanVien")
    .get(NhanVienController.getNhanVien)
    .post(NhanVienController.updateNhanVien)
    .delete(NhanVienController.deleteNhanVien);

module.exports = router;
