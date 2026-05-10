import path from "path";
import os from "os";

function getUploadRoot() {
  if (process.env.UPLOAD_DIR?.trim()) {
    return path.resolve(process.env.UPLOAD_DIR.trim());
  }
  if (process.env.VERCEL) {
    return path.join(os.tmpdir(), "moto-images");
  }
  return path.join(process.cwd(), "images");
}

export const UPLOAD_ROOT = getUploadRoot();
