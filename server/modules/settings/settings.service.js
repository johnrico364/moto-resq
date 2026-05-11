import User from "../user/user.model.js";
import { UserService } from "../user/user.service.js";
import ServiceCategory from "./service_category.model.js";

async function nextCategoryCode() {
  const docs = await ServiceCategory.find({}).select("code").lean();
  let max = 0;
  for (const d of docs) {
    const n = Number.parseInt(String(d.code), 10);
    if (Number.isFinite(n)) max = Math.max(max, n);
  }
  return String(max + 1).padStart(2, "0");
}

function stripPassword(doc) {
  if (!doc) return null;
  const o = typeof doc.toObject === "function" ? doc.toObject() : { ...doc };
  delete o.password;
  return o;
}

function toCategoryDto(doc) {
  return {
    id: doc.code,
    serviceName: doc.serviceName,
    description: doc.description ?? "",
    status: doc.status,
    _id: String(doc._id),
  };
}

export const SettingsService = {
  async getAdminProfile() {
    const admin = await User.findOne({
      role: "admin",
      is_deleted: { $ne: true },
    })
      .select("-password")
      .lean();

    if (!admin) {
      throw new Error("No admin user found");
    }

    return {
      userId: String(admin._id),
      fullName: admin.name,
      username: admin.username?.trim() || admin.name,
      email: admin.email,
      phone: admin.phone,
      avatarSrc: admin.profile_image ?? null,
    };
  },

  async updateAdminProfile(adminId, rawData, uploadedFilename) {
    const user = await User.findOne({
      _id: adminId,
      role: "admin",
      is_deleted: { $ne: true },
    });

    if (!user) {
      throw new Error("Admin not found");
    }

    const data = {};
    if (rawData?.name !== undefined) {
      data.name = String(rawData.name).trim();
    }
    if (rawData?.username !== undefined) {
      data.username = String(rawData.username).trim();
    }
    if (rawData?.email !== undefined) {
      data.email = String(rawData.email).trim().toLowerCase();
    }
    if (rawData?.phone !== undefined) {
      data.phone = String(rawData.phone).trim();
    }
    if (uploadedFilename) {
      data.profile_image = uploadedFilename;
    }

    const updated = await UserService.updateUser(adminId, data);
    return stripPassword(updated);
  },

  async listServiceCategories() {
    const rows = await ServiceCategory.find({}).lean();
    rows.sort((a, b) => {
      const na = Number.parseInt(String(a.code), 10);
      const nb = Number.parseInt(String(b.code), 10);
      if (Number.isFinite(na) && Number.isFinite(nb)) return na - nb;
      return String(a.code).localeCompare(String(b.code));
    });

    return rows.map((r) => toCategoryDto(r));
  },

  async createServiceCategory(payload) {
    const serviceName = String(payload?.serviceName ?? "").trim();
    if (!serviceName) {
      throw new Error("Service name is required");
    }

    const description =
      payload?.description !== undefined ? String(payload.description) : "";
    const status =
      payload?.status === "Inactive" ? "Inactive" : "Active";

    const code = await nextCategoryCode();

    const doc = await ServiceCategory.create({
      code,
      serviceName,
      description,
      status,
    });

    return toCategoryDto(doc);
  },

  async updateServiceCategory(id, payload) {
    const doc = await ServiceCategory.findById(id);
    if (!doc) {
      throw new Error("Service category not found");
    }

    if (payload?.serviceName !== undefined) {
      const name = String(payload.serviceName).trim();
      if (!name) throw new Error("Service name is required");
      doc.serviceName = name;
    }
    if (payload?.description !== undefined) {
      doc.description = String(payload.description);
    }
    if (payload?.status !== undefined) {
      doc.status = payload.status === "Inactive" ? "Inactive" : "Active";
    }

    await doc.save();

    return toCategoryDto(doc);
  },

  async deleteServiceCategory(id) {
    const doc = await ServiceCategory.findByIdAndDelete(id);
    if (!doc) {
      throw new Error("Service category not found");
    }
    return { deleted: true, id: String(doc._id) };
  },
};
