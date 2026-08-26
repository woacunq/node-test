const User = require("../../models/user.model")
const ForgotPassword = require("../../models/forgot-password.model")
const Cart = require("../../models/cart.model")


const generateHelper = require("../../helpers/generate")
const sendMailHelper = require("../../helpers/sendMail")

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

// [GET] /user/login
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

    const userCart = await Cart.findOne(
        {
            // _id: req.cookies.cartId,
            user_id: user.id
        })

    if (!userCart) {
        await Cart.updateOne(
            {
                _id: req.cookies.cartId
            },
            {
                user_id: user.id
            }
        )
    } else {
        const guestCart = await Cart.findById(req.cookies.cartId);

        if (guestCart && userCart) {
            for (const guestItem of guestCart.products) {
                const existProduct = userCart.products.find(
                    item =>
                        item.product_id.toString() ===
                        guestItem.product_id.toString()
                );

                if (existProduct) {
                    existProduct.quantity += guestItem.quantity;
                } else {
                    userCart.products.push(guestItem);
                }
            }

            await userCart.save();

            await Cart.deleteOne({
                _id: guestCart._id
            });

            res.cookie("cartId", userCart.id);
        }
    }

    res.cookie("tokenUser", user.tokenUser)
    res.redirect("/")

};


// [GET] /user/logout
module.exports.logout = async (req, res) => {
    // res.clearCookie("cartId")
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
        req.flash("error", "Email không chính xác!")
        return res.redirect("/user/password/forgot")
    }

    // lưu thông tin vào db
    const otp = generateHelper.generateRandomNumber(4)


    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: new Date(Date.now() + 1800000)
    }

    const forgotPassword = new ForgotPassword(objectForgotPassword)
    await forgotPassword.save()

    // gui otp ve mail
    const subject = "Mã OTP xác minh thay đổi mật khẩu"
    const html = `Mã OTP để lấy lại mật khẩu là <b> ${otp}</b>. Mã OTP có hiệu lực trong 3 phút!`


    sendMailHelper.sendMail(email, subject, html)


    res.redirect(`/user/password/otp?email=${email}`)
};


// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
    const email = req.query.email
    res.render("client/pages/user/otp-password", {
        pageTitle: "Xác nhận OTP",
        email: email
    })
};

// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email
    const otp = req.body.otp

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    })

    if (!result) {
        req.flash("error", "OTP không hợp lệ!")
        return res.redirect(`/user/password/otp?email=${email}`)
    }


    const user = await User.findOne({
        email: email
    })

    req.session.resetPassword = {
        email: email
    }

    res.redirect("/user/password/reset")

};


// [GET] /user/password/reset
module.exports.resetPassword = (req, res) => {
    if (!req.session.resetPassword) {
        req.flash("error", "Vui lòng xác thực OTP")
        return res.redirect("/user/password/forgot")
    }

    res.render("client/pages/user/reset-password")
}

// [POST] /user/password/otp
module.exports.resetPasswordPost = async (req, res) => {

    if (!req.session.resetPassword) {
        req.flash("error", "Phiên xác thực đã hết hạn")
        return res.redirect("/user/password/forgot")
    }

    const password = req.body.password
    const resetPassword = req.session.resetPassword.email
    const newToken = generateHelper.generateRandomString(20)

    await User.updateOne(
        {
            email: resetPassword
        },
        {
            password: md5(password),
            tokenUser: newToken
        }
    )

    res.cookie("tokenUser", newToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30
    })

    delete req.session.resetPassword

    req.flash("success", "Đổi mật khẩu thành công!")
    res.redirect("/")
};


// [GET] /user/info 
module.exports.info = async (req, res) => {
    // const user = await User.findOne({
    //     tokenUser: req.cookies.tokenUser,
    //     deleted: false
    // })

    // if (!user) {
    //     return res.redirect("/user/login")
    // }
    res.render("client/pages/user/info", {
        pageTitle: "Thông tin tài khoản",
        // user
    })
}


// [GET] /user/edit
module.exports.edit = (req, res) => {
    res.render("client/pages/user/edit", {
        pageTitle: "Chỉnh sửa tài khoản"
    })
}

// [PATCH] /user/edit
module.exports.editPatch = async (req, res) => {

    const dataUpdate = {
        fullName: req.body.fullName,
        phone: req.body.phone,
    };

    if (req.file) {
        dataUpdate.avatar = req.body.avatar
    }
    try {
        await User.updateOne({ email: req.body.email }, dataUpdate);

        req.flash("success", "Cập nhật thành công!");
        res.redirect("/user/info")
    } catch (error) {
        console.log(error);
        req.flash("error", "Cập nhật thất bại!");
        res.redirect("/user/info")
    }

};


// [GET] /user/password/change
module.exports.changePassword = (req, res) => {
    res.render("client/pages/user/change-password", {
        pageTitle: "Đổi mật khẩu"
    })
}

// [PATCH] /user/password/change
module.exports.changePasswordPatch = async (req, res) => {


    const user = await User.findOne({
        tokenUser: req.cookies.tokenUser
    })

    if (md5(req.body.oldPassword) !== user.password) {
        req.flash("error", "Mật khẩu hiện tại không chính xác!")
        return res.redirect("/user/password/change")
    }

    await User.updateOne(
        {
            tokenUser: user.tokenUser
        },
        {
            password: md5(req.body.newPassword)
        }
    )
    req.flash("success", "Đã thay đổi mật khẩu!")
    res.redirect("/user/info")
};