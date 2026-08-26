const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            unique: true,
            sparse: true  //unique + sparse sẽ cho phép nhiều cart có user_id = null (guest), nhưng chỉ cho phép mỗi user đăng nhập sở hữu tối đa một cart.
            // required: true
        },

        products: [
            {
                product_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    // required: true
                },

                quantity: {
                    type: Number,
                    // required: true,
                    min: 1
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

const Cart = mongoose.model('Cart', cartSchema, 'carts');

module.exports = Cart;