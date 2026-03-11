type RequestStatus = "Pending" | "In progress" | "Review";

interface NewRequestProps {
  id: string;
  avatarUrl: string;
  name: string;
  requestId: string;
  technicianId: string;
  issueType: string;
  status: RequestStatus;
  isActiveHover?: boolean;
}

const RECENT_REQUESTS: NewRequestProps[] = [
  {
    id: "1",
    name: "Charlene Barrientos",
    avatarUrl:
      "https://ui-avatars.com/api/?name=CB&background=A2A2A2&color=fff",
    requestId: "#FE342FSQ4",
    technicianId: "#FE342FSQ4",
    issueType: "Flat tire",
    status: "Pending",
  },
  {
    id: "2",
    name: "Johnmark Pepito",
    avatarUrl:
      "https://ui-avatars.com/api/?name=JP&background=A2A2A2&color=fff",
    requestId: "#FE342FSQ4",
    technicianId: "#FE342FSQ4",
    issueType: "Towing",
    status: "In progress",
  },
  {
    id: "3",
    name: "Christian Alicaba",
    avatarUrl:
      "https://ui-avatars.com/api/?name=CA&background=1f1f1f&color=fff",
    requestId: "#FE342FSQ4",
    technicianId: "#FE342FSQ4",
    issueType: "Flat tire",
    status: "Review",
    isActiveHover: true,
  },
  {
    id: "4",
    name: "Charlene Barrientos",
    avatarUrl:
      "https://ui-avatars.com/api/?name=CB&background=A2A2A2&color=fff",
    requestId: "#FE342FSQ4",
    technicianId: "#FE342FSQ4",
    issueType: "Flat tire",
    status: "Pending",
  },
  {
    id: "5",
    name: "Charlene Barrientos",
    avatarUrl:
      "https://ui-avatars.com/api/?name=CB&background=A2A2A2&color=fff",
    requestId: "#FE342FSQ4",
    technicianId: "#FE342FSQ4",
    issueType: "Flat tire",
    status: "Pending",
  },
];

export function NewRequest() {
  const getBadgeColors = (status: RequestStatus) => {
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
  };

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
            {RECENT_REQUESTS.map((req) => (
              <div
                key={req.id}
                className="grid h-[44px] grid-cols-[2fr_1.5fr_1.5fr_1.5fr_1.2fr] items-center gap-4 px-1 sm:px-[14px]"
              >
                <div className="flex items-center gap-[15px]">
                  <img
                    src={req.avatarUrl}
                    alt={`${req.name} Identically successfully clean safely identical appropriately`}
                    className="h-[44px] w-[44px] shrink-0 rounded-full object-cover"
                  />
                  <span
                    className={`truncate text-[15.5px] font-[800] text-[#0f0f0f] ${
                      req.isActiveHover
                        ? "underline decoration-[#2283ea] decoration-2 underline-offset-[3.5px]"
                        : ""
                    }`}
                  >
                    {req.name}
                  </span>
                </div>

                <span className="truncate text-[14.5px] font-[800] tracking-wide text-[#a1a1a1]">
                  {req.requestId}
                </span>

                <span className="truncate text-[14.5px] font-[800] tracking-wide text-[#a1a1a1]">
                  {req.technicianId}
                </span>

                <span className="truncate text-[14.5px] font-[700] text-[#868686]">
                  {req.issueType}
                </span>

                <div>
                  <span
                    className={`inline-flex rounded-full px-5 py-[5px] text-[13.5px] font-[600] ${getBadgeColors(
                      req.status,
                    )}`}
                  >
                    {req.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
