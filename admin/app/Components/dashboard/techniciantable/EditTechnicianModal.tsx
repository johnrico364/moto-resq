"use client";

import { useState } from "react";
import { ICONS } from "@/app/Shared/Constants/icons";
import {
  patchTechnician,
  TECHNICIAN_EXPERTISE_OPTIONS,
  type DashboardTechnician,
} from "@/app/Services/Technicians/useTechnicians";

interface EditTechnicianModalProps {
  technician: DashboardTechnician;
  onClose: () => void;
  onSaved: () => void;
}

const inputClass =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500";
const labelClass = "block text-sm font-semibold text-gray-900 mb-1.5";

function parseLocationInit(location: string): { lat: string; lng: string } {
  const parts = location.split(",").map((s) => s.trim());
  if (parts.length >= 2) {
    return { lat: parts[0] ?? "", lng: parts[1] ?? "" };
  }
  return { lat: "", lng: "" };
}

export function EditTechnicianModal({
  technician,
  onClose,
  onSaved,
}: EditTechnicianModalProps) {
  const [name, setName] = useState(technician.name);
  const [email, setEmail] = useState(technician.email);
  const [phone, setPhone] = useState(technician.phone);
  const [isVerified, setIsVerified] = useState(technician.is_verified);
  const [isAvailable, setIsAvailable] = useState(technician.is_available);
  const [expertise, setExpertise] = useState<string[]>(() => [...technician.expertise]);
  const [password, setPassword] = useState("");
  const [latStr, setLatStr] = useState(() => parseLocationInit(technician.location).lat);
  const [lngStr, setLngStr] = useState(() => parseLocationInit(technician.location).lng);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleExpertise = (skill: string) => {
    setExpertise((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    const lat = latStr.trim() === "" ? NaN : Number(latStr);
    const lng = lngStr.trim() === "" ? NaN : Number(lngStr);
    let location: { lat: number; lng: number } | null | undefined;
    if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
      location = { lat, lng };
    } else if (latStr.trim() === "" && lngStr.trim() === "") {
      location = null;
    } else {
      setSubmitError("Location requires valid numeric latitude and longitude, or leave both empty.");
      setIsSubmitting(false);
      return;
    }

    const expertisePayload = expertise.filter((e) =>
      (TECHNICIAN_EXPERTISE_OPTIONS as readonly string[]).includes(e),
    );

    const payload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      expertise: expertisePayload,
      is_verified: isVerified,
      is_available: isAvailable,
      ...(technician.profileImage && !imageFile
        ? { profile_image: technician.profileImage }
        : {}),
      ...(password.trim() ? { password: password.trim() } : {}),
      ...(location !== undefined ? { location } : {}),
    };

    const result = await patchTechnician(technician.id, payload, imageFile);

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
        aria-labelledby="edit-technician-title"
      >
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 shrink-0">
          <h2 id="edit-technician-title" className="text-lg font-semibold text-gray-900">
            Edit technician
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
                <label htmlFor="edit-tech-name" className={labelClass}>
                  Name
                </label>
                <input
                  id="edit-tech-name"
                  className={inputClass}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="edit-tech-email" className={labelClass}>
                  Email
                </label>
                <input
                  id="edit-tech-email"
                  type="email"
                  className={inputClass}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-tech-phone" className={labelClass}>
                  Phone
                </label>
                <input
                  id="edit-tech-phone"
                  className={inputClass}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-tech-password" className={labelClass}>
                  New password (optional)
                </label>
                <input
                  id="edit-tech-password"
                  type="password"
                  autoComplete="new-password"
                  className={inputClass}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep current"
                />
              </div>
              <div>
                <span className={labelClass}>Verified</span>
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVerified}
                    onChange={(e) => setIsVerified(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Approved / verified</span>
                </label>
              </div>
              <div>
                <span className={labelClass}>Available for jobs</span>
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Currently available</span>
                </label>
              </div>
              <div>
                <label htmlFor="edit-tech-lat" className={labelClass}>
                  Latitude (optional)
                </label>
                <input
                  id="edit-tech-lat"
                  className={inputClass}
                  value={latStr}
                  onChange={(e) => setLatStr(e.target.value)}
                  placeholder="e.g. 14.5995"
                />
              </div>
              <div>
                <label htmlFor="edit-tech-lng" className={labelClass}>
                  Longitude (optional)
                </label>
                <input
                  id="edit-tech-lng"
                  className={inputClass}
                  value={lngStr}
                  onChange={(e) => setLngStr(e.target.value)}
                  placeholder="e.g. 120.9842"
                />
              </div>
              <div className="sm:col-span-2">
                <span className={labelClass}>Profile image</span>
                {technician.profileImage && (
                  <p className="text-xs text-gray-400 mb-2">
                    Current file: {technician.profileImage}
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
              <h3 className="text-base font-bold text-gray-900 mb-3">Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {TECHNICIAN_EXPERTISE_OPTIONS.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleExpertise(skill)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                      expertise.includes(skill)
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
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
