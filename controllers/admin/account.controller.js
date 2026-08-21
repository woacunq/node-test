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


// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    try {

        const record = await Account.findOne({
            _id: req.params.id,
            deleted: false,
        });

        const roles = await Role.find({ deleted: false })
        res.render('admin/pages/accounts/edit', {
            pageTitle: 'Chỉnh sửa tài khoản',
            record: record,
            roles: roles
        });

    } catch (error) {
        req.flash('error', 'Tài khoản không tồn tại');
        console.log(res.locals.messages);
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
};

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;

        // Kiểm tra email đã tồn tại ở tài khoản khác
        const emailExist = await Account.findOne({
            _id: { $ne: id },
            email: req.body.email,
            deleted: false
        });

        if (emailExist) {
            req.flash("error", `Email ${req.body.email} đã tồn tại`);
            return res.redirect(`${systemConfig.prefixAdmin}/accounts/edit/${id}`);
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
            dataUpdate.avatar = req.body.avatar;
        }

        // Nếu nhập mật khẩu mới
        if (req.body.password) {

            // Kiểm tra xác nhận mật khẩu
            if (
                req.body.password !==
                req.body.confirmPassword
            ) {
                req.flash("error", "Mật khẩu xác nhận không khớp!");

                return res.redirect(`${systemConfig.prefixAdmin}/accounts/edit/${id}`);
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

        return res.redirect(`${systemConfig.prefixAdmin}/accounts/edit/${id}`);

    } catch (error) {
        console.log(error);

        req.flash("error", "Có lỗi xảy ra, vui lòng thử lại!");

        return res.redirect(`${systemConfig.prefixAdmin}/accounts/edit/${req.params.id}`);
    }
};