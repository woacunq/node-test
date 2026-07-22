const mongoose = require('mongoose');
const generate = require("../helpers/generate")
mongoose.plugin(slug);

const accountSchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: String,
        token: {
            type: String,
            default: generate.generateRandomString(20)
        },
        phone: String,
        avatar: String,
        roles_id: String,
        status: String,
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

const Account = mongoose.model(
    'Account',  // modelName
    accountSchema,  // schema
    'accounts',  // collectionName
);

module.exports = Account;
