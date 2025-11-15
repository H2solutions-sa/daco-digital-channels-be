import { JSX } from 'react';
import { ComponentProps } from 'lib/component-props';
import {  Field, ImageField, Placeholder } from '@sitecore-jss/sitecore-jss-nextjs';
import { ArrowUpRight } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';
type Link = {
  href: string;
  text: string;
}

type QuickAccessProps  = ComponentProps & {
 fields :{
  items:QuickAccessItem[]
 }
}
type  QuickAccessItem ={
  fields:{
    Header:Field<string>,
    Description:Field<string>,
    Icon:ImageField,
    CardLink:Field<Link>
  }
}

export const Default = (props: QuickAccessProps): JSX.Element => {

const QuickAccessItems = 
props.fields.items && 
props.fields.items.map((quickTab,index) =>(
<Link
      href={quickTab.fields.CardLink?.value?.href}
      key={index} className="group block h-full rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] transition-shadow motion-safe:hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kfia-brand)]"
    >
      <div className="flex items-start justify-between gap-4 sm:gap-5 p-4 sm:p-5 md:p-6 min-h-[110px]">
        {/* Title row with arrow on right */}
         <div className="flex items-start gap-3 sm:gap-4 min-w-0">
          <div className="mt-0.5 shrink-0">
            {quickTab.fields.Icon?.value?.src && 
            <Image
              src={quickTab.fields.Icon?.value?.src}
              alt=""
              width={24}
              height={24}
              className="h-6 w-6 object-contain"
              priority={false}
            />
            }
          </div>

          <div className="min-w-0">
          <h3  className="text-[15px] sm:text-[16px] font-semibold leading-tight break-words"
              style={{ color: "var(--kfia-brand)" }}>
            {quickTab.fields.Header?.value}
          </h3>
           <p
              className="mt-2 leading-[1.55] text-[#4E5661] break-words text-[14px] sm:text-[15px] md:text-[length:var(--paragraph1-size)]"
            >
              {quickTab.fields.Description?.value}
            </p>
        </div>
        </div>
            <span
          className={[
            "mt-0.5 inline-flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full text-white",
            "motion-safe:group-hover:translate-x-0.5 transition-transform",
          ].join(" ")}
          style={{ background: "var(--kfia-brand)" }}
          aria-hidden
        >
          <ArrowUpRight className="h-5 w-5 rtl:scale-x-[-1]" />
           </span>
      </div>
    </Link>
));
  return (
    <section id="parking-transport" className="kfia-section" aria-label="Quick Access">
    <Placeholder name="jss-quick-access-top-heading-section" rendering={props.rendering} />
    <div className="w-full mx-auto px-4 md:px-6 max-w-[1200px] lg:max-w-[1320px] xl:max-w-[1440px]">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-stretch">
        {QuickAccessItems}
        </div>
    </div>
    </section>
  );
};
