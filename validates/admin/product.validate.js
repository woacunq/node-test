module.exports.createPost = (req, res, next) => {
  if (!req.body.title) {
    req.flash('error', 'Vui lòng nhập tiêu đề!');
    res.redirect('/admin/products/create');
    return;
  }
  next();
};
module.exports.editPost = (req, res, next) => {
  if (!req.body.title) {
    req.flash('error', 'Vui lòng nhập tiêu đề!');
    res.redirect('/admin/products/edit');
    return;
  }
  next();
};
