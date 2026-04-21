"use client";
import { useState } from "react";
import Image from "next/image";
import { ICONS } from "@/app/Shared/Constants/icons";

type ActivityStatus = "Active" | "Inactive";

interface Document {
  name: string;
  date: string;
  size: string;
}

interface TechnicianProfile {
  name: string;
  avatar: string;
  registeredDate: string;
  status: ActivityStatus;
  expertise: string[];
  phone: string;
  email: string;
  location: string;
  documents: Document[];
}

interface ViewMemberProps {
  profile: TechnicianProfile;
  onClose: () => void;
}

function Avatar({ name, src }: { name: string; src: string }) {
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
      />
    </div>
  );
}

function DocumentCard({ doc }: { doc: Document }) {
  return (
    <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 min-w-[160px]">
      <ICONS.file_text className="text-gray-400 w-5 h-5 shrink-0" />
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-800">{doc.name}</span>
        <span className="text-xs text-gray-400">
          {doc.date} • {doc.size}
        </span>
      </div>
    </div>
  );
}

const PROFILE_ROWS = (profile: TechnicianProfile) => [
  { label: "Phone Number", value: profile.phone },
  { label: "Email Address", value: profile.email },
  { label: "Location", value: profile.location },
];

export function ViewMember({ profile, onClose }: ViewMemberProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-5xl mx-4 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Profile View</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ICONS.close className="w-5 h-5" />
          </button>
        </div>

        <div className="flex">
          <div className="w-72 shrink-0 px-8 py-7 border-r border-gray-100 flex flex-col gap-4">
            <Avatar name={profile.name} src={profile.avatar} />

            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-bold text-gray-900">
                {profile.name}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 font-medium">
                Register
              </span>
              <span className="text-sm text-gray-400">
                {profile.registeredDate}
              </span>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium w-fit ${
                profile.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  profile.status === "Active" ? "bg-green-500" : "bg-gray-400"
                }`}
              />
              {profile.status}
            </span>

            <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
              <h4 className="text-base font-bold text-gray-900">Expertise</h4>
              <div className="flex flex-wrap gap-2">
                {profile.expertise.map((skill) => (
                  <span
                    key={skill}
                    className="border border-gray-200 rounded-lg px-4 py-1.5 text-sm text-gray-700 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 px-8 py-7 flex flex-col gap-6">
            {PROFILE_ROWS(profile).map(({ label, value }) => (
              <div key={label} className="flex items-center gap-6">
                <span className="w-36 shrink-0 text-sm font-semibold text-gray-900">
                  {label}
                </span>
                <span className="text-sm text-gray-400">{value}</span>
              </div>
            ))}

            <div className="flex items-center gap-6">
              <span className="w-36 shrink-0 text-sm font-semibold text-gray-900">
                Documents
              </span>
              <div className="flex flex-wrap gap-3">
                {profile.documents.map((doc) => (
                  <DocumentCard key={doc.name} doc={doc} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
