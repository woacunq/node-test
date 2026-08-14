const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        // user_id: {
        //             type: mongoose.Schema.Types.ObjectId,
        //             ref: 'User',
        //             // required: true
        //         },
        cart_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cart"
        },
        userInfo: {
            fullName: String,
            phone: String,
            address: String
        },
        products: [
            {
                product_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    // required: true
                },

                price: Number,
                discountPercentage: Number,
                priceNew: Number,
                quantity: Number,



            }],
        status: {
            type: String,
            enum: [
                "pending",
                "confirmed",
                "shipping",
                "completed",
                "cancelled"
            ],
            default: "pending"
        },
        deleted: {
            type: Boolean,
            default: false,
        },
        deleteAt: Date,
    },
    {
        timestamps: true, //mongo tao 2 properties createAt va updateAt
    },
);

const Order = mongoose.model('Order', orderSchema, 'orders');

module.exports = Order;
