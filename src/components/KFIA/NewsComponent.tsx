import { JSX } from 'react';
import { ComponentProps } from 'lib/component-props';
import {  Field, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
type Link = {
  href: string;
  text: string;
}

type NewsComponentProps = ComponentProps & {
  fields:{
  items:NewsCards[]
  }
}

type  NewsCards ={
  fields:{
    Image:ImageField
    Title:Field<string>,
    Description:Field<string>,
    CardLink:Field<Link>
  }
}


export const Default = (props: NewsComponentProps): JSX.Element => {
  const NewsCards = props.fields.items 
  && props.fields.items.map((card,index) =>(
        <a key={index}
      href={card.fields.CardLink?.value?.href}
      className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kfia-brand)] focus-visible:ring-offset-2 rounded-2xl h-full"
    >
      <div className="kfia-card--soft overflow-hidden rounded-2xl transition-shadow hover:shadow-md h-full flex flex-col">
        {/* Image */}
        <div className="relative w-full h-44 sm:h-52 md:h-64 overflow-hidden shrink-0">
          {card.fields.Image.value?.src && (
          <Image
            src={card.fields.Image.value?.src}
            alt={card.fields.Title?.value}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 768px) 33vw, 100vw"
          />)}
        </div>

        {/* Text */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="font-sans font-semibold text-lg text-slate-900">{card.fields.Title?.value}</h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-3 md:line-clamp-none">
            {card.fields.Description?.value}
          </p>
        </div>
      </div>
    </a>
  ));

  

  return (
  <section className="w-full kfia-bg-muted">
      <div className="kfia-section w-full mx-auto px-4 sm:px-5 md:px-6 max-w-[1200px] lg:max-w-[1320px] xl:max-w-[1440px]">
        {/* Mobile */}
        <div className="xl:hidden -mx-4 px-4">
          <div
            className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-pl-4 no-scrollbar touch-pan-x"
            style={{ WebkitOverflowScrolling: "touch" }}
            aria-label="Latest news"
          >
            <div className="snap-center shrink-0 w-[88%] sm:w-[72%] md:w-[60%] lg:w-[48%]">
             {NewsCards}
            </div>

          </div>
        </div>

        {/* Desktop */}
        <div className="hidden xl:block relative">
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow rounded-full p-2 transition"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </button>
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow rounded-full p-2 transition"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6 text-slate-700" />
          </button>

          <div className="grid grid-cols-3 gap-6 items-stretch auto-rows-fr">
          {NewsCards}
          </div>
        </div>
      </div>
    </section>
  );
};
