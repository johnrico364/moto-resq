import express from "express";
import upload from "../../middlewear/multer.js";
import {
  deleteServiceCategory,
  getAdminProfile,
  getServiceCategories,
  patchAdminProfile,
  patchServiceCategory,
  postServiceCategory,
} from "./settings.controller.js";

const router = express.Router();

router.get("/settings/profile", getAdminProfile);
router.patch(
  "/settings/profile/:id",
  upload.single("image"),
  patchAdminProfile,
);

router.get("/settings/service-categories", getServiceCategories);
router.post("/settings/service-categories", postServiceCategory);
router.patch("/settings/service-categories/:id", patchServiceCategory);
router.delete("/settings/service-categories/:id", deleteServiceCategory);

router.use((err, req, res, next) => {
  if (err && err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "File size exceeds 5MB limit",
    });
  }
  next(err);
});

export default router;
