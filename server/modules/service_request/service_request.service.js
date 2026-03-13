import ServiceRequest from "./service_request.model.js"; // MODEL

export const ServiceRequestService = {
  // CREATE SERVICE REQUEST ================================================
  async createServiceRequest(data, image) {

    const requestData = {...data, image}

    
    const serviceRequest = await ServiceRequest.create(requestData);
    return serviceRequest;
  },
};
