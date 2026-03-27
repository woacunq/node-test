const Product = require('../../model/product.model');
const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');

// [GET] /admin/products
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

  // pagination
  let objectPagination = {
    currentPage: 1,
    limitItem: 4,
  };

  if (req.query.page) {
    objectPagination.currentPage = parseInt(req.query.page);
  }

  // console.log(objectPagination.currentPage);

  objectPagination.skip = (objectPagination.currentPage - 1) * 4;
  const countProducts = await Product.countDocuments(find);
  const totalPage = Math.ceil(countProducts / objectPagination.limitItem);
  // console.log(totalPage);
  objectPagination.totalPage = totalPage;
  //end pagination

  const products = await Product.find(find)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);

  // console.log(products);

  res.render('admin/pages/products/index', {
    pageTitle: 'Trang danh sach san pham',
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [GET] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {

  const status = req.params.status;
  const id = req.params.id;

  await Product.updateOne({ _id: id }, { status: status });

  res.redirect(req.get('Referrer') || '/admin/products');
};
