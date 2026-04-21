import path from "path";
import fs from "fs/promises";

import ServiceRequest from "./service_request.model.js"; // MODEL
import User from "../user/user.model.js";
import Technician from "../technician/technician.model.js";

export const ServiceRequestService = {
  // CREATE SERVICE REQUEST ================================================
  async createServiceRequest(data, image) {
    const requestData = { ...data, image };

    const serviceRequest = await ServiceRequest.create(requestData);
    return serviceRequest;
  },
  // GET ALL SERVICE REQUEST ==============================================
  async getAllServiceRequest() {
    const serviceRequest = await ServiceRequest.find()
      .populate("user_id")
      .populate("technician_id");
    return serviceRequest;
  },
  // GET SERVICE REQUEST BY ID ===========================================
  async getServiceRequestById(id) {
    const serviceRequest = await ServiceRequest.findById(id)
      .populate("user_id")
      .populate("technician_id");
    return serviceRequest;
  },
  // GET DASHBOARD COUNTS ===============================================
  async getDashboardCounts() {
    const [
      completedServices,
      registeredTechnicians,
      serviceRequests,
      registeredUsers,
    ] = await Promise.all([
      ServiceRequest.countDocuments({ status: "Completed" }),
      Technician.countDocuments({ is_deleted: { $ne: true } }),
      ServiceRequest.countDocuments(),
      User.countDocuments(),
    ]);

    return {
      completed_services: completedServices,
      registered_technician: registeredTechnicians,
      service_request: serviceRequests,
      registered_users: registeredUsers,
    };
  },
  // UPDATE SERVICE REQUEST ====================================
  async updateServiceRequest(id, data) {
    const serviceRequest = await ServiceRequest.findById(id);
    let oldImage = serviceRequest?.image;

    // If a new image is being set and it's different from the old one, remove the old image (unless it's default.png)
    if (data?.image && oldImage && data.image !== oldImage) {
      const imgPath = path.join("images", "service_request", oldImage);
      console.log(imgPath);
      fs.unlink(imgPath, (err) => {
        if (err) {
          console.error(`error deleting request img: ${err}`);
        } else {
          console.log("Old request image deleted");
        }
      });
    }

    const updatedRequest = await ServiceRequest.findByIdAndUpdate(
      id,
      {
        ...data,
        image: data?.image,
      },
      { returnDocument: "after" },
    );
    return updatedRequest;
  },
  // DELETE SERVICE REQUEST =========================================
  async deleteServiceRequest(id) {
    const request = await ServiceRequest.findByIdAndDelete(id);
    return request;
  },
};
