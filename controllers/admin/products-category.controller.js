const ProductsCategory = require('../../model/category.model');
const systemConfig = require('../../config/system');
const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const createTreeHelper = require('../../helpers/createTree');

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  // Filter
  const filterStatus = filterStatusHelper(req.query);
  if (req.query.status) {
    find.status = req.query.status;
  }
  // End Filter

  // Search
  const objectSearch = searchHelper(req.query);
  let keyword = "";
  if (objectSearch.regex) {
    keyword = objectSearch.keyword;
    find.title = objectSearch.regex;
  }
  // End Search
  const records = await ProductsCategory.find(find)
    .sort('position'); // Sắp xếp vị trí tăng dần


  const newRecords = createTreeHelper.tree(records);

  res.render('admin/pages/products-category/index', {
    pageTitle: 'Trang danh mục sản phẩm',
    records: newRecords,
    filterStatus: filterStatus,
    keyword: keyword
  });
};
// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {

  let find = {
    deleted: false
  }

  const records = await ProductsCategory.find(find)
  const newRecords = createTreeHelper.tree(records)

  res.render('admin/pages/products-category/create', {
    pageTitle: 'Tạo danh mục',
    records: newRecords
  });
};


// [PATCH]/admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await ProductsCategory.updateOne({ _id: id }, { status: status });

  req.flash('success', 'Cập nhật trạng thái thành công!');
  res.redirect(req.get('Referrer') || '/admin/products');
};


// [PATCH] /admin/products-category/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;

  const ids = req.body.ids.split(',').map((id) => id.trim());
  console.log('Hành động là:', req.body.type);
  switch (type) {
    case 'active':
      await ProductsCategory.updateMany({ _id: { $in: ids } }, { status: 'active' });
      req.flash(
        'success',
        `${ids.length} sản phẩm đã được cập nhật trạng thái!`,
      );
      break;
    case 'inactive':
      await ProductsCategory.updateMany({ _id: { $in: ids } }, { status: 'inactive' });
      break;
    case 'delete-all':
      await ProductsCategory.updateMany(
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
        await ProductsCategory.updateOne({ _id: id }, { position: position });
      }
      req.flash('success', `${ids.length} sản phẩm đã được cập nhật vị trí!`);
      break;
    default:
      break;
  }

  res.redirect(req.get('Referrer') || '/admin/products-category');
};

// [DELETE] /admin/products-category/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  //xoa vinh vien
  // await Product.deleteOne({ _id: id });

  // Xoa mem
  await ProductsCategory.updateOne({ _id: id }, { deleted: true, deleteAt: new Date() });

  req.flash('success', `Đã xóa sản phẩm!`);

  res.redirect(req.get('Referrer') || '/admin/products');
};


// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try {

    let find = { deleted: false }

    const record = await ProductsCategory.findOne({
      _id: req.params.id,
      deleted: false,
    });
    const records = await ProductsCategory.find(find)
    const newRecords = createTreeHelper.tree(records)

    res.render('admin/pages/products-category/edit', {
      pageTitle: 'Chỉnh sửa danh mục',
      record: record,
      records: newRecords
    });

  } catch (error) {
    req.flash('error', 'Danh mục không tồn tại');
    console.log(res.locals.messages);
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};

// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    req.body.price = parseInt(req.body.price);
    req.body.stock = parseInt(req.body.stock);

    if (req.body.position == '') {
      const countProducts = await ProductsCategory.countDocuments();
      req.body.position = countProducts + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    await ProductsCategory.updateOne({ _id: req.params.id }, req.body);
    req.flash('success', 'Cập nhật sản phẩm thành công!');
    res.redirect(`${systemConfig.prefixAdmin}/products-category/edit/${req.params.id}`);
  } catch (error) {
    console.log(error);
    req.flash('error', 'Cập nhật thất bại!');
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
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

  const record = new ProductsCategory(req.body);
  await record.save();
  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};
