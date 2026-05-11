import User from "../user/user.model.js";
import Technician from "../technician/technician.model.js";
import ServiceRequest from "../service_request/service_request.model.js";

function clampLimit(raw, fallback, max = 50) {
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.min(n, max);
}

export const DashboardService = {
  async getSummary() {
    const [
      completedServices,
      registeredTechnicians,
      serviceRequests,
      registeredUsers,
      pendingRequests,
    ] = await Promise.all([
      ServiceRequest.countDocuments({ status: "Completed" }),
      Technician.countDocuments({ is_deleted: { $ne: true } }),
      ServiceRequest.countDocuments({}),
      User.countDocuments({
        is_deleted: { $ne: true },
        role: { $ne: "admin" },
      }),
      ServiceRequest.countDocuments({ status: "Pending" }),
    ]);

    return {
      completedServices,
      registeredTechnicians,
      serviceRequests,
      registeredUsers,
      pendingRequests,
    };
  },

  async getNewRequests(limitRaw) {
    const limit = clampLimit(limitRaw, 5);
    const requests = await ServiceRequest.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("user_id", "name profile_image")
      .populate("technician_id", "name profile_image")
      .lean();

    return requests.map((r) => ({
      _id: r._id,
      problem_type: r.problem_type,
      status: r.status,
      createdAt: r.createdAt,
      user: r.user_id
        ? {
            _id: r.user_id._id,
            name: r.user_id.name,
            profile_image: r.user_id.profile_image || null,
          }
        : null,
      technician: r.technician_id
        ? {
            _id: r.technician_id._id,
            name: r.technician_id.name,
            profile_image: r.technician_id.profile_image || null,
          }
        : null,
    }));
  },

  async getNewUsers(limitRaw) {
    const limit = clampLimit(limitRaw, 5);
    const users = await User.find({
      is_deleted: { $ne: true },
      role: { $ne: "admin" },
    })
      .sort({ created_at: -1 })
      .limit(limit)
      .select("name email phone profile_image created_at status")
      .lean();
    return users;
  },

  async getRecentActivity(limitRaw) {
    const limit = clampLimit(limitRaw, 10);
    const requests = await ServiceRequest.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("user_id", "name profile_image")
      .lean();

    return requests.map((r) => ({
      _id: r._id,
      problem_type: r.problem_type,
      status: r.status,
      createdAt: r.createdAt,
      user: r.user_id
        ? {
            _id: r.user_id._id,
            name: r.user_id.name,
            profile_image: r.user_id.profile_image || null,
          }
        : null,
    }));
  },

  async getRequestsOverview() {
    const [requests, agg] = await Promise.all([
      ServiceRequest.find({})
        .sort({ createdAt: -1 })
        .populate("user_id", "name profile_image")
        .populate("technician_id", "name profile_image")
        .lean(),
      ServiceRequest.aggregate([
        { $group: { _id: "$problem_type", count: { $sum: 1 } } },
      ]),
    ]);

    const countByType = Object.fromEntries(
      agg.map((x) => [x._id, x.count]),
    );

    const stats = [
      {
        label: "Flat Tire Assistance",
        value: countByType["Flat Tire"] ?? 0,
      },
      {
        label: "Battery Jumpstart",
        value: countByType["Battery"] ?? 0,
      },
      {
        label: "Towing Service",
        value: countByType["Towing"] ?? 0,
      },
      {
        label: "Engine Trouble",
        value: countByType["Engine"] ?? 0,
      },
    ];

    const pickPerson = (ref) => {
      if (!ref || typeof ref !== "object") return null;
      if (!("_id" in ref)) return null;
      return {
        _id: String(ref._id),
        name: typeof ref.name === "string" ? ref.name : "Unknown",
        profile_image:
          typeof ref.profile_image === "string" ? ref.profile_image : null,
      };
    };

    const rows = requests.map((r) => ({
      _id: r._id,
      problem_type: r.problem_type,
      status: r.status,
      createdAt: r.createdAt,
      user: pickPerson(r.user_id),
      technician: pickPerson(r.technician_id),
    }));

    return { stats, requests: rows };
  },
};
