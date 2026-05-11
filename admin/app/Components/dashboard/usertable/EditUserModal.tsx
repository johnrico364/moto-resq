"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { ICONS } from "@/app/Shared/Constants/icons";
import {
  patchUser,
  type DashboardUser,
  type DashboardVehicle,
  type UserRole,
  type UserStatus,
  type VehicleType,
} from "@/app/Services/User/useUser";

interface EditUserModalProps {
  user: DashboardUser;
  onClose: () => void;
  onSaved: () => void;
}

function emptyVehicle(): DashboardVehicle {
  return {
    type: "Motorcycle",
    brand: "",
    model: "",
    plate_number: "",
  };
}

const inputClass =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500";
const labelClass = "block text-sm font-semibold text-gray-900 mb-1.5";

export function EditUserModal({ user, onClose, onSaved }: EditUserModalProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [status, setStatus] = useState<UserStatus>(user.status);
  const [role, setRole] = useState<UserRole>(user.role);
  const [vehicles, setVehicles] = useState<DashboardVehicle[]>(() =>
    user.vehicles.length > 0 ? user.vehicles.map((v) => ({ ...v })) : [],
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addVehicle = () => {
    setVehicles((prev) => [...prev, emptyVehicle()]);
  };

  const removeVehicle = (index: number) => {
    setVehicles((prev) => prev.filter((_, i) => i !== index));
  };

  const updateVehicle = <K extends keyof DashboardVehicle>(
    index: number,
    key: K,
    value: DashboardVehicle[K],
  ) => {
    setVehicles((prev) => {
      const next = [...prev];
      const row = { ...next[index], [key]: value };
      next[index] = row;
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    const vehiclesPayload = vehicles.map((v) => ({
      ...(v._id ? { _id: v._id } : {}),
      type: v.type,
      brand: v.brand.trim(),
      model: v.model.trim(),
      plate_number: v.plate_number.trim(),
    }));

    const payload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      status,
      role,
      vehicles: vehiclesPayload,
      ...(user.profileImage && !imageFile ? { profile_image: user.profileImage } : {}),
    };

    const result = await patchUser(user.id, payload, imageFile);

    setIsSubmitting(false);

    if (!result.ok) {
      setSubmitError(result.message ?? "Update failed.");
      return;
    }

    onSaved();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="bg-white rounded-2xl w-full max-w-3xl mx-4 shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="edit-user-title"
      >
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 shrink-0">
          <h2 id="edit-user-title" className="text-lg font-semibold text-gray-900">
            Edit user
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ICONS.close className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="overflow-y-auto flex-1 px-8 py-6 space-y-6">
            {submitError && (
              <p className="text-sm text-red-500" role="alert">
                {submitError}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="edit-user-name" className={labelClass}>
                  Name
                </label>
                <input
                  id="edit-user-name"
                  className={inputClass}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="edit-user-email" className={labelClass}>
                  Email
                </label>
                <input
                  id="edit-user-email"
                  type="email"
                  className={inputClass}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-user-phone" className={labelClass}>
                  Phone
                </label>
                <input
                  id="edit-user-phone"
                  className={inputClass}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-user-status" className={labelClass}>
                  Status
                </label>
                <select
                  id="edit-user-status"
                  className={inputClass}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as UserStatus)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <div>
                <label htmlFor="edit-user-role" className={labelClass}>
                  Role
                </label>
                <select
                  id="edit-user-role"
                  className={inputClass}
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <span className={labelClass}>Profile image</span>
                {user.profileImage && (
                  <p className="text-xs text-gray-400 mb-2">
                    Current file: {user.profileImage}
                  </p>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900">Vehicles</h3>
                <button
                  type="button"
                  onClick={addVehicle}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add vehicle
                </button>
              </div>

              {vehicles.length === 0 ? (
                <p className="text-sm text-gray-400">No vehicles. Add one if needed.</p>
              ) : (
                <div className="space-y-4">
                  {vehicles.map((v, index) => (
                    <div
                      key={v._id ?? `new-${index}`}
                      className="border border-gray-200 rounded-xl p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-gray-700">
                          Vehicle {index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeVehicle(index)}
                          className="text-gray-400 hover:text-red-500 p-1"
                          aria-label="Remove vehicle"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className={`${labelClass} text-xs`}>Type</label>
                          <select
                            className={inputClass}
                            value={v.type}
                            onChange={(e) =>
                              updateVehicle(index, "type", e.target.value as VehicleType)
                            }
                          >
                            <option value="Motorcycle">Motorcycle</option>
                            <option value="Car">Car</option>
                          </select>
                        </div>
                        <div>
                          <label className={`${labelClass} text-xs`}>Plate number</label>
                          <input
                            className={inputClass}
                            value={v.plate_number}
                            onChange={(e) =>
                              updateVehicle(index, "plate_number", e.target.value)
                            }
                            required
                          />
                        </div>
                        <div>
                          <label className={`${labelClass} text-xs`}>Brand</label>
                          <input
                            className={inputClass}
                            value={v.brand}
                            onChange={(e) => updateVehicle(index, "brand", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className={`${labelClass} text-xs`}>Model</label>
                          <input
                            className={inputClass}
                            value={v.model}
                            onChange={(e) => updateVehicle(index, "model", e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-8 py-4 border-t border-gray-100 shrink-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
