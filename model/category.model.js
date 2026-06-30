const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
  {
    title: String,
    parent_id: {
      type: String,
      default: '',
    },
    description: String,
    thumbnail: String,
    status: String,
    position: Number,
    slug: { type: String, slug: ['title'], unique: true }, //mỗi sản phẩm có 1 slug duy nhất
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

const ProductsCategory = mongoose.model(
  'ProductsCategory',  // modelName
  productSchema,  // schema
  'categorys',  // collectionName
);

module.exports = ProductsCategory;
