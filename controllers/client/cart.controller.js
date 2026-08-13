const Cart = require("../../models/cart.model")
const productHelper = require("../../helpers/product")

// [GET] /cart
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId

    const cart = await Cart.findOne({
        _id: cartId
    })
        .populate("products.product_id")
        .lean()

    if (!cart || cart.products.length === 0) {
        return res.render("client/pages/cart/index", {
            pageTitle: "Giỏ hàng",
            cartDetail: {
                products: [],
                totalPrice: 0
            }
        })
    }

    const products = productHelper.priceNewProductsCart(cart.products)

    const totalPrice = products.reduce(
        (sum, item) => sum + item.product_id.priceNew * item.quantity,
        0
    )

    res.render("client/pages/cart/index", {
        pageTitle: "Giỏ hàng",
        cartDetail: {
            products,
            totalPrice
        }
    })
}



// const Cart = require("../../models/cart.model")
// const Product = require('../../models/product.model');

// const productHelper = require("../../helpers/product")

// // [GET] /cart
// module.exports.index = async (req, res) => {

//     const cartId = req.cookies.cartId
//     const cart = await Cart.findOne({
//         _id: cartId
//     }).populate("products.product_id")
//     // console.log(cart.products);
//     if (cart.products.length > 0) {
//         const newProducts = productHelper.priceNewProductsCart(cart.products)

//         newProducts.totalPrice = cart.products.reduce(
//             (sum, item) => sum + (item.product_id.priceNew * item.quantity), 0)
//         console.log(newProducts.totalPrice);

//         res.render("client/pages/cart/index", {
//             pageTitle: "Giỏ hàng",
//             cartDetail: newProducts,
//             // totalPrice: cart.totalPrice
//         })
//     } else {

//     }


// };



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