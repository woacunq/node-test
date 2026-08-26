const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
    const expiresCookie = 365 * 24 * 60 * 60 * 1000;

    let cart = null;

    if (req.cookies.cartId) {
        cart = await Cart.findById(req.cookies.cartId);
    }

    // Không có cart hoặc cart đã bị xóa
    if (!cart) {
        cart = new Cart();
        await cart.save();

        res.cookie("cartId", cart.id, {
            expires: new Date(Date.now() + expiresCookie)
        });
    }

    cart.totalQuantity = cart.products.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    res.locals.miniCart = cart;

    next();
};