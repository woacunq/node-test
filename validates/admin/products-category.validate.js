module.exports.createPost = (req, res, next) => {
  if (!req.body.title) {
    req.flash('error', 'Vui lòng nhập tiêu đề!');
    res.redirect('/admin/products-category/create');
    return;
  }
  next();
};
