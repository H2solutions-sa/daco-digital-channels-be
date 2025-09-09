import { JSX, useState, useEffect, useMemo } from "react";
import { ComponentProps } from "lib/component-props";
import { Plus, Share2 } from "lucide-react";
import { shareAirline } from "./share";
import Image from "next/image";
import { Field, ImageField } from "@sitecore-jss/sitecore-jss-nextjs";
import { useAutoMobile } from "./useAutoMobile";
import MobileAirlineCard from "./MobileAirlineCard";

type AirlinesPanelProps = ComponentProps & {
  fields: {
    items: AirlineDataProps[];
    forceMobile?: boolean;
  };
};

type Link = {
  href: string;
  text: string;
};

type AirlineDataProps = ComponentProps & {
  fields: {
    name: Field<string>;
    logo: ImageField;
    website?: Field<Link>;
    phone?: Field<string>;
    email?: Field<string>;
  };
};

const th =
  "px-3 py-3 text-[10px] sm:text-[11px] font-semibold tracking-wide text-white/90 uppercase text-left";
const td =
  "px-3 py-4 align-middle whitespace-nowrap text-[14px] sm:text-[15px] text-neutral-800";

export const Default = (props: AirlinesPanelProps): JSX.Element => {
  const PAGE_SIZE = 6;
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return props.fields.items;
    return props.fields.items.filter((a) =>
      [a.fields.name.value, a.fields.phone?.value, a.fields.email?.value, a.fields.website?.value.text]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [query]);

  useEffect(() => setVisible(PAGE_SIZE), [query]);

  const visibleRows = filtered.slice(0, visible);
  const canLoadMore = visible < filtered.length;

  const { wrapperRef, forceMobile } = useAutoMobile(1000, [visibleRows.length]);
  if (forceMobile) {
    return (
      <div className="space-y-3">
        {visibleRows.map((a,i) => (
          <MobileAirlineCard key={i} a={a} />
        ))}
      </div>
    );
  }
  return (
    <section id="airlines" className="scroll-mt-[96px]">
      <div className="pt-0 -mt-10 md:-mt-14">
        <div ref={wrapperRef} className="overflow-x-auto">
          <section id="airlines" className="kfia-content py-8 sm:py-12 scroll-mt-[96px]">
          <div className="mt-3 sm:mt-4 rounded-2xl border border-neutral-200 bg-white p-3 sm:p-6 shadow-sm max-w-[1100px] mx-4 sm:mx-auto">
          <div className="rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
            <table className="w-full min-w-[980px] table-auto border-collapse">
              <thead>
                <tr className="bg-[#1E1B4F]">
                  <th className={th}>Airline</th>
                  <th className={th}>Website</th>
                  <th className={th}>Phone</th>
                  <th className={th}>Email</th>
                  <th className={`${th} text-center w-[64px]`}></th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((a, i) => (
                  <tr
                    key={i}
                    className="odd:bg-white even:bg-neutral-100/70 border-b border-neutral-200"
                  >
                    <td className={td}>
                      <div className="flex items-center gap-3">
                        <span className="relative inline-block h-6 w-[168px] md:w-[188px]">
                          {a.fields.logo?.value?.src && (
                            <Image
                              src={a.fields.logo?.value?.src}
                              alt={`${a.fields.name.value} logo`}
                              fill
                              sizes="188px"
                              className="object-contain"
                            />
                          )}
                        </span>
                        <span className="font-semibold text-neutral-900">
                          {a.fields.name.value}
                        </span>
                      </div>
                    </td>

                    <td className={td}>
                      {a.fields.website?.value ? (
                        <a
                          href={a.fields.website?.value?.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium underline-offset-2 hover:underline"
                        >
                          {a.fields.website?.value.text.replace(/^https?:\/\//, "")}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className={td}>
                      {a.fields.phone ? (
                        <a
                          href={`tel:${a.fields.phone?.value}`}
                          className="tabular-nums font-medium"
                        >
                          {a.fields.phone?.value}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className={td}>
                      {a.fields.email ? (
                        <a
                          href={`mailto:${a.fields.email?.value}`}
                          className="font-medium"
                        >
                          {a.fields.email?.value}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className="px-2 py-2 text-center w-[64px]">
                      <button
                        type="button"
                        aria-label={`Share ${a.fields.name?.value}`}
                        onClick={() => shareAirline(a)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
          </section>
        </div>

        {canLoadMore && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() =>
                setVisible((v) => Math.min(v + PAGE_SIZE, filtered.length))
              }
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[color:var(--kfia-brand)] text-white text-sm font-medium hover:opacity-90"
            >
              <Plus className="w-4 h-4" /> Load More
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
