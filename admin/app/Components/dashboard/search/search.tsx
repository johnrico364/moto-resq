import { ICONS } from "@/app/Shared/Constants/icons";
import { useState } from "react";

interface SearchProps {
  onSubmit: (key: string) => void;
}

export function Search({ onSubmit }: SearchProps) {
  const [key, setKey] = useState<string>("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(key);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center w-full bg-white rounded-full px-8 py-4"
    >
      <button
        type="submit"
        className="focus:outline-none hover:opacity-80 transition-opacity flex items-center justify-center"
      >
        <ICONS.search size={28} className="text-gray-500" />
      </button>

      <input
        type="text"
        className="flex-1 w-full ml-4 text-xl text-gray-800 bg-transparent border-none outline-none placeholder-gray-400 focus:ring-0"
        placeholder="Search"
        onChange={(e) => setKey(e.target.value)}
      />
    </form>
  );
}
