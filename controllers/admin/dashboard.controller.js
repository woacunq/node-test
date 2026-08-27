const ProductCategory = require("../../models/category.model");
const Product = require("../../models/product.model");
const Account = require("../../models/account.model");
const User = require("../../models/user.model");

module.exports.dashboard = async (req, res) => {

  // Danh mục sản phẩm
  const categoryTotal = await ProductCategory.countDocuments({
    deleted: false
  });

  const categoryActive = await ProductCategory.countDocuments({
    deleted: false,
    status: "active"
  });

  const categoryInactive = await ProductCategory.countDocuments({
    deleted: false,
    status: "inactive"
  });

  // Sản phẩm
  const productTotal = await Product.countDocuments({
    deleted: false
  });

  const productActive = await Product.countDocuments({
    deleted: false,
    status: "active"
  });

  const productInactive = await Product.countDocuments({
    deleted: false,
    status: "inactive"
  });

  // Tài khoản Admin
  const adminTotal = await Account.countDocuments({
    deleted: false
  });

  const adminActive = await Account.countDocuments({
    deleted: false,
    status: "active"
  });

  const adminInactive = await Account.countDocuments({
    deleted: false,
    status: "inactive"
  });

  // Tài khoản User
  const userTotal = await User.countDocuments({
    deleted: false
  });

  const userActive = await User.countDocuments({
    deleted: false,
    status: "active"
  });

  const userInactive = await User.countDocuments({
    deleted: false,
    status: "inactive"
  });

  res.render("admin/pages/dashboard/index", {
    pageTitle: "Dashboard",

    statistic: {
      category: {
        total: categoryTotal,
        active: categoryActive,
        inactive: categoryInactive
      },

      product: {
        total: productTotal,
        active: productActive,
        inactive: productInactive
      },

      admin: {
        total: adminTotal,
        active: adminActive,
        inactive: adminInactive
      },

      user: {
        total: userTotal,
        active: userActive,
        inactive: userInactive
      }
    }
  });
};