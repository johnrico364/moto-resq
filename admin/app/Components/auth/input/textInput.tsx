"use client";
import { useState } from "react";
import { ICONS } from "@/app/Shared/Constants/icons";

interface TextInputProps {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  error?: string;
  type?: "text" | "password";
  showToggle?: boolean;
  onChange: (value: string) => void;
}

export function TextInput({
  label, name, value, placeholder, error, type = "text", showToggle = false, onChange
}: TextInputProps) {
  const [visible, setVisible] = useState(false);

  const inputType = showToggle ? (visible ? "text" : "password") : type;

  return (
    <div className="mb-6">
      <label className="block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full outline-none py-3 text-black text-sm bg-transparent transition-colors duration-200 placeholder:text-gray-300 border-b-2 pr-10"
          style={{
            borderBottomColor: error ? "#f43f5e" : value ? "#1e88e5" : "#e5e7eb",
          }}
          placeholder={placeholder}
        />
        {showToggle && (
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className="absolute right-0 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: error ? "#f43f5e" : visible ? "#1e88e5" : "#9ca3af" }}
          >
            {visible ? <ICONS.eye_on size={16} /> : <ICONS.eye_off size={16} />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs" style={{ color: "#f43f5e" }}>
          {error}
        </p>
      )}
    </div>
  );
}