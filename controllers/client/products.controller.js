const Product = require('../../models/product.model');
const productHelper = require("../../helpers/product")

// [GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: 'active',
    deleted: 'false',
  }).sort({ position: 'desc' });

  const newProducts = productHelper.priceNewProduct(products)

  res.render('client/pages/products/index', {
    pageTitle: 'Danh sách sản phẩm',
    products: newProducts,
  });
};

// [GET] /:slug
module.exports.detail = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      deleted: 'false',
      status: 'active',
    });

    res.render('client/pages/products/detail', {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    req.flash('error', 'Sản phẩm không tồn tại');
    res.redirect(`/products`);
  }
};
