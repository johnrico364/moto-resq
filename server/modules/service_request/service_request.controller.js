import { ServiceRequestService } from "./service_request.service.js";
import fs, { unlink } from "fs";

export const createServiceRequest = async (req, res) => {
  try {
    const requestData = JSON.parse(req?.body?.data);
    const requestImg = req.file?.filename;

    const serviceRequest = await ServiceRequestService.createServiceRequest(
      requestData,
      requestImg,
    );

    res.status(201).json({ success: true, data: serviceRequest });
  } catch (error) {
    // If an image was uploaded but request creation failed (e.g. validation error), remove the file.
    if (req.file?.path) {
      try {
        await fs.promises.unlink(req.file.path);
      } catch (unlinkError) {
        console.log(unlinkError);
      }
    }

    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllServiceRequest = async (req, res) => {
  try {
    const serviceRequest = await ServiceRequestService.getAllServiceRequest();
    res.status(200).json({ success: true, data: serviceRequest });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getServiceRequestById = async (req, res) => {
  try {
    const requestId = req.params.id;

    const serviceRequest =
      await ServiceRequestService.getServiceRequestById(requestId);
    res.status(200).json({ success: true, data: serviceRequest });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateServiceRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const requestData = JSON.parse(req?.body?.data);
    const requestImg = req?.file?.filename;

    const serviceRequest = await ServiceRequestService.updateServiceRequest(
      requestId,
      { ...requestData, image: requestImg },
    );

    res.status(200).json({ success: true, data: serviceRequest });
  } catch (error) {
    // If an image was uploaded but request creation failed (e.g. validation error), remove the file.
    if (req.file?.path) {
      try {
        await fs.promises.unlink(req.file.path);
      } catch (unlinkError) {
        console.log(unlinkError);
      }
    }

    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteServiceRequest = async (req, res) => {
  try {
    const requestId = req?.params?.id;
    const serviceRequest =
      await ServiceRequestService.deleteServiceRequest(requestId);

    res.status(200).json({ success: true, data: serviceRequest });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
