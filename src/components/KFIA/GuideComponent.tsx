import { JSX } from 'react';
import { ComponentProps } from 'lib/component-props';
import {  Field, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';
import Image from "next/image";

type Link={
  href: string;
  text: string;
}
type GuideComponentProps = ComponentProps & {
 fields:{
  items:GuideCard[]
 }
}
type GuideCard={
  fields:{
    Title:Field<string>,
    Description:Field<string>,
    Image:ImageField,
    CardLink:Field<Link>
  }
}

export const Default = (props: GuideComponentProps): JSX.Element => {
  const CardGuideList =
  props.fields.items && 
  props.fields.items.map((guideTab,index) =>(
      <a key={index}
      href={guideTab.fields.CardLink?.value?.href}
      className="block rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kfia-brand)] focus-visible:ring-offset-2"
    >
      {/* Mobile: horizontal card; Desktop: stays horizontal but roomier */}
      <div className="kfia-card--soft p-4 sm:p-5 md:p-6 flex items-center gap-4 sm:gap-5">
        {/* Image */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 shrink-0 overflow-hidden rounded-2xl">
          {guideTab.fields.Image.value?.src && (
          <Image
            src={guideTab.fields.Image.value?.src}
            alt={guideTab.fields.Title.value}
            fill
            className="object-cover"
            sizes="(min-width: 1280px) 160px, 112px"
          />)}
        </div>

        {/* Text */}
        <div className="min-w-0">
          <h3 className="text-slate-900 text-[18px] sm:text-lg md:text-xl font-semibold">{guideTab.fields.Title?.value}</h3>
          <p className="mt-1 sm:mt-2 text-sm text-slate-600 leading-6">{guideTab.fields.Description?.value}</p>
        </div>
      </div>
    </a>

  ));
  return (
        <section
      id="guide"
      className="kfia-section bg-white w-full"
      aria-label="Travel Guide"
      role="region"
    >
    <div className="w-full mx-auto px-4 md:px-6 max-w-[1200px] lg:max-w-[1320px] xl:max-w-[1440px]">
        {/* Mobile: horizontal snap scroller */}
        <div className="md:hidden -mx-4 px-4">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
            <div className="min-w-[82%] snap-center">
              {CardGuideList}
            </div>
          </div>
        </div>
        {/* Desktop: 2-column grid */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {CardGuideList}
        </div>
    </div>
    </section>
  );
};
