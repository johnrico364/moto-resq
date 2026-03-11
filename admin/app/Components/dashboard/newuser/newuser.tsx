import { ICONS } from "@/app/Shared/Constants/icons";
interface NewUserProps {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

const MOCK_USERS: NewUserProps[] = [
  {
    id: "1",
    name: "Joshua Mark H. Playda",
    email: "JoshuaMark@gmail.com",
    avatarUrl:
      "https://ui-avatars.com/api/?name=JM&background=e7e7e7&color=333",
  },
  {
    id: "2",
    name: "Joshua Mark H. Playda",
    email: "JoshuaMark@gmail.com",
    avatarUrl:
      "https://ui-avatars.com/api/?name=JM&background=e7e7e7&color=333",
  },
  {
    id: "3",
    name: "Joshua Mark H. Playda",
    email: "JoshuaMark@gmail.com",
    avatarUrl:
      "https://ui-avatars.com/api/?name=JM&background=e7e7e7&color=333",
  },
  {
    id: "4",
    name: "Joshua Mark H. Playda",
    email: "JoshuaMark@gmail.com",
    avatarUrl:
      "https://ui-avatars.com/api/?name=JM&background=e7e7e7&color=333",
  },
  {
    id: "5",
    name: "Joshua Mark H. Playda",
    email: "JoshuaMark@gmail.com",
    avatarUrl:
      "https://ui-avatars.com/api/?name=JM&background=e7e7e7&color=333",
  },
];

export function NewUser() {
  const BRAND_COLOR = {
    icon_blue: "text-[#2481EB]",
    button_bg: "bg-[#2181F0]",
  };

  return (
    <div className="mx-auto flex w-full max-w-[480px] flex-col overflow-hidden rounded-[24px] bg-white p-7 xl:mx-0">
      <div className="mb-6 flex min-h-[44px] items-center justify-between border-b border-[#f1f1f1] px-1 pb-[18px]">
        <h2 className="text-[17.5px] font-[800] tracking-tight text-[#0f0f0f]">
          User
        </h2>

        <button
          className={`group flex items-center gap-[5px] rounded-full px-4 py-[8px] transition-colors hover:bg-blue-600 ${BRAND_COLOR.button_bg}`}
        >
          <span className="text-[12px] font-[600] leading-none tracking-wide text-white">
            See all
          </span>
          <ICONS.move_right
            className="text-white transition-transform group-hover:translate-x-0.5"
            height={18}
            width={18}
          />
        </button>
      </div>
      <div className="flex flex-col gap-[20px] pt-[2px]">
        {MOCK_USERS.map((user) => (
          <div
            key={user.id}
            className="flex h-[44px] items-center justify-between"
          >
            <div className="flex min-w-0 flex-1 items-center gap-[15px]">
              <img
                src={user.avatarUrl}
                alt={`${user.name}'s Default Shape mapped properties.`}
                className="h-[44px] w-[44px] shrink-0 rounded-full object-cover"
              />

              <div className="flex min-w-0 flex-1 flex-col text-left justify-center pb-[2px]">
                <span className="truncate text-[15.5px] font-[800] tracking-tight text-[#0f0f0f] leading-snug">
                  {user.name}
                </span>
                <span className="truncate text-[12.5px] font-[600] tracking-tight text-[#a1a1a1] leading-tight">
                  {user.email}
                </span>
              </div>
            </div>

            <div
              className={`flex shrink-0 items-center space-x-[15px] pl-2 ${BRAND_COLOR.icon_blue}`}
            >
              <button className="transition hover:opacity-75">
                <ICONS.user />
              </button>
              <button className="transition hover:opacity-75">
                <ICONS.message />
              </button>
              <button className="transition hover:opacity-75">
                <ICONS.phone />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
