"use client";
import { useState } from "react";
import Image from "next/image";
import { ICONS } from "@/app/Shared/Constants/icons";
import type { TechnicianDocumentItem } from "@/app/Services/Technicians/useTechnicians";

interface TechnicianProfile {
  name: string;
  avatarUrl: string | undefined;
  registeredDate: string;
  isVerified: boolean;
  isAvailable: boolean;
  expertise: string[];
  phone: string;
  email: string;
  location: string;
  documents: TechnicianDocumentItem[];
  rating: number;
  totalReviews: number;
}

interface ViewMemberProps {
  profile: TechnicianProfile;
  onClose: () => void;
}

function Avatar({ name, src }: { name: string; src: string | undefined }) {
  const [imgError, setImgError] = useState(false);
  const initial = name.charAt(0).toUpperCase();

  if (!src || imgError) {
    return (
      <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
        <span className="text-white font-semibold text-2xl">{initial}</span>
      </div>
    );
  }

  return (
    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 shrink-0">
      <Image
        src={src}
        alt={name}
        width={80}
        height={80}
        className="object-cover w-full h-full"
        onError={() => setImgError(true)}
        unoptimized
      />
    </div>
  );
}

function DocumentLink({ doc }: { doc: TechnicianDocumentItem }) {
  return (
    <a
      href={doc.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 min-w-[160px] hover:bg-gray-50 transition-colors"
    >
      <ICONS.file_text className="text-gray-400 w-5 h-5 shrink-0" />
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-800">{doc.label}</span>
        <span className="text-xs text-blue-600 truncate max-w-[200px]">Open link</span>
      </div>
    </a>
  );
}

const PROFILE_ROWS = (profile: TechnicianProfile) => [
  { label: "Phone Number", value: profile.phone },
  { label: "Email Address", value: profile.email },
  { label: "Location", value: profile.location || "—" },
  {
    label: "Rating",
    value:
      profile.totalReviews > 0
        ? `${profile.rating.toFixed(1)} (${profile.totalReviews} reviews)`
        : "No reviews yet",
  },
];

export function ViewMember({ profile, onClose }: ViewMemberProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-5xl mx-4 shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">Profile View</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ICONS.close className="w-5 h-5" />
          </button>
        </div>

        <div className="flex overflow-y-auto flex-1 min-h-0">
          <div className="w-72 shrink-0 px-8 py-7 border-r border-gray-100 flex flex-col gap-4">
            <Avatar name={profile.name} src={profile.avatarUrl} />

            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-bold text-gray-900">{profile.name}</h3>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-gray-500 font-medium">Register</span>
              <span className="text-sm text-gray-400">{profile.registeredDate || "—"}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium w-fit ${
                  profile.isVerified
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    profile.isVerified ? "bg-green-500" : "bg-amber-500"
                  }`}
                />
                {profile.isVerified ? "Verified" : "Pending verification"}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium w-fit ${
                  profile.isAvailable
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {profile.isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>

            <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
              <h4 className="text-base font-bold text-gray-900">Expertise</h4>
              <div className="flex flex-wrap gap-2">
                {profile.expertise.length === 0 ? (
                  <span className="text-sm text-gray-400">—</span>
                ) : (
                  profile.expertise.map((skill) => (
                    <span
                      key={skill}
                      className="border border-gray-200 rounded-lg px-4 py-1.5 text-sm text-gray-700 font-medium"
                    >
                      {skill}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 px-8 py-7 flex flex-col gap-6 min-w-0">
            {PROFILE_ROWS(profile).map(({ label, value }) => (
              <div key={label} className="flex items-start gap-6">
                <span className="w-36 shrink-0 text-sm font-semibold text-gray-900">
                  {label}
                </span>
                <span className="text-sm text-gray-600 break-words">{value}</span>
              </div>
            ))}

            <div className="flex items-start gap-6">
              <span className="w-36 shrink-0 text-sm font-semibold text-gray-900">
                Documents
              </span>
              <div className="flex flex-wrap gap-3">
                {profile.documents.length === 0 ? (
                  <span className="text-sm text-gray-400">No documents on file.</span>
                ) : (
                  profile.documents.map((doc) => (
                    <DocumentLink key={`${doc.label}-${doc.url}`} doc={doc} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
