// [POST] /admin/upload/tinymce
module.exports.tinymce = (req, res) => {
  try {
    // Nếu upload thành công qua middleware, link ảnh sẽ nằm ở req.body.file
    if (req.body.file) {
      // BẮT BUỘC trả về JSON có key là 'location'
      res.json({
        location: req.body.file 
      });
    } else {
      res.status(400).json({ error: "Không tìm thấy file ảnh!" });
    }
  } catch (error) {
    console.log("Lỗi upload TinyMCE:", error);
    res.status(500).json({ error: "Lỗi hệ thống khi tải ảnh lên!" });
  }
};
