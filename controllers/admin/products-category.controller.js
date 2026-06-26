const ProductsCategory = require('../../model/category.model');
const systemConfig = require('../../config/system');

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
  res.render('admin/pages/products-category/index', {
    pageTitle: 'Trang danh muc san pham',
  });
};

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  let find = {
    delete: false,
  };
  const productsCategory = await ProductsCategory.find(find).sort(
    (position = 'desc'),
  ); //Sap xep theo position
  // .limit(objectPagination.limitItem)
  // .skip(objectPagination.skip);
  res.render('admin/pages/products-category/create', {
    pageTitle: 'Tao danh muc',
    productsCategory: productsCategory,
  });
};

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  if (req.body.position == '') {
    const countProducts = await ProductsCategory.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  console.log(req.body);

  // const product = new ProductsCategory(req.body);
  // await product.save();
  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};
