const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const uploadsDir = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.join(__dirname, '..', '..', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/quicktime',
]);

function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-100);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    cb(null, `${crypto.randomUUID()}-${sanitizeFilename(file.originalname)}`);
  },
});

function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    cb(new Error(`Unsupported file type: ${file.mimetype}`));
    return;
  }
  cb(null, true);
}

const limits = { fileSize: 10 * 1024 * 1024, files: 60 };

const uploadSubmissionFiles = multer({ storage, fileFilter, limits }).fields([
  { name: 'newsletter_files', maxCount: 20 },
  { name: 'instagram_files', maxCount: 20 },
  { name: 'whatsapp_files', maxCount: 20 },
]);

const uploadAttachmentFiles = multer({ storage, fileFilter, limits }).array('files', 20);

module.exports = { uploadsDir, uploadSubmissionFiles, uploadAttachmentFiles };
