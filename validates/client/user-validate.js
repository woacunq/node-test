module.exports.registerPost = (req, res, next) => {
    if (!req.body.fullName) {
        req.flash('error', 'Vui lòng nhập họ tên!');
        res.redirect('/user/register');
        return;
    }


    if (!req.body.email) {
        req.flash('error', 'Vui lòng nhập email!');
        res.redirect('/user/register');
        return;
    }

    if (!req.body.password) {
        req.flash('error', 'Vui lòng nhập email!');
        res.redirect('/user/register');
        return;
    }
    next();
};

module.exports.loginPost = (req, res, next) => {

    if (!req.body.email) {
        req.flash('error', 'Vui lòng nhập email!');
        res.redirect('/user/register');
        return;
    }

    if (!req.body.password) {
        req.flash('error', 'Vui lòng nhập email!');
        res.redirect('/user/register');
        return;
    }
    next();
};

module.exports.forgotPasswordPost = (req, res, next) => {

    if (!req.body.email) {
        req.flash('error', 'Vui lòng nhập email!');
        res.redirect('/user/password/forgot');
        return;
    }
    next();
};

module.exports.resetPasswordPost = (req, res, next) => {

    if (!req.body.password) {
        req.flash('error', 'Vui lòng nhập mật khẩu!');
        res.redirect('/user/password/reset');
        return;
    }
    if (!req.body.confirmPassword) {
        req.flash('error', 'Vui lòng xác nhận mật khẩu!');
        res.redirect('/user/password/reset');
        return;
    }
    if (req.body.password != req.body.confirmPassword) {
        req.flash('error', 'Mật khẩu không khớp!');
        res.redirect('/user/password/reset');
        return;
    }
    next();
};


module.exports.changePasswordPatch = (req, res, next) => {

    if (!req.body.oldPassword) {
        req.flash('error', 'Vui lòng nhập mật khẩu hiện tại!');
        res.redirect('/user/password/change');
        return;
    }
    if (!req.body.newPassword) {
        req.flash('error', 'Vui lòng nhập mật khẩu!');
        res.redirect('/user/password/change');
        return;
    }
    if (!req.body.confirmPassword) {
        req.flash('error', 'Vui lòng xác nhận mật khẩu!');
        res.redirect('/user/password/change');
        return;
    }
    if (req.body.newPassword != req.body.confirmPassword) {
        req.flash('error', 'Mật khẩu không khớp!');
        res.redirect('/user/password/change');
        return;
    }
    next();
};
