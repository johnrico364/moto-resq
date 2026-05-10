import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const img_type = req?.body?.image_type;
    callback(null, path.join("images/", img_type));
  },
  filename: (req, file, callback) => {
    const ext = path.extname(file.originalname);
    callback(
      null,
      Date.now() + "-" + Math.floor(1000000 + Math.random() * 9000000) + ext
    );
  },
});

const fileFilter = (req, file, callback) => {
  const allowedTypes = /jpeg|jpg|png/;
  const isValid =
    allowedTypes.test(file.mimetype) &&
    allowedTypes.test(path.extname(file.originalname).toLocaleLowerCase());

  if (isValid) {
    callback(null, true);
  } else {
    callback(new Error("Only image files are allowed"));
  }
};

const realUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit 5 MB
  },
  fileFilter,
});

// Vercel serverless functions run on a read-only/ephemeral filesystem, so
// multer.diskStorage cannot persist files there. Instead of letting requests
// crash mid-upload, return a clear 503 from any upload route in that env.
const blocked = (_req, res) =>
  res.status(503).json({
    error:
      "File uploads are disabled in this deployment. Configure cloud storage (Cloudinary/S3/Vercel Blob) to enable.",
  });

const upload = process.env.VERCEL
  ? {
      single: () => blocked,
      array: () => blocked,
      fields: () => blocked,
      none: () => blocked,
      any: () => blocked,
    }
  : realUpload;

export default upload;
