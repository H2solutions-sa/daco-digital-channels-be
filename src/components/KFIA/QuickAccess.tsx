import { JSX } from 'react';
import { ComponentProps } from 'lib/component-props';
import {  Field } from '@sitecore-jss/sitecore-jss-nextjs';
import { ArrowUpRight } from "lucide-react";
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
<a
      href={quickTab.fields.CardLink?.value?.href}
      key={index} className="block h-full transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kfia-brand)] rounded-2xl"
    >
      <div className="kfia-card--soft p-5 md:p-6 lg:p-7 flex flex-col h-full">
        {/* Title row with arrow on right */}
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-slate-900 text-[18px] md:text-[20px] leading-tight">
            {quickTab.fields.Header?.value}
          </h3>
          <span
            className="ml-3 shrink-0 w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-[color:var(--kfia-brand)]"
            style={{
              background:
                "color-mix(in oklab, var(--kfia-brand) 12%, transparent)",
            }}
            aria-hidden
          >
            <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6" />
          </span>
        </div>

        {/* Description under title */}
        <p className="text-sm text-slate-600 mt-3 leading-6">{quickTab.fields.Description?.value}</p>
      </div>
    </a>
));
  return (
        <section
      id="parking-transport"
      className="kfia-section"
      aria-label="Quick Access"
    >
      <div className="w-full mx-auto px-4 md:px-6 max-w-[1200px] lg:max-w-[1320px] xl:max-w-[1440px]">

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-stretch">
    {QuickAccessItems}
    </div>
    </div>
    </section>
  );
};
