import { ICONS } from "@/app/Shared/Constants/icons";

interface CardsProps {
  count?: number | string;
  subtitle: string;
  icon_name: keyof typeof ICONS;
}

export function Cards({ count, subtitle, icon_name }: CardsProps) {
  const Icon = ICONS[icon_name];

  return (
    <div className="flex w-full items-center justify-between rounded-[24px] bg-white p-6 shadow-sm gap-4">
      <div className="flex flex-1 min-w-0 flex-col justify-center text-left">
        <span className="text-[32px] font-bold leading-tight tracking-tight text-gray-900 truncate">
          {count}
        </span>

        <span className="mt-1 text-[15px] font-medium text-gray-400 truncate block">
          {subtitle}
        </span>
      </div>

      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#cce1f9]">
        {Icon && <Icon size={28} className="text-gray-900" />}
      </div>
    </div>
  );
}
