import fs from "fs";
import multer from "multer";
import path from "path";

import { UPLOAD_ROOT } from "../config/uploadRoot.js";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const img_type = req?.body?.image_type;
    const dest = path.join(UPLOAD_ROOT, img_type);
    fs.mkdirSync(dest, { recursive: true });
    callback(null, dest);
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

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit 5 MB
  },
  fileFilter,
});

export default upload;
