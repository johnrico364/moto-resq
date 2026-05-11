import { SettingsService } from "./settings.service.js";

export const getAdminProfile = async (req, res) => {
  try {
    const data = await SettingsService.getAdminProfile();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const patchAdminProfile = async (req, res) => {
  try {
    const adminId = req?.params?.id;
    let body = req.body;

    if (req.is("multipart/form-data") && req.body?.data) {
      body = JSON.parse(req.body.data);
    }

    const profile_image = req.file?.filename ?? undefined;

    const data = await SettingsService.updateAdminProfile(
      adminId,
      body,
      profile_image,
    );
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getServiceCategories = async (req, res) => {
  try {
    const data = await SettingsService.listServiceCategories();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const postServiceCategory = async (req, res) => {
  try {
    const data = await SettingsService.createServiceCategory(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const patchServiceCategory = async (req, res) => {
  try {
    const id = req?.params?.id;
    const data = await SettingsService.updateServiceCategory(id, req.body);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteServiceCategory = async (req, res) => {
  try {
    const id = req?.params?.id;
    const data = await SettingsService.deleteServiceCategory(id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
