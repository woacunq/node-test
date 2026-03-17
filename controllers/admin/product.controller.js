// [GET] /admin/products
const Product = require('../../model/product.model');
const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);

  let find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }
  // Search
  const objectSearch = searchHelper(req.query);

  if (objectSearch.regex) {
    keyword = objectSearch.keyword;
    find.title = objectSearch.regex;
  }

  const products = await Product.find(find);

  // console.log(products);

  res.render('admin/pages/products/index', {
    pageTitle: 'Trang danh sach san pham',
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
  });
};
