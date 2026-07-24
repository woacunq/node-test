const Account = require("../../models/account.model")
const Role = require("../../models/role.model")

const systemConfig = require("../../config/system")

const md5 = require("md5")

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    let find = { deleted: false }


    const records = await Account.find(find).select("-password -token").populate("role_id");

    res.render('admin/pages/accounts/index', {
        pageTitle: 'Danh sách tài khoản',
        records: records
    });
};


// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {

    const records = await Role.find({ deleted: false })

    res.render('admin/pages/accounts/create', {
        pageTitle: 'Thêm mới tài khoản',
        roles: records
    });
};


// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
    const emailExist = await Account.findOne({ email: req.body.email, deleted: false })

    if (emailExist) {
        req.flash('error', `Email ${req.body.email} đã tồn tại`)
        res.redirect(req.get("Referrer") || "/");
    } else {
        req.body.password = md5(req.body.password)
        const record = new Account(req.body)
        await record.save()

        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }


};