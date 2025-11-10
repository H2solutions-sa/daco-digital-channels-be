"use client";
export default function TimeChip({
  children,
  tone = "blue",
}: {
  children: React.ReactNode;
  tone?: "blue" | "amber" | "indigo";
}) {
  const map = {
    blue: "bg-[#E8EAFD] text-[#1F1B4E] border border-[#D9DCF8]",
    amber: "bg-[#FCEFD7] text-[#7A4E08] border border-[#F4D29E]",
    indigo: "bg-[#EFE9FF] text-[#4B3BA6] border border-[#D6C8FF]",
  } as const;
  return (
    <span
      className={[
        "inline-flex items-center rounded-md px-2.5 py-1 text-[13px] font-medium",
        map[tone],
      ].join(" ")}
    >
      {children}
    </span>
  );
}