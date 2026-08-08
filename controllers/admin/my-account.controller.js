const Account = require("../../models/account.model")
const systemConfig = require("../../config/system")


// [GET] /admin/my-account
module.exports.index = (req, res) => {
  res.render('admin/pages/my-account/index', {
    pageTitle: 'Trang cá nhân',
  });
};


// [GET] /admin/my-account/edit
module.exports.edit = (req, res) => {
  res.render("admin/pages/my-account/edit", {
    pageTitle: "Chỉnh sửa thông tin cá nhân"
  });
};


// [PATCH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
  try {
    const id = res.locals.user._id;

    // Kiểm tra email đã tồn tại ở tài khoản khác
    const emailExist = await Account.findOne({
      _id: { $ne: id },
      email: req.body.email,
      deleted: false
    });

    if (emailExist) {
      req.flash("error", `Email ${req.body.email} đã tồn tại`);
      return res.redirect(`${systemConfig.prefixAdmin}/my-account/edit`);
    }

    // Dữ liệu cần cập nhật
    const dataUpdate = {
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      role_id: req.body.role_id,
      status: req.body.status
    };

    // Nếu có upload avatar mới
    if (req.file) {
      dataUpdate.avatar = req.file.path;
    }

    // Nếu nhập mật khẩu mới
    if (req.body.password) {

      // Kiểm tra xác nhận mật khẩu
      if (
        req.body.password !==
        req.body.confirmPassword
      ) {
        req.flash("error", "Mật khẩu xác nhận không khớp!");

        return res.redirect(`${systemConfig.prefixAdmin}/my-account/edit`);
      }

      dataUpdate.password = md5(req.body.password);
    }

    // Cập nhật tài khoản
    await Account.updateOne(
      {
        _id: id,
        deleted: false
      },
      {
        $set: dataUpdate
      }
    );

    req.flash("success", "Cập nhật tài khoản thành công!");

    return res.redirect(`${systemConfig.prefixAdmin}/my-account/edit`);

  } catch (error) {
    console.log(error);

    req.flash("error", "Có lỗi xảy ra, vui lòng thử lại!");

    return res.redirect(`${systemConfig.prefixAdmin}/my-account/edit`);
  }
}