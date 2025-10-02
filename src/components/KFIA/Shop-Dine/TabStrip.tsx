import { JSX, useEffect, useState } from 'react';
import { ComponentProps } from 'lib/component-props';
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { Field, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';

type Linkfield = {
  href : string,
  text:string
}

type TabStripProps = ComponentProps & {
fields:{
   items:SingleTabProps[],
}
}

type SingleTabProps = ComponentProps & {
  fields:{
    Link:Field<Linkfield>,
    Icon:ImageField
  }
}
export const Default = (props: TabStripProps): JSX.Element => {
  const pathname = usePathname();

  // Prevent SSR/CSR mismatch for active state
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isActive = (href: string) => (mounted ? pathname?.startsWith(href) : false);
  return (
      <nav aria-label="Section tabs" className="kfia-content px-0 mb-6 mx-auto my-6 max-w-[1200px] px-4 md:px-6">
        <div className="w-full rounded-2xl bg-[color:var(--kfia-brand,#60498C)]/10 p-2">
          {/* Mobile: horizontal slider with snap; md+: single row, no overflow */}
          <div className="flex items-stretch gap-2 sm:gap-3 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none no-scrollbar md:flex-nowrap">
            {props.fields.items && props.fields.items.map((t,index) => {
              const active = isActive(t.fields.Link?.value?.href);
              return (
                <Link
                  key={index}
                  href={t.fields.Link.value?.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    // layout
                    "flex items-center justify-center gap-2 rounded-xl px-4 sm:px-5 py-2.5",
                    "text-[14px] sm:text-[15px] leading-none font-semibold whitespace-nowrap",
                    // MOBILE: fixed-ish width items so they slide; DESKTOP: flex to fill
                    "min-w-[140px] flex-none snap-center md:min-w-0 md:flex-1",
                    // equal height
                    "min-h-[44px] md:min-h-[48px] text-center",
                    // states
                    active
                      ? "bg-[color:var(--kfia-brand,#60498C)] text-white shadow-sm ring-1 ring-[color:var(--kfia-brand,#60498C)]/35"
                      : "text-[color:var(--kfia-brand,#60498C)] hover:bg-[color:var(--kfia-brand,#60498C)]/15",
                    // focus
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kfia-brand,#60498C)]/30",
                    "transition-colors",
                  ].join(" ")}
                >
                  {t.fields.Icon.value?.src && (
                    <Image
                      src={t.fields.Icon.value?.src}
                      alt={t.fields.Link.value.text}
                      width={18}
                      height={18}
                      className={[
                        "h-[16px] w-[16px] sm:h-[18px] sm:w-[18px]",
                        active ? "white-icon"  : "text-[color:var(--kfia-brand,#60498C)]",
                      ].join(" ")}
                      />
                    )}
                  {t.fields.Link?.value?.text}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
  );
};
