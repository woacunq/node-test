const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');
const controller = require('../../controllers/admin/upload.controller');

// [POST] /admin/upload/tinymce
router.post(
  '/tinymce',
  upload.single('file'),
  uploadCloud.upload,
  controller.tinymce
);


module.exports = router;