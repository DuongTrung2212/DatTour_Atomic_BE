// const jwt = require("jsonwebtoken");

// module.exports = function (req, res, next) {
//     const token = req.header("auth-token");
//     if (!token)
//         return res.status(401).send("Vui lòng đăng nhập để được truy cập");
//     try {
//         const checkToken = jwt.verify(token, process.env.SECRET_TOKEN); // kiểm tra token
//         req.dataToken = checkToken; //lưu token lại để có thể kiểm tra
//         next();
//     } catch (err) {
//         res.status(400).send("Token không hợp lệ");
//     }
// };
