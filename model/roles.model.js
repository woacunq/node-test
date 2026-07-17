const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        permissions: {
            type: Array,
            default: []
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

const Role = mongoose.model('Role', roleSchema, 'roles');

module.exports = Role;
