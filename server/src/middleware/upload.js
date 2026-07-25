const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { isCloudinaryConfigured } = require('../config/cloudinary');

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|pdf|doc|docx/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  const ok = allowed.test(ext) || allowed.test(file.mimetype);
  if (!ok) return cb(new Error('Invalid file type'));
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter,
});

const getFileUrl = (req, filename) => {
  if (!filename) return '';
  if (filename.startsWith('http')) return filename;
  const base = `${req.protocol}://${req.get('host')}`;
  return `${base}/uploads/${filename}`;
};

module.exports = { upload, getFileUrl, isCloudinaryConfigured };
