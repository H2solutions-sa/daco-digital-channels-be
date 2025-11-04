"use client";
import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSearch?: () => void;
  placeholder?: string;
  id?: string;
  buttonLabel?: string;
};

export default function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Flight no: RB490, airline, destination",
  id = "flight-search",
  buttonLabel = "Search Flight",
}: Props) {
  return (
    <div className="flex w-full flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
      <label htmlFor={id} className="sr-only">
        Search flights
      </label>
      <div className="relative flex-1">
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-11 sm:h-12 rounded-xl border border-neutral-300 bg-white
            pl-10 pr-3 sm:pl-11 sm:pr-4 text-[14px] sm:text-[15px]
            text-black placeholder:text-gray-500 outline-none
            focus:border-[color:var(--kfia-brand)]
            focus:ring-2 focus:ring-[color:var(--kfia-brand)]/30"
        />
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] text-neutral-400" />
      </div>
      <button
        onClick={onSearch}
        className="
          h-11 sm:h-12 px-4 sm:px-5 rounded-xl
          bg-[color:var(--kfia-brand)] text-white text-[16px] font-medium
          hover:opacity-90 active:opacity-95
          w-full sm:w-auto whitespace-nowrap
        "
      >
        {buttonLabel}
      </button>
    </div>
  );
}