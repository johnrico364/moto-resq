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
