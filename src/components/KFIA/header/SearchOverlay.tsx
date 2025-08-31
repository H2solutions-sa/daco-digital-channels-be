"use client";
import { Search, X } from "lucide-react";

export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 bg-white flex items-center px-3 sm:px-4 gap-3 shadow-md h-[60px] sm:h-[70px] md:h-[84px]">
      <Search className="w-[18px] h-[18px] md:w-[20px] md:h-[20px] text-slate-500" />
      <input
        type="text"
        placeholder="Search flights, services..."
        className="flex-1 text-[15px] md:text-[16px] outline-none border-none font-sans"
        autoFocus
      />
      <button onClick={onClose} className="p-1" aria-label="Close search">
        <X className="w-5 h-5 text-slate-600" />
      </button>
    </div>
  );
}