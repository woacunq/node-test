const Product = require('../../models/product.model');

const productHelper = require("../../helpers/product")

// [GET] /
module.exports.index = async (req, res) => {
  // Sản phẩm nổi bật
  const productsFeatured = await Product.find({
    featured: true,
    status: "active",
    deleted: false
  }).limit(4)
  const newProductsFeatured = productHelper.priceNewProducts(productsFeatured)
  // End Sản phẩm nổi bật

  //  Sản phẩm mới nhất
  const productsNew = await Product.find({
    deleted: false,
    status: "active"
  }).sort({ position: "desc" }).limit(6)

  const newProductsNew = productHelper.priceNewProducts(productsNew)
  //  End Sản phẩm mới nhất



  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    productsFeatured: newProductsFeatured,
    productsNew: newProductsNew


  });
};
