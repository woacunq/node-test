const Product = require('../../model/product.model');
const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const systemConfig = require('../../config/system');

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
    .sort({ position: 'desc' }) //Sap xep theo position
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

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await Product.updateOne({ _id: id }, { status: status });

  req.flash('success', 'Cập nhật trạng thái thành công!');
  res.redirect(req.get('Referrer') || '/admin/products');
};

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;

  const ids = req.body.ids.split(',').map((id) => id.trim());
  console.log('Hành động là:', req.body.type);
  switch (type) {
    case 'active':
      await Product.updateMany({ _id: { $in: ids } }, { status: 'active' });
      req.flash(
        'success',
        `${ids.length} sản phẩm đã được cập nhật trạng thái!`,
      );
      break;
    case 'inactive':
      await Product.updateMany({ _id: { $in: ids } }, { status: 'inactive' });
      break;
    case 'delete-all':
      await Product.updateMany(
        { _id: { $in: ids } },
        { deleted: true, deleteAt: new Date() },
      );
      req.flash('success', `${ids.length} sản phẩm đã được xóa!`);
      break;
    case 'change-position':
      for (const item of ids) {
        let [id, position] = item.split('-');
        position = parseInt(position);
        // console.log(id);
        // console.log(position);
        await Product.updateOne({ _id: id }, { position: position });
      }
      req.flash('success', `${ids.length} sản phẩm đã được cập nhật vị trí!`);
      break;
    default:
      break;
  }

  res.redirect(req.get('Referrer') || '/admin/products');
};

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  //xoa vinh vien
  // await Product.deleteOne({ _id: id });

  // Xoa mem
  await Product.updateOne({ _id: id }, { deleted: true, deleteAt: new Date() });

  req.flash('success', `Đã xóa sản phẩm!`);

  res.redirect(req.get('Referrer') || '/admin/products');
};

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  res.render('admin/pages/products/create', { pageTitle: 'Them moi san pham' });
};

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.stock = parseInt(req.body.stock);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);

  if (req.body.position == '') {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  const product = new Product(req.body);
  await product.save();
  res.redirect(`${systemConfig.prefixAdmin}/products`);
};
