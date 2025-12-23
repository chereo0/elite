import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extnameOk = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetypeOk = allowedTypes.test(file.mimetype);

  if (extnameOk && mimetypeOk) return cb(null, true);
  return cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
