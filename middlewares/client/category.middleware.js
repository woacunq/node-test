const ProductsCategory = require('../../models/category.model');
const createTreeHelper = require('../../helpers/createTree');

module.exports.category = async (req, res, next) => {

    const records = await ProductsCategory.find({ deleted: false, status: "active" })
    const newProductsCategory = createTreeHelper.tree(records)

    res.locals.layoutProductsCategory = newProductsCategory;
    next()
}