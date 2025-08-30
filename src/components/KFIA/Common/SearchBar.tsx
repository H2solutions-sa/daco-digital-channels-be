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
    <div className="flex items-stretch gap-3">
      <label htmlFor={id} className="sr-only">
        Search flights
      </label>
      <div className="relative flex-1">
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-neutral-300 bg-white pl-11 pr-4 py-3 text-[15px] 
                     text-black placeholder:text-gray-500 
                     outline-none focus:border-[color:var(--kfia-brand)] 
                     focus:ring-2 focus:ring-[color:var(--kfia-brand)]/30"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-neutral-400" />
      </div>
      <button
        onClick={onSearch}
        className="px-4 h-12 rounded-xl text-white bg-[color:var(--kfia-brand)] text-sm font-medium"
      >
        {buttonLabel}
      </button>
    </div>
  );
}