const Joi = require("@hapi/joi");

const signUpValidation = function (data) {
    const schema = Joi.object({
        TenKH: Joi.string().min(2).required(),
        Sdt: Joi.string().min(4).required(),
        MatKhau: Joi.string().min(3).required(),
        Email: Joi.string().email().required(),
        DiaChi: Joi.string().required(false),
    });
    return schema.validate(data);
};
const loginValidation = function (data) {
    const schema = Joi.object({
        Sdt: Joi.number().min(6).required(),
        MatKhau: Joi.string().min(3).required(),
    });
    return schema.validate(data);
};

module.exports = { signUpValidation, loginValidation };
