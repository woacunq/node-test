const express = require('express');
const route = express.Router();
const controller = require('../../controllers/client/user.controller');

const multer = require("multer");
const upload = multer();
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');

const validate = require("../../validates/client/user-validate")

route.get('/register', controller.register);

route.post('/register', validate.registerPost, controller.registerPost);

route.get('/login', controller.login);

route.post('/login', validate.loginPost, controller.loginPost);

route.get('/logout', controller.logout);

route.get('/password/forgot', controller.forgotPassword);

route.post('/password/forgot', validate.forgotPasswordPost, controller.forgotPasswordPost);

route.get('/password/otp', controller.otpPassword);

route.post('/password/otp', controller.otpPasswordPost);

route.get('/password/reset', controller.resetPassword);

route.post('/password/reset', validate.resetPasswordPost, controller.resetPasswordPost);

route.get('/info', controller.info);

route.get('/edit', controller.edit);

route.patch('/edit', upload.single("avatar"), uploadCloud.upload, controller.editPatch);

route.get('/password/change', controller.changePassword);

route.patch('/password/change', validate.changePasswordPatch, controller.changePasswordPatch);

module.exports = route;
