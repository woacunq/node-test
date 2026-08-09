const Product = require('../../models/product.model');

const productHelper = require("../../helpers/product")

// [GET] /
module.exports.index = async (req, res) => {
  const productsFeatured = await Product.find({
    featured: true,
    status: "active",
    deleted: false
  }).limit(2)
  

  const newProducts = productHelper.priceNewProduct(productsFeatured)

  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    productsFeatured: newProducts

  });
};
