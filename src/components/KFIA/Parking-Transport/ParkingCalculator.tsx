import { JSX,useState } from 'react';
import { ComponentParams, ComponentRendering } from '@sitecore-jss/sitecore-jss-nextjs';
import { CalendarDays, ChevronLeft, ChevronRight, Calculator } from "lucide-react";

interface ParkingCalculatorProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
}

/* ---------- Helpers ---------- */
const pad = (n: number) => n.toString().padStart(2, "0");
const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const formatHuman = (d: Date | null) =>
  d ? `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}` : "";

function daysGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startWeekday = (first.getDay() + 6) % 7; // Mon=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();
  const cells: { d: number; inMonth: boolean; date: Date }[] = [];
  for (let i = startWeekday - 1; i >= 0; i--) {
    const day = prevDays - i;
    cells.push({ d: day, inMonth: false, date: new Date(year, month - 1, day) });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ d: day, inMonth: true, date: new Date(year, month, day) });
  }
  while (cells.length < 42) {
    const nextDay = cells.length - (startWeekday + daysInMonth) + 1;
    cells.push({ d: nextDay, inMonth: false, date: new Date(year, month + 1, nextDay) });
  }
  return cells;
}

/* ---------- Custom DateTime Field ---------- */
type DateTimeFieldProps = {
  value: Date | null;
  onChange: (d: Date | null) => void;
  placeholder: string;
  min?: Date | null;
};

function DateTimeField({ value, onChange, placeholder, min }: DateTimeFieldProps) {
  const [open, setOpen] = useState(false);
  const base = value ?? new Date();
  const [viewY, setViewY] = useState(base.getFullYear());
  const [viewM, setViewM] = useState(base.getMonth());
  const [hour, setHour] = useState(value ? value.getHours() : 0);
  const [minute, setMinute] = useState(value ? value.getMinutes() : 0);

  const today = new Date();
  const cells = daysGrid(viewY, viewM);

  const changeMonth = (delta: number) => {
    const m = new Date(viewY, viewM, 1);
    m.setMonth(m.getMonth() + delta);
    setViewY(m.getFullYear());
    setViewM(m.getMonth());
  };

  const applyTime = (h: number, m: number) => {
    setHour(h);
    setMinute(m);
    if (value) {
      const d = new Date(value);
      d.setHours(h, m, 0, 0);
      onChange(d);
    }
  };

  const pickDay = (day: Date) => {
    const d = new Date(day);
    d.setHours(hour, minute, 0, 0);
    onChange(d);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full h-12 rounded-full border border-slate-200 bg-white pl-6 pr-12 text-left text-[15px] text-slate-900 outline-none focus:ring-2 focus:ring-[color:var(--kfia-brand)]/40"
      >
        <span className={value ? "text-slate-900" : "text-slate-500"}>
          {value ? formatHuman(value) : placeholder}
        </span>
      </button>
      <CalendarDays className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black" />

      {open && (
        <div className="absolute z-20 mt-2 w-[320px] rounded-2xl border border-slate-200 bg-white shadow-lg p-3">
          <div className="flex items-center justify-between px-1">
            <button className="p-1.5 rounded-lg hover:bg-slate-100" onClick={() => changeMonth(-1)}>
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="text-sm font-medium">
              {new Date(viewY, viewM, 1).toLocaleString(undefined, { month: "long", year: "numeric" })}
            </div>
            <button className="p-1.5 rounded-lg hover:bg-slate-100" onClick={() => changeMonth(1)}>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-2 grid grid-cols-7 text-center text-[11px] text-slate-500">
            {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
              <div key={d} className="py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((c, i) => {
              const selected = value ? sameDay(c.date, value) : false;
              const isToday = sameDay(c.date, today);
              const disabled = !!(min && startOfDay(c.date).getTime() < startOfDay(min).getTime());
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => !disabled && pickDay(c.date)}
                  className={[
                    "h-9 rounded-lg text-sm transition",
                    c.inMonth ? "text-slate-900" : "text-slate-400",
                    disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-slate-100",
                    selected ? "bg-[color:var(--kfia-brand)] text-white" : "",
                    !selected && isToday ? "ring-1 ring-[color:var(--kfia-brand)]/50" : "",
                  ].join(" ")}
                >
                  {c.d}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <select
              className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm"
              value={hour}
              onChange={(e) => applyTime(Number(e.target.value), minute)}
            >
              {Array.from({ length: 24 }, (_, h) => (
                <option key={h} value={h}>{pad(h)} h</option>
              ))}
            </select>
            <span className="text-slate-400">:</span>
            <select
              className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm"
              value={minute}
              onChange={(e) => applyTime(hour, Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i * 5).map((m) => (
                <option key={m} value={m}>{pad(m)} m</option>
              ))}
            </select>

            <div className="ml-auto flex gap-2">
              <button className="px-2.5 py-1.5 text-sm rounded-lg border border-slate-200 hover:bg-slate-50" onClick={() => onChange(null)}>
                Clear
              </button>
              <button className="px-3 py-1.5 text-sm rounded-lg bg-[color:var(--kfia-brand)] text-white hover:opacity-95" onClick={() => setOpen(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export const Default = (props: ParkingCalculatorProps): JSX.Element => {
   const [entry, setEntry] = useState<Date | null>(null);
  const [exit, setExit] = useState<Date | null>(null);
  const [error, setError] = useState("");
  const [calculatedTotal, setCalculatedTotal] = useState<number | null>(null);

  const rate = 3;

  const computeHours = (start: Date, end: Date) =>
    Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60));

  const onCalculate = () => {
    if (!entry || !exit) {
      setError("Please select both Entry and Exit date & time.");
      setCalculatedTotal(null);
      return;
    }
    if (exit.getTime() <= entry.getTime()) {
      setError("Exit must be after Entry (same day is okay, but later time).");
      setCalculatedTotal(null);
      return;
    }
    setError("");
    setCalculatedTotal(computeHours(entry, exit) * rate);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
        <div className="flex items-start justify-between">
          <h3 className="text-[22px] font-semibold text-slate-900">Parking cost calculator</h3>
          <div className="ml-6 shrink-0 pt-1 text-[color:var(--kfia-brand)] text-[15px] font-medium">
            Total {calculatedTotal !== null ? calculatedTotal : 0} SR
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <DateTimeField value={entry} onChange={setEntry} placeholder="Enter Parking Date & Time" />
          <DateTimeField value={exit} onChange={setExit} placeholder="Exit Date & Time" min={entry ?? undefined} />
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={onCalculate}
            className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[color:var(--kfia-brand)] px-6 py-3 text-white text-[15px] font-semibold shadow-sm hover:opacity-95"
          >
            <Calculator className="h-[18px] w-[18px]" />
            Calculate
          </button>
        </div>

        {!!error && <p className="mt-3 text-[13px] text-red-600">{error}</p>}

        <p className="mt-4 text-[13px] text-slate-500">
          Totals are estimates; final fee is based on your ticket timestamps. VAT (15%) not included.
        </p>
      </div>
  );
};
