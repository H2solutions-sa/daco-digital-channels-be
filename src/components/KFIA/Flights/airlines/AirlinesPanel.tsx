import { JSX, useState, useEffect, useMemo } from "react";
import { ComponentProps } from "lib/component-props";
import { Plus, Share2 } from "lucide-react";
//import { shareAirline } from "./share";
import Image from "next/image";
import { Field, ImageField } from "@sitecore-jss/sitecore-jss-nextjs";
import { useI18n } from "next-localization";
import { useAutoMobile } from "./useAutoMobile";
import MobileAirlineCard from "./MobileAirlineCard";
import SearchBar from "../../Common/SearchBar";
import { Plane, Globe, Phone as PhoneIcon, Mail } from "lucide-react";
type AirlinesPanelProps = ComponentProps & {
  fields: {
    items: AirlineDataProps[];
    forceMobile?: boolean;
  };
    onQueryChange: (v: string) => void;
    onSearch?: () => void;
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
  "px-3 md:py-4 lg:text-[13px] sm:text-[11px] font-semibold tracking-wider text-white/90 uppercase  text-left whitespace-nowrap";
const td =
  "px-3 py-4 md:py-5 align-middle whitespace-nowrap text-[16px] text-neutral-800";

export const Default = (props: AirlinesPanelProps): JSX.Element => {
 const { t } = useI18n();
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
      <section id="airlines" className="kfia-content py-6 sm:py-10 scroll-mt-[96px]">
      <div className="mt-3 sm:mt-4 rounded-2xl bg-white p-2.5 sm:p-4 md:p-6 shadow-sm max-w-[1100px] mx-3 sm:mx-4 md:mx-auto">
        <div className="w-full">
          <div className="space-y-3">
        {visibleRows.map((a,i) => (
          <MobileAirlineCard key={i} a={a} />
        ))}
      </div>
      </div>
      </div>
      </section>
    );
  }
  return (
    <section id="airlines" className="kfia-content py-8 sm:py-12 scroll-mt-[96px]">
      <div className="pt-0 -mt-10 md:-mt-14">
        <div ref={wrapperRef} className="overflow-x-auto">
                {/* Search panel */}
                <div className="mt-6 sm:mt-8 rounded-2xl bg-[#1E1B4F] text-white p-3 sm:p-6 mx-4 sm:mx-auto max-w-[1100px]">
                  <div className="flex flex-col gap-4 items-stretch">
                    { (
                      
                      <div className="flex justify-center">
                        <div className="rounded-xl bg-white/10 p-1">
                        <span className=" px-6 sm:px-8 py-2.5 sm:py-3 rounded-[18px] font-semibold text-center min-w-[120px] sm:min-w-[140px] bg-white shadow-sm text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px] bg-white text-[color:var(--kfia-brand,#5F488B)] uppercase"> {t('Airline')}</span>
                        </div>
                      </div>
                    )}
                    <div className="px-1 sm:px-0">
                      <SearchBar
                        value={query}
                        onChange = {(v) =>{
                          setQuery(v);
                          props.onQueryChange}}
                        onSearch={props.onSearch}
                        placeholder={t("search-placeholder")}
                        buttonLabel={t("Search-Btn")}
                      />
                    </div>
                  </div>
                </div>
          <section id="airlines" className="kfia-content py-8 sm:py-12 scroll-mt-[96px]">
          <div className="mt-3 sm:mt-4 rounded-2xl border border-neutral-200 bg-white p-3 sm:p-6 shadow-sm max-w-[1100px] mx-4 sm:mx-auto">
          <div className="rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
            <table className="w-full min-w-[980px] table-auto border-collapse">
              <thead>
                <tr className="bg-[#1E1B4F]">
                  <th className={`${th} text-center !px-0`}>
                    <span className="inline-flex w-full items-center justify-center gap-2">
                    <Plane className="h-5 w-5 opacity-90" />
                    {t('airline-column')}
                    </span>
                    </th>
                  <th className={th}>
                    <span className="inline-flex items-center gap-2">
                     <Globe className="h-5 w-5 opacity-90" />
                     {t('website-column')}
                    </span>
                  </th>
                  <th className={th}>
                   <span className="inline-flex items-center gap-2">
                     <PhoneIcon className="h-5 w-5 opacity-90" />
                     {t('phone-column')}
                   </span>
                  </th>
                  <th className={th}>
                    <span className="inline-flex items-center gap-2">
                      <Mail className="h-5 w-5 opacity-90" />
                      {t('email-column')}
                    </span>
                    </th>
                  {/* <th className={`${th} text-center w-[64px]`}></th> */}
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((a, i) => (
                  <tr
                    key={i}
                    className="odd:bg-white even:bg-neutral-100/70 border-b border-neutral-200"
                  >
                    <td className={`${td} text-center`}>
                      <div className="flex flex-col items-center gap-2">
                        <span className="relative block mx-auto h-6 w-[90px] sm:h-6 sm:w-[90px] md:h-7 md:w-[100px] w-[188px] md:w-[220px]">
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
                         <span className="font-semibold text-[18px] text-neutral-900">
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
                          className="font-medium underline-offset-2 hover:underline inline-flex items-center gap-2 font-medium underline-offset-2 hover:underline"
                        >
                          <Globe className="h-5 w-5 opacity-90" />
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
                          className="inline-flex items-center gap-2 font-medium underline-offset-2 hover:underline"
                        >
                          <PhoneIcon className="h-5 w-5 opacity-90" />
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
                          className="inline-flex items-center gap-2 font-medium underline-offset-2 hover:underline"
                        >
                          <Mail className="h-5 w-5 opacity-90" />
                          {a.fields.email?.value}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>

                    {/* <td className="px-2 py-2 text-center w-[64px]">
                      <button
                        type="button"
                        aria-label={`Share ${a.fields.name?.value}`}
                        onClick={() => shareAirline(a)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                    </td> */}
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
              <Plus className="w-4 h-4" /> {t("load-more-btn")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
