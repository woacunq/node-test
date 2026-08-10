const ProductCategory = require("../models/category.model");

module.exports.getSubCategory = async (parentId) => {
    const subs = await ProductCategory.find({
        parent_id: parentId,
        status: "active",
        deleted: false,
    });

    let allSub = [...subs];

    for (const sub of subs) {
        const childs = await module.exports.getSubCategory(sub.id);

        allSub = allSub.concat(childs);
    }

    return allSub;
};


module.exports.getSubCategoryIds = async (parentId) => {
    const listSubCategory = await module.exports.getSubCategory(parentId);

    return listSubCategory.map(item => item.id);
};