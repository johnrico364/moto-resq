import { TechnicianService } from "./technician.service.js";

function parsePayload(body) {
  if (!body) return {};
  if (typeof body.data === "string") {
    return JSON.parse(body.data);
  }
  return body;
}

export const createTechnician = async (req, res) => {
  try {
    const technicianData = parsePayload(req?.body);
    const profile_image = req.file?.filename;

    const technician = await TechnicianService.createTechnician(
      technicianData,
      profile_image,
    );
    res.status(201).json({ success: true, data: technician });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const loginTechnician = async (req, res) => {
  try {
    const { technician, token } = await TechnicianService.loginTechnician(req?.body);
    res.status(200).json({ success: true, data: technician, token });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllTechnicians = async (req, res) => {
  try {
    const technicians = await TechnicianService.getAllTechnicians();
    res.status(200).json({ success: true, data: technicians });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getTechnicianById = async (req, res) => {
  try {
    const technician = await TechnicianService.getTechnicianById(req.params.id);
    res.status(200).json({ success: true, data: technician });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateTechnician = async (req, res) => {
  try {
    const technicianData = JSON.parse(req.body.data);
    const profile_image = req.file?.filename;

    const technician = await TechnicianService.updateTechnician(
      req.params.id,
      technicianData,
      profile_image,
    );
    res.status(200).json({ success: true, data: technician });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const softDeleteTechnician = async (req, res) => {
  try {
    const result = await TechnicianService.softDeleteTechnician(req.params.id);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const uploadDocuments = async (req, res) => {

}