import type { DashboardNewRequest } from "@/app/Services/Dashboard/useDashboard";

type BadgeStatus = "Pending" | "In progress" | "Review";

interface NewRequestProps {
  items: DashboardNewRequest[];
  isLoading?: boolean;
}

function mapBadgeStatus(status: string): BadgeStatus {
  switch (status) {
    case "Pending":
      return "Pending";
    case "Completed":
    case "Cancelled":
      return "Review";
    default:
      return "In progress";
  }
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

function getBadgeColors(status: BadgeStatus): string {
  switch (status) {
    case "Pending":
      return "bg-[#FCFDCA] text-[#CAD842]";
    case "In progress":
      return "bg-[#FFE0BE] text-[#FC9E23]";
    case "Review":
      return "bg-[#A7CFFF] text-[#4FA1ED]";
    default:
      return "bg-gray-100 text-gray-500";
  }
}

export function NewRequest({ items, isLoading = false }: NewRequestProps) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-[24px] bg-white p-7 xl:mx-0">
      <div className="w-full overflow-x-auto">
        <div className="flex min-w-[660px] flex-col">
          <div className="mb-6 grid min-h-[44px] grid-cols-[2fr_1.5fr_1.5fr_1.5fr_1.2fr] items-center gap-4 border-b border-[#F0F0F0] px-1 pb-[18px] sm:px-[14px]">
            <span className="text-[15.5px] font-[800] tracking-wide text-[#a1a1a1]">
              User Name
            </span>
            <span className="text-[15.5px] font-[800] tracking-wide text-[#a1a1a1]">
              Request ID
            </span>
            <span className="text-[15.5px] font-[800] tracking-wide text-[#a1a1a1]">
              Technician ID
            </span>
            <span className="text-[15.5px] font-[800] tracking-wide text-[#a1a1a1]">
              Type of issue
            </span>
            <span className="text-[15.5px] font-[800] tracking-wide text-[#a1a1a1]">
              Status
            </span>
          </div>

          <div className="flex flex-col gap-[20px] pt-[2px]">
            {isLoading && items.length === 0 ? (
              <p className="px-2 py-6 text-sm text-gray-500">Loading…</p>
            ) : items.length === 0 ? (
              <p className="px-2 py-6 text-sm text-gray-500">
                No service requests yet.
              </p>
            ) : (
              items.map((req) => {
                const badge = mapBadgeStatus(req.status);
                const userName = req.user?.name ?? "Unknown user";
                const avatar =
                  req.user?.avatarUrl ?? avatarFallback(userName);
                const technicianId = req.technician
                  ? `#${req.technician.id.slice(-7).toUpperCase()}`
                  : "—";
                return (
                  <div
                    key={req.id}
                    className="grid h-[44px] grid-cols-[2fr_1.5fr_1.5fr_1.5fr_1.2fr] items-center gap-4 px-1 sm:px-[14px]"
                  >
                    <div className="flex items-center gap-[15px]">
                      <img
                        src={avatar}
                        alt={userName}
                        className="h-[44px] w-[44px] shrink-0 rounded-full object-cover"
                      />
                      <span className="truncate text-[15.5px] font-[800] text-[#0f0f0f]">
                        {userName}
                      </span>
                    </div>

                    <span className="truncate text-[14.5px] font-[800] tracking-wide text-[#a1a1a1]">
                      {req.requestId}
                    </span>

                    <span className="truncate text-[14.5px] font-[800] tracking-wide text-[#a1a1a1]">
                      {technicianId}
                    </span>

                    <span className="truncate text-[14.5px] font-[700] text-[#868686]">
                      {req.problemType}
                    </span>

                    <div>
                      <span
                        className={`inline-flex rounded-full px-5 py-[5px] text-[13.5px] font-[600] ${getBadgeColors(
                          badge,
                        )}`}
                      >
                        {badge}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
