import { JSX, useEffect, useState } from 'react';
import { ComponentProps } from 'lib/component-props';
import { Field } from '@sitecore-jss/sitecore-jss-nextjs';

type SelectorComponentProps = ComponentProps & {
 fields:{
  Title:Field<string>,
  Selector:{fields:{ TabName: Field<string> } }[],
 }
}

export const Default = (props: SelectorComponentProps): JSX.Element => {
  const [activeGroup, setActiveGroup] = useState(0);

    useEffect(() => {
    //const groups = document.querySelectorAll<HTMLElement>("[data-level]");
    const groups = Array.from(document.querySelectorAll<HTMLElement>('[data-level]'))
  .filter(el => !el.parentElement?.closest('[data-level]'));
    groups.forEach((el, idx) => {
      if (idx === activeGroup) {
        el.style.display = "";
      } else {
        el.style.display = "none";
      }
    });
  }, [activeGroup]);
  return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg sm:text-xl font-semibold text-[color:var(--kfia-brand)]">
            {props.fields.Title?.value}
          </h2>

          {/* Level selector – same styling as Banking */}
          <label className="flex w-full sm:w-auto items-center justify-between sm:justify-start gap-3 text-sm">
            <span className="text-[color:var(--kfia-brand)] shrink-0 font-medium">
              Select Level
            </span>
            <div className="relative w-[min(260px,100%)]">
              <select
                value={activeGroup}
                onChange={(e) => setActiveGroup(Number(e.target.value))}
                className="w-full appearance-none rounded-xl border border-[oklch(0.75_0_0)]/45 bg-white
                           px-3 py-2 pr-9 text-sm focus:outline-none focus:ring-2
                           focus:ring-[color:var(--kfia-brand)]/25"
                aria-label="Select level"
              >
                {props.fields.Selector.map((lv,i) => (
                  <option key={i} value={i}>
                    {lv.fields.TabName?.value}
                  </option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-700"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M5.5 7.5l4.5 5 4.5-5H5.5z" />
              </svg>
            </div>
          </label>
        </div>
  );
};
