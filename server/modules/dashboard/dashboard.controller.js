import { DashboardService } from "./dashboard.service.js";

export const getSummary = async (req, res) => {
  try {
    const data = await DashboardService.getSummary();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getNewRequests = async (req, res) => {
  try {
    const data = await DashboardService.getNewRequests(req.query.limit);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getNewUsers = async (req, res) => {
  try {
    const data = await DashboardService.getNewUsers(req.query.limit);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getRecentActivity = async (req, res) => {
  try {
    const data = await DashboardService.getRecentActivity(req.query.limit);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
