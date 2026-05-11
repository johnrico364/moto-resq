"use client";
import { ICONS } from "@/app/Shared/Constants/icons";

interface SearchProps {
  value: string;
  onChange: (key: string) => void;
  onSubmit: (key: string) => void;
}

export function Search({ value, onChange, onSubmit }: SearchProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center w-full bg-white rounded-full px-8 py-4 border border-gray-200 shadow-sm"
    >
      <button
        type="submit"
        className="focus:outline-none hover:opacity-80 transition-opacity flex items-center justify-center"
      >
        <ICONS.search size={28} className="text-gray-500" />
      </button>

      <input
        type="text"
        value={value}
        className="flex-1 w-full ml-4 text-xl text-gray-800 bg-transparent border-none outline-none placeholder-gray-400 focus:ring-0"
        placeholder="Search"
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search users and technicians"
      />
    </form>
  );
}
