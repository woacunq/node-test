const streamifier = require('streamifier');
const cloudinary = require('cloudinary').v2;

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

module.exports.upload = async (req, res, next) => {
  // Phòng vệ: Nếu Client không upload file nào (hoặc form không chứa ảnh),
  // cho phép đi tiếp sang Validate/Controller luôn, tránh làm sập streamifier.
  if (!req.file) {
    return next();
  }

  // Hàm helper biến Buffer thành Stream để đẩy lên Cloudinary
  const streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream((error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };

  try {
    const result = await streamUpload(req);

    // Gán link ảnh động dựa trên tên trường đầu vào (ví dụ: thumbnail, avatar, ...)
    req.body[req.file.fieldname] = result.secure_url;
  } catch (error) {
    console.dir(error, { depth: null });
    res.status(500).json({
      message: 'Lỗi tải ảnh lên Cloudinary hệ thống!',
      error: error.message,
    });
  }
};
