"use client";
import { Cards } from "../Components/dashboard/cards/card";
import { NewRequest } from "../Components/dashboard/newrequest/newrequest";
import { NewUser } from "../Components/dashboard/newuser/newuser";
import { RecentActivity } from "../Components/dashboard/recentactivity/recentactivity";

export default function Dashboard() {
  return (
    <div className="flex flex-col w-full">
      <div className="mt-6 mb-8">
        <h1 className="text-4xl font-extrabold text-[#110D8C] tracking-tight">
          Dashboard
        </h1>
      </div>
      <div className="mb-10">
        <span className="text-[1.1rem] font-bold text-gray-900 tracking-wide block mb-4">
          Overview
        </span>
        <div className="grid w-full grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <Cards count="1,035" subtitle="Completed Services" icon_name="dashboard" />
          <Cards count="1,080" subtitle="Registered Technicians" icon_name="drill" />
          <Cards count="98" subtitle="Service Requests" icon_name="receipt" />
          <Cards count="1,080" subtitle="Registered Users" icon_name="users" />
        </div>
      </div>
      <div className="flex flex-col xl:flex-row gap-8 mb-10 items-start">
        <div className="flex-1 min-w-0">
          <span className="text-[1.2rem] font-[800] text-[#0A0A0A] tracking-wide block mb-4">
            New Request
          </span>
          <div className="w-full shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] rounded-[24px]">
            <NewRequest />
          </div>
        </div>

        <div className="shrink-0 w-full xl:w-[350px] 2xl:w-[420px]">
          <span className="text-[1.2rem] font-[800] text-[#0A0A0A] tracking-wide block mb-4">
            New User
          </span>
          <div className="w-full shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] rounded-[24px]">
            <NewUser />
          </div>
        </div>
      </div>
      <div>
        <span className="text-[1.2rem] font-[800] text-[#0A0A0A] tracking-wide block mb-4">
          Recent Activity
        </span>
        <div className="flex flex-col gap-4">
          <RecentActivity />
          <RecentActivity />
          <RecentActivity />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}