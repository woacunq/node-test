const User = require("../../models/user.model")
const ForgotPassword = require("../../models/forgot-password.model")


const generateHelper = require("../../helpers/generate")

const md5 = require("md5")


// [GET] /user/register
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

// [POST] /user/login
module.exports.login = async (req, res) => {
    res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập tài khoản"
    })

};

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    const user = await User.findOne({
        email: email,
        deleted: false
    })

    if (!user) {
        req.flash("error", "Email không tồn tại")
        return res.redirect("/user/login")
    }

    if (md5(password) !== user.password) {
        req.flash("error", "Mật khẩu không chính xác")
        return res.redirect("/user/login")
    }

    if (user.status !== "active") {
        req.flash("error", "Tài khoản hiện không hoạt động")
        return res.redirect("/user/login")
    }


    res.cookie("tokenUser", user.tokenUser)
    res.redirect("/")

};


// [GET] /user/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser")
    res.redirect("/user/login")
};

// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/user/forgot-password", {
        pageTitle: "Lấy lại mật khẩu"
    })

};


// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email

    const user = await User.findOne({
        email: email,
        deleted: false,
    })

    if (!user) {
        res.flash("error", "Email không chính xác!")
        return res.redirect("/user/password/forgot")
    }

    // lưu thông tin vào db
    const otp = generateHelper.generateRandomNumber(4)


    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now()
    }

    console.log(objectForgotPassword);
    const forgotPassword = new ForgotPassword( objectForgotPassword

    )
    await forgotPassword.save()



    res.send("ok")
};
