import UserActivityLog from "../user_activity_log/user_activity_log.model.js";
import TechnicianActivityLog from "../technician_activity_log/technician_activity_log.model.js";

export const ActivityLogService = {
  async getRecentActivity(limit = 20) {
    const parsedLimit = Number(limit);
    const safeLimit =
      Number.isFinite(parsedLimit) && parsedLimit > 0
        ? Math.min(parsedLimit, 100)
        : 20;

    const [userActivities, technicianActivities] = await Promise.all([
      UserActivityLog.find({})
        .sort({ created_at: -1 })
        .limit(safeLimit)
        .lean(),
      TechnicianActivityLog.find({})
        .sort({ created_at: -1 })
        .limit(safeLimit)
        .lean(),
    ]);

    const combinedActivities = [
      ...userActivities.map((activity) => ({
        ...activity,
        activity_type: "user",
      })),
      ...technicianActivities.map((activity) => ({
        ...activity,
        activity_type: "technician",
      })),
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return {
      user_activities: userActivities,
      technician_activities: technicianActivities,
      activities: combinedActivities,
    };
  },
};
