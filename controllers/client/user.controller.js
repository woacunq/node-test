const User = require("../../models/user.model")

const md5 = require("md5")

module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng ký tài khoản"
    })

};


// [POST] /user/register
module.exports.registerPost = async (req, res) => {

    const existEmail = await User.findOne({
        email: req.body.email
    })

    if (existEmail) {

        req.flash("error", "Email đã tồn tại")
        res.redirect("/user/register")

    } else {
        req.body.password = md5(req.body.password)
        const user = new User(req.body)
        user.save()
        res.cookie("tokenUser", user.tokenUser)

        req.flash("success", "Tạo tài khoản thành công")
        res.redirect("/")
    }

};