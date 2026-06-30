const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const validate = require('../../validates/admin/products-category.validate');
const controller = require('../../controllers/admin/products-category.controller');
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');

router.get('/', controller.index);

router.get('/create', controller.create);

router.patch('/change-status/:status/:id', controller.changeStatus);

router.patch('/change-multi', controller.changeMulti);

router.delete('/delete/:id', controller.deleteItem);


router.get('/edit/:id', controller.edit);

router.patch(
  '/edit/:id',
  upload.single('thumbnail'), uploadCloud.upload,
  validate.createPost,
  controller.editPatch,
);


router.post(
  '/create',
  upload.single('thumbnail'),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost,
);

module.exports = router;
