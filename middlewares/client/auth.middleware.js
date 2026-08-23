const User = require("../../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
    const tokenUser = req.cookies.tokenUser;

    if (!tokenUser) {
        return res.redirect("/user/login");
    }

    const user = await User.findOne({
        tokenUser,
        deleted: false,
        status: "active"
    }).select("-password");

    if (!user) {
        res.clearCookie("tokenUser"); // xóa cookie không hợp lệ
        return res.redirect("/user/login");
    }

    req.user = user;
    res.locals.user = user;

    next();
};