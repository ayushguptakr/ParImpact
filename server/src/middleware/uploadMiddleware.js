const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadsDir = path.join(__dirname, "..", "..", "uploads", "proofs");
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const safeBase = path
      .basename(file.originalname, path.extname(file.originalname))
      .replace(/[^a-zA-Z0-9-_]/g, "-");
    cb(null, `${Date.now()}-${safeBase}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    cb(new Error("Only image files are allowed"));
    return;
  }
  cb(null, true);
};

const uploadProofImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

module.exports = {
  uploadProofImage,
};
