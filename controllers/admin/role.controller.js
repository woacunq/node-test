const Role = require("../../model/roles.model")
const systemConfig = require("../../config/system")
// [GET] /admin/roles
module.exports.index = async (req, res) => {
  let find = { deleted: false }


  const records = await Role.find(find)

  res.render('admin/pages/roles/index', {
    pageTitle: 'Nhóm quyền',
    records: records
  });
};

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
  res.render('admin/pages/roles/create', {
    pageTitle: 'Thêm mới nhóm quyền'
  });
};

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {

  const record = new Role(req.body);
  await record.save();

  res.redirect(`${systemConfig.prefixAdmin}/roles`);
};

// [GET] /admin/roles/edit/:id
module.exports.edit= async (req, res) => {
try {

    let find = { deleted: false }

    const record = await Role.findOne({
      _id: req.params.id,
      deleted: false,
    });
  
    res.render('admin/pages/roles/edit', {
      pageTitle: 'Chỉnh sửa danh mục',
      record: record,
    });

  } catch (error) {
    req.flash('error', 'Nhóm quyền không tồn tại');
    console.log(res.locals.messages);
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};


// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    
    await Role.updateOne({ _id: req.params.id }, req.body);
    req.flash('success', 'Cập nhật nhóm quyền thành công!');
    res.redirect(`${systemConfig.prefixAdmin}/roles/edit/${req.params.id}`);
  } catch (error) {
    console.log(error);
    req.flash('error', 'Cập nhật thất bại!');
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};
