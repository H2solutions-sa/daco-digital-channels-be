import { JSX } from 'react';
import { ComponentProps } from 'lib/component-props';
import {  Field, Placeholder } from '@sitecore-jss/sitecore-jss-nextjs';
import { ArrowUpRight } from "lucide-react";
import Link from 'next/link';
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
    CardLink:Field<Link>
  }
}

export const Default = (props: QuickAccessProps): JSX.Element => {

const QuickAccessItems = 
props.fields.items && 
props.fields.items.map((quickTab,index) =>(
<Link
      href={quickTab.fields.CardLink?.value?.href}
      key={index} className="block h-full transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kfia-brand)] rounded-2xl"
    >
      <div className="kfia-card--soft p-5 md:p-6 lg:p-7 flex flex-col h-full">
        {/* Title row with arrow on right */}
        <div className="flex items-start justify-between">
          <h3  className="text-[15px] sm:text-[16px] font-semibold leading-tight break-words"
              style={{ color: "var(--kfia-brand)" }}>
            {quickTab.fields.Header?.value}
          </h3>
           <span
          className={[
            "mt-0.5 inline-flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full text-white",
            "motion-safe:group-hover:translate-x-0.5 transition-transform",
          ].join(" ")}
          style={{ background: "var(--kfia-brand)" }}
          aria-hidden
        >
          <ArrowUpRight className="h-5 w-5" />
        </span>
        </div>

        {/* Description under title */}
        <p className="text-sm text-slate-600 mt-3 leading-6">{quickTab.fields.Description?.value}</p>
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
