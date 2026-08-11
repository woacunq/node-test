const express = require('express');
const route = express.Router();
const controller = require('../../controllers/client/products.controller');

route.get('/', controller.index);

route.get('/category/:slugCategory', controller.category);

route.get('/detail/:slugProduct', controller.detail);

module.exports = route;
