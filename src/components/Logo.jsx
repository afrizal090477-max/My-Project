import React from "react";

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-[50px] h-[50px] rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 flex items-center justify-center text-white font-bold text-xl shadow">
        E
      </div>
      <span className="text-[22px] font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent select-none">
        E-Meeting
      </span>
    </div>
  );
}
