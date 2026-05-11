import type { DashboardRecentRequest } from "@/app/Services/Dashboard/useDashboard";

interface RecentActivityProps {
  item: DashboardRecentRequest;
}

function avatarFallback(name: string): string {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
  const safe = encodeURIComponent(initials || "?");
  return `https://ui-avatars.com/api/?name=${safe}&background=A2A2A2&color=fff`;
}

function formatTimestamp(raw: string): string {
  if (!raw) return "—";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  const date = d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${date} | ${time}`;
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case "Pending":
      return "bg-[#FAFDCD] text-[#BECE40]";
    case "Accepted":
    case "On the Way":
    case "Arrived":
    case "In Progress":
      return "bg-[#FFE0BE] text-[#FC9E23]";
    case "Completed":
      return "bg-[#D8F5DC] text-[#2EAA46]";
    case "Cancelled":
      return "bg-[#FBD5D5] text-[#D94545]";
    default:
      return "bg-gray-100 text-gray-500";
  }
}

export function RecentActivity({ item }: RecentActivityProps) {
  const userName = item.user?.name ?? "Unknown user";
  const avatar = item.user?.avatarUrl ?? avatarFallback(userName);
  const badgeClass = getStatusBadgeClass(item.status);

  return (
    <div className="w-full bg-white rounded-[24px] p-6 lg:px-8 py-5 flex flex-col md:flex-row gap-6 md:gap-8 md:items-center justify-between font-sans shadow-sm border border-transparent">
      <div className="flex items-center gap-5 w-full md:w-[45%]">
        <img
          className="w-16 h-16 rounded-full object-cover shrink-0"
          src={avatar}
          alt={userName}
        />
        <div className="flex flex-col gap-1.5 pt-1">
          <div className="flex items-center gap-3">
            <span className="text-gray-900 font-bold text-[17px] leading-tight tracking-tight">
              {userName}
            </span>
            <span className="bg-[#FFEAC2] text-[#EC9A25] px-3.5 py-0.5 rounded-[12px] text-[13px] font-medium leading-normal tracking-wide mt-[-2px]">
              User
            </span>
          </div>
          <span className="text-gray-500 text-[15.5px] font-normal leading-tight">
            {formatTimestamp(item.createdAt)}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-[7px] w-full md:w-[40%] pl-2 lg:pl-0 mt-4 md:mt-0">
        <span className="text-gray-900 font-bold text-[16px] leading-tight">
          Activity
        </span>
        <span className="text-gray-500 text-[15.5px] font-normal leading-tight">
          Requested {item.problemType} assistance
        </span>
      </div>

      <div className="flex flex-col gap-2 w-full md:w-[15%] items-start md:items-end mt-4 md:mt-0 pr-4">
        <div className="w-full max-w-[max-content] flex flex-col items-start gap-1.5 md:ml-0 md:pl-2">
          <span className="text-gray-900 font-bold text-[16px] leading-tight mb-1 pl-0.5">
            Status
          </span>
          <span
            className={`${badgeClass} px-4 py-1.5 rounded-full text-[14px] font-medium leading-none whitespace-nowrap`}
          >
            {item.status}
          </span>
        </div>
      </div>
    </div>
  );
}
