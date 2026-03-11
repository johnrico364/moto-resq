"use client";
import { Search } from "../Components/dashboard/search/search";
import { NotificationAndHelp } from "../Components/dashboard/notificationandhelp/notificationandhelp";
import { ActiveUser } from "../Components/dashboard/activeuser/activeuser";
import { Cards } from "../Components/dashboard/cards/card";
import { NewRequest } from "../Components/dashboard/newrequest/newrequest";
import { NewUser } from "../Components/dashboard/newuser/newuser";
import { RecentActivity } from "../Components/dashboard/recentactivity/recentactivity";

export default function Dashboard() {
  const search = (key: string) => {
    console.log(key);
  };
  const notification = () => {
    console.log("notification click");
  };
  const help = () => {
    console.log("help click");
  };
  const dropDown = () => {
    console.log("drop down");
  };

  return (
    <div className="flex flex-col items-start justify-start w-full">
      <div className="flex items-center justify-between w-full p-0 m-0">
        <div className="flex-1 w-full max-w-3xl mr-8">
          <Search onSubmit={search} />
        </div>

        <div className="flex items-center gap-10">
          <NotificationAndHelp
            onNotificationClick={notification}
            onHelpClick={help}
          />
          <ActiveUser
            username="Cedrick"
            email="cedrickalegsao@gmail.com"
            avatarUrl=""
            onDropdown={dropDown}
          />
        </div>
      </div>

      <div className="mt-12 w-full m-0 p-0 text-left block">
        <h1 className="text-4xl font-extrabold text-[#110D8C] tracking-tight m-0 block ml-1">
          Dashboard
        </h1>
      </div>

      <div className="mt-10 w-full ml-1 pr-1 flex flex-col">
        <div className="mb-4">
          <span className="text-[1.1rem] font-bold text-gray-900 tracking-wide">
            Overview
          </span>
        </div>

        <div className="grid w-full grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-8">
          <Cards
            count="1,035"
            subtitle="Completed Services"
            icon_name="dashboard"
          />
          <Cards
            count="1,080"
            subtitle="Registered Technicians"
            icon_name="drill"
          />
          <Cards count="98" subtitle="Service Requests" icon_name="receipt" />
          <Cards count="1,080" subtitle="Registered Users" icon_name="users" />
        </div>
      </div>

      <div className="mt-12 w-full ml-1 pr-1 flex flex-col xl:flex-row gap-6 xl:gap-8 items-start justify-start">
        <div className="flex flex-1 flex-col min-w-0 w-full xl:w-[auto]">
          <div className="mb-4 w-full px-1">
            <span className="text-[1.2rem] font-[800] text-[#0A0A0A] tracking-wide block">
              New Request
            </span>
          </div>
          <div className="w-full flex block shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] rounded-[24px]">
            <NewRequest />
          </div>
        </div>

        <div className="flex shrink-0 w-full flex-col min-w-0 xl:w-[350px] 2xl:w-[420px]">
          <div className="mb-4 w-full px-1">
            <span className="text-[1.2rem] font-[800] text-[#0A0A0A] tracking-wide block">
              New User
            </span>
          </div>
          <div className="w-full shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] rounded-[24px]">
            <NewUser />
          </div>
        </div>
      </div>
      
      <div className="mt-12 w-full ml-1 pr-1 flex flex-col mb-8">
        <div className="mb-4 w-full px-1">
          <span className="text-[1.2rem] font-[800] text-[#0A0A0A] tracking-wide block">
            Recent Activity
          </span>
        </div>
        <div className="flex flex-col w-full gap-4 p-0 m-0">
            <RecentActivity/>
            <RecentActivity/>
            <RecentActivity/>
            <RecentActivity/>
        </div>
      </div>
    </div>
  );
}