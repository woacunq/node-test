const Product = require('../../models/product.model');
const ProductsCategory = require('../../models/category.model');
const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const createTreeHelper = require('../../helpers/createTree');
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
    limitItems: 4,
  };

  if (req.query.page) {
    objectPagination.currentPage = parseInt(req.query.page);
  }

  objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;
  const countProducts = await Product.countDocuments(find);
  const totalPage = Math.ceil(countProducts / objectPagination.limitItems);

  objectPagination.totalPage = totalPage;
  //end pagination

  // SORT
  let sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = 'desc';
  }
  // END SORT

  const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip)
    .populate("createdBy.account_id", "fullName")
    .populate("updatedBy.account_id", "fullName");

  res.render('admin/pages/products/index', {
    pageTitle: 'Danh sách sản phẩm',
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
  const ids = req.body.ids.split(",").map(id => id.trim());

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date()
  };

  switch (type) {
    case "active":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          status: "active",
          $push: { updatedBy }
        }
      );

      req.flash("success", `${ids.length} sản phẩm đã được cập nhật trạng thái!`);
      break;

    case "inactive":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          status: "inactive",
          $push: { updatedBy }
        }
      );

      req.flash("success", `${ids.length} sản phẩm đã được cập nhật trạng thái!`);
      break;

    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date()
          }
        }
      );

      req.flash("success", `${ids.length} sản phẩm đã được xóa!`);
      break;

    case "change-position":
      await Promise.all(
        ids.map(item => {
          const [id, position] = item.split("-");

          return Product.updateOne(
            { _id: id },
            {
              position: Number(position),
              $push: { updatedBy }
            }
          );
        })
      );

      req.flash("success", `${ids.length} sản phẩm đã được cập nhật vị trí!`);
      break;
  }

  res.redirect(req.get("Referrer") || "/admin/products");
};

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  //xoa vinh vien
  // await Product.deleteOne({ _id: id });

  // Xoa mem
  await Product.updateOne({
    _id: id
  },
    {
      deleted: true,
      deletedBy: {
        account_id: res.locals.user.id,
        deletedAt: new Date()
      }
    });

  req.flash('success', `Đã xóa sản phẩm!`);

  res.redirect(req.get('Referrer') || '/admin/products');
};

// [GET] /admin/products/create
module.exports.create = async (req, res) => {

  const categories = await ProductsCategory.find({ deleted: false })


  const newRecords = createTreeHelper.tree(categories);

  res.render('admin/pages/products/create', { pageTitle: 'Them moi san pham', categories: newRecords });
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

  req.body.createdBy = {
    account_id: res.locals.user.id
  };

  const product = new Product(req.body);
  await product.save();

  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      deleted: false,
    });

    const categories = await ProductsCategory.find({ deleted: false })

    const newRecords = createTreeHelper.tree(categories);


    res.render('admin/pages/products/edit', {
      pageTitle: 'Chỉnh sửa sản phẩm',
      product: product,
      categories: newRecords
    });
  } catch (error) {
    req.flash('error', 'Sản phẩm không tồn tại');
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    req.body.price = parseInt(req.body.price);
    req.body.stock = parseInt(req.body.stock);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);

    if (req.body.position == '') {
      const countProducts = await Product.countDocuments();
      req.body.position = countProducts + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date()
    }


    await Product.updateOne({ _id: req.params.id }, {
      ...req.body,
      $push: { updatedBy: updatedBy }
    });
    req.flash('success', 'Cập nhật sản phẩm thành công!');
    res.redirect(`${systemConfig.prefixAdmin}/products/edit/${req.params.id}`);
  } catch (error) {
    req.flash('error', 'Cập nhật thất bại!');
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {

    const product = await Product.findOne({
      _id: req.params.id,
      deleted: false
    })
      .populate("product_category_id", "title")
      .populate("createdBy.account_id", "fullName")
      .populate("updatedBy.account_id", "fullName");

    res.render("admin/pages/products/detail", {
      pageTitle: "Chi tiết sản phẩm",
      product: product
    });
  } catch (error) {
    req.flash("error", "Sản phẩm không tồn tại!");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};
