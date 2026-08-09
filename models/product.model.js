const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    product_category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductsCategory"
    },
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    featured: {
      type: Boolean,
      default: false
    },
    position: Number,
    slug: { type: String, slug: ['title'], unique: true }, //mỗi sản phẩm có 1 slug duy nhất
    createdBy: {
      account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account"
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    },
    deleted: {
      type: Boolean,
      default: false, // Mặc định sản phẩm mới tạo là CHƯA xóa
    },
    deletedBy: {
      account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account"
      },
      deletedAt: {
        type: Date,
      }
    },
    updatedBy: [
      {
        account_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Account"
        },
        updatedAt: Date,
      }
    ]
  },

);

const Product = mongoose.model('Product', productSchema, 'products');

module.exports = Product;
