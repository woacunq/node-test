const Product = require('../../models/product.model');
const ProductCategory = require('../../models/category.model');
const productHelper = require("../../helpers/product")

const { getSubCategoryIds } = require("../../helpers/category.helper");

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

// [GET] /:slug
module.exports.category = async (req, res) => {
  console.log(req.params.slugCategory);

  const category = await ProductCategory.findOne({
    slug: req.params.slugCategory,
    status: "active",
    deleted: false
  })

  const listSubCategoryId = await getSubCategoryIds(category.id);

  const products = await Product.find({
    product_category_id: { $in: [category.id, ...listSubCategoryId] },
    deleted: false
  }).sort({ position: "desc" })

  const newProducts = productHelper.priceNewProduct(products)

  res.render('client/pages/products/index', {
    pageTitle: category.title,
    products: newProducts
  })
};
