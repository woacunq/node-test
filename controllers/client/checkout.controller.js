const Order = require("../../models/order.model")
const Cart = require("../../models/cart.model")
const Product = require("../../models/product.model")

const productHelper = require("../../helpers/product")

// [GET] /checkout
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

    res.render("client/pages/checkout/index", {
        pageTitle: "Giỏ hàng",
        cartDetail: {
            products,
            totalPrice
        }
    })
};




// [POST] /checkout/order
module.exports.order = async (req, res) => {
    try {
        const cartId = req.cookies.cartId

        const cart = await Cart.findOne({
            _id: cartId
        }).populate("products.product_id")

        if (!cart || cart.products.length === 0) {
            return res.redirect("/cart")
        }

        const userInfo = {
            fullName: req.body.fullName,
            phone: req.body.phone,
            address: req.body.address
        }

        const products = cart.products.map(item => ({
            product_id: item.product_id._id,
            price: item.product_id.price,
            discountPercentage: item.product_id.discountPercentage,
            priceNew: productHelper.priceNewProduct(item.product_id),
            quantity: item.quantity
        }))

        const order = new Order({
            cart_id: cartId,
            userInfo,
            products,
            paymentMethod: req.body.paymentMethod
        })

        await order.save()

        await Cart.updateOne(
            {
                _id: cartId
            },
            {
                $set: {
                    products: []
                }
            }
        )

        res.redirect(`/checkout/success/${order._id}`)

    } catch (error) {
        console.log(error)
        res.redirect("/checkout")
    }
}




// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
    try {
        const orderId = req.params.orderId

        const order = await Order.findOne({
            _id: orderId,
            deleted: false
        }).populate("products.product_id")

        if (!order) {
            return res.redirect("/cart")
        }

        const totalPrice = order.products.reduce(
            (sum, item) => {
                return sum + item.priceNew * item.quantity
            },
            0
        )

        res.render("client/pages/checkout/success", {
            pageTitle: "Đặt hàng thành công",
            order,
            totalPrice
        })

    } catch (error) {
        console.log(error)
        res.redirect("/cart")
    }
}














// [POST]/checkout/order
// module.exports.order = async (req, res) => {
//     const cartId = req.cookies.cartId
//     const userInfo = {
//         fullName: req.body.fullName,
//         phone: req.body.phone,
//         address: req.body.address
//     }

//     const cart = await Cart.findOne(
//         {
//             _id: cartId
//         }).populate("products.product_id")


//     const products = []
//     for (let product of cart.products) {
//         const objectProduct = {
//             product_id: product.product_id._id,
//             price: 0,
//             discountPercentage: 0,
//             priceNew: 0,
//             quantity: 0,

//         }

//         objectProduct.price = product.product_id.price
//         objectProduct.discountPercentage = product.product_id.discountPercentage
//         objectProduct.priceNew = product.product_id.price * (100 - product.product_id.discountPercentage) / 100
//         objectProduct.quantity = product.quantity

//         products.push(objectProduct)

//     }


//     const detailOrder = {
//         userInfo,
//         products
//     }
//     console.log(detailOrder);

//     await Cart.updateOne(
//         {
//             _id: cartId
//         },
//         {
//             products: []
//         }
//     )
//     const order = new Order(detailOrder)
//     await order.save()

//     res.send("ok")
// };
// 