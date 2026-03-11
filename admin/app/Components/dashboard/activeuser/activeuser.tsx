import { ICONS } from "@/app/Shared/Constants/icons";

interface ActiveUserProps {
  username: string;
  email: string;
  avatarUrl?: string;
  onDropdown: () => void;
}

export function ActiveUser({
  username,
  email,
  onDropdown,
  avatarUrl,
}: ActiveUserProps) {
  return (
    <button
      onClick={onDropdown}
      className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none text-left"
    >
      <div className="w-[50px] h-[50px] rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={username}
            className="w-full h-full object-cover grayscale"
          />
        ) : (
          <ICONS.user size={28} className="text-gray-500" />
        )}
      </div>
      <div className="flex flex-col items-start justify-center">
        <span className="text-[20px] font-bold text-black leading-tight tracking-wide">
          {username}
        </span>
        <span className="text-[13px] font-semibold text-gray-500 leading-tight mt-0.5">
          {email}
        </span>
      </div>
      <div className="ml-2 flex items-center text-black">
        <ICONS.drop_down size={24} />
      </div>
    </button>
  );
}
