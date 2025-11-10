"use client";

import React from "react";

type MetaCellProps = {
  icon: React.ReactNode;
  label: React.ReactNode; // ← allow string or element
  children: React.ReactNode;
};

/**
 * MetaCell — used for displaying small data blocks in the flight meta grid
 * Example: Route, Flight No, Status, etc.
 */
export default function MetaCell({ icon, label, children }: MetaCellProps) {
  return (
    <div className="px-5 py-4">
      {/* Label (Title) */}
      <div className="flex items-center gap-2 text-[16px] text-neutral-600 font-medium">
        {icon}
        <span>{label}</span>
      </div>

      {/* Content (Data) */}
      <div className="mt-2 text-[20px] font-semibold text-neutral-900 leading-tight">
        {children}
      </div>
    </div>
  );
}