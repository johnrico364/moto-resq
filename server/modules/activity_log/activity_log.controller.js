import { ActivityLogService } from "./activity_log.service.js";

export const getRecentActivity = async (req, res) => {
  try {
    const { limit } = req.query;
    const data = await ActivityLogService.getRecentActivity(limit);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
