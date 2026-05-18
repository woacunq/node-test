const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    slug: { type: String, slug: ['title', 'price'], unique: true }, //mỗi sản phẩm có 1 slug duy nhất
    //
    deleted: {
      type: Boolean,
      default: false, // Mặc định sản phẩm mới tạo là CHƯA xóa
    },
    deleteAt: Date,
  },
  {
    timestamps: true, //mongo tao 2 properties createAt va updateAt
  },
);

const Product = mongoose.model('Product', productSchema, 'products');

module.exports = Product;
