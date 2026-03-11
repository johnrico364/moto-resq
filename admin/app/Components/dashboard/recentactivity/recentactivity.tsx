export function RecentActivity() {
  return (
    <div className="w-full bg-white rounded-[24px] p-6 lg:px-8 py-5 flex flex-col md:flex-row gap-6 md:gap-8 md:items-center justify-between font-sans shadow-sm border border-transparent">
      <div className="flex items-center gap-5 w-full md:w-[45%]">
        <img
          className="w-16 h-16 rounded-full object-cover shrink-0"
          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"
          alt="Charlene A. Barrientos"
        />
        <div className="flex flex-col gap-1.5 pt-1">
          <div className="flex items-center gap-3">
            <span className="text-gray-900 font-bold text-[17px] leading-tight tracking-tight">
              Charlene A. Barrientos
            </span>
            <span className="bg-[#FFEAC2] text-[#EC9A25] px-3.5 py-0.5 rounded-[12px] text-[13px] font-medium leading-normal tracking-wide mt-[-2px]">
              User
            </span>
          </div>
          <span className="text-gray-500 text-[15.5px] font-normal leading-tight">
            March 10, 2026 | 10:30 AM
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-[7px] w-full md:w-[40%] pl-2 lg:pl-0 mt-4 md:mt-0">
        <span className="text-gray-900 font-bold text-[16px] leading-tight">
          Activity
        </span>
        <span className="text-gray-500 text-[15.5px] font-normal leading-tight">
          Requested roadside assistance
        </span>
      </div>

      <div className="flex flex-col gap-2 w-full md:w-[15%] items-start md:items-end mt-4 md:mt-0 pr-4">
        <div className="w-full max-w-[max-content] flex flex-col items-start gap-1.5 md:ml-0 md:pl-2">
          <span className="text-gray-900 font-bold text-[16px] leading-tight mb-1 pl-0.5">
            Status
          </span>
          <span className="bg-[#FAFDCD] text-[#BECE40] px-4 py-1.5 rounded-full text-[14px] font-medium leading-none whitespace-nowrap">
            Pending
          </span>
        </div>
      </div>
    </div>
  );
}