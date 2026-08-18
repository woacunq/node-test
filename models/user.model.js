const mongoose = require('mongoose');
const generate = require("../helpers/generate")

const userSchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: String,
        tokenUser: {
            type: String,
            default: generate.generateRandomString(20)
        },
        phone: String,
        avatar: String,
        status: {
            type: String,
            default: "active" // Dùng khi tạo tài khoản cần admin duyệt mới sử dụng được tính năng
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

const User = mongoose.model(
    'User',  // modelName
    userSchema,  // schema
    'users',  // collectionName
);

module.exports = User;
