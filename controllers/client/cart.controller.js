const Cart = require("../../models/cart.model")
const Product = require('../../models/product.model');

// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
    const productId = req.params.productId
    const quantity = parseInt(req.body.quantity)
    const cartId = req.cookies.cartId

    // console.log(productId);
    // console.log(quantity)
    // console.log(cartId);
    const cart = await Cart.findOne({
        _id: cartId
    })
    const existProductInCart = cart.products.find(item => item.product_id == productId)

    if (existProductInCart) {
        const quantityNew = existProductInCart.quantity + quantity

        await Cart.updateOne(
            {
                _id: cartId,
                "products.product_id": productId
            },
            {
                $set: {
                    "products.$.quantity": quantityNew
                }
            }
        );  
    } else {
        const objectCart = {
            product_id: productId,
            quantity: quantity
        }

        await Cart.updateOne(
            {
                _id: cartId
            },
            {
                $push: { products: objectCart }
            })
    }


    req.flash("success", "Thêm vào giỏ hàng thành công")
    const product = await Product.findOne({
        _id: productId
    })
    res.redirect(`/products/detail/${product.slug}`);

};