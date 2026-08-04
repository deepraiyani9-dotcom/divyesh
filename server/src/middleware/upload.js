const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|pdf|doc|docx/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    const ok = allowed.test(ext) || allowed.test(file.mimetype);
    if (!ok) return cb(new Error('Invalid file type. Use JPG, PNG or WEBP.'));
    cb(null, true);
  },
});

const uploadToCloudinary = (file) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'lotus-agritech',
        resource_type: 'auto',
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
    stream.end(file.buffer);
  });

const saveToDisk = (file) => {
  const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const filename = `${unique}${path.extname(file.originalname) || '.jpg'}`;
  const fullPath = path.join(uploadDir, filename);
  fs.writeFileSync(fullPath, file.buffer);
  return filename;
};

/**
 * Persist uploaded file → Cloudinary (preferred) or local /uploads.
 * Returns a public URL string to store on the product document.
 */
const persistUpload = async (req, file) => {
  if (!file) return { url: '', storage: 'none' };

  if (isCloudinaryConfigured()) {
    const result = await uploadToCloudinary(file);
    return {
      url: result.secure_url,
      filename: result.public_id,
      storage: 'cloudinary',
    };
  }

  // Always store a relative path — absolute localhost URLs break on phones / other PCs
  const filename = saveToDisk(file);
  const relative = `/uploads/${filename}`;
  return { url: relative, filename, storage: 'local' };
};

const getFileUrl = (req, filename) => {
  if (!filename) return '';
  if (String(filename).startsWith('http')) return filename;
  const base = `${req.protocol}://${req.get('host')}`;
  return `${base}/uploads/${String(filename).replace(/^\/?uploads\//, '')}`;
};

module.exports = {
  upload: memoryUpload,
  persistUpload,
  getFileUrl,
  isCloudinaryConfigured,
};
