"use client";
import { Filter } from "@/app/Components/dashboard/filter/filter";

export default function Users() {
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between mt-6 mb-8">
        <h1 className="text-4xl font-extrabold text-[#110D8C] tracking-tight">
          Users
        </h1>
        <Filter />
      </div>
    </div>
  );
}