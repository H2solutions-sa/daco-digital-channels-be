import { ComponentProps } from 'lib/component-props';
import { JSX } from 'react';
import Image from "next/image";
import { Field, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';

type SecurityCardsProps = ComponentProps & {
  fields:{
    items: SecurityCardItem[]
  }
}

type SecurityCardItem = ComponentProps & {
    fields:{
    Image:ImageField,
    Title:Field<string>,
    Description:Field<string>
  }
}

export const Default = (props: SecurityCardsProps): JSX.Element => {
  const SecurityCardsList = props.fields.items &&
        props.fields.items.map((card,index) => (
              <article key={index}
      className="
        h-full flex flex-col rounded-2xl border border-slate-200 bg-white
        shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden
      "
    >
      {/* Media */}
      <div className="relative w-full aspect-[4/3] bg-slate-100">
      { card.fields.Image.value?.src && 
        <Image
          src={card.fields.Image.value?.src}
          alt={card.fields.Title?.value}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        }
      </div>

      {/* Body */}
      <div className="px-4 py-3 flex-1 flex flex-col">
        {/* Clamp so heights match even with longer titles */}
        <h3 className="text-[13px] font-semibold leading-tight text-[color:var(--kfia-brand)] line-clamp-2">
          {card.fields.Title?.value}
        </h3>
        {/* Fill remaining space; clamp to avoid overflow bouncing heights */}
        <p className="mt-1 text-[12px] leading-5 text-slate-700 line-clamp-3 flex-1">
          {card.fields.Description?.value}
        </p>
      </div>
              </article>
        ));

  const MobileSecuritycards = props.fields.items &&
        props.fields.items.map((cm,i)=>(
          <div className="snap-start shrink-0 w-[82%]">
               <article key={i}
      className="
        h-full flex flex-col rounded-2xl border border-slate-200 bg-white
        shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden
      "
    >
      {/* Media */}
      <div className="relative w-full aspect-[4/3] bg-slate-100">
      { cm.fields.Image.value?.src && 
        <Image
          src={cm.fields.Image.value?.src}
          alt={cm.fields.Title?.value}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        }
      </div>

      {/* Body */}
      <div className="px-4 py-3 flex-1 flex flex-col">
        {/* Clamp so heights match even with longer titles */}
        <h3 className="text-[13px] font-semibold leading-tight text-[color:var(--kfia-brand)] line-clamp-2">
          {cm.fields.Title?.value}
        </h3>
        {/* Fill remaining space; clamp to avoid overflow bouncing heights */}
        <p className="mt-1 text-[12px] leading-5 text-slate-700 line-clamp-3 flex-1">
          {cm.fields.Description?.value}
        </p>
      </div>
              </article>
          </div>
        ));

  return (
    <main className="kfia-content kfia-section pt-6 md:pt-8 space-y-6 md:space-y-8">
    <section className="sm:hidden">
        {/* Mobile slider */}
        <div
          className="
            flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth
            pl-4 pr-4 -mx-4 pb-1
            touch-pan-x
            [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
          "
          style={{ scrollPaddingLeft: "1rem", scrollPaddingRight: "1rem" }}
        >
           {MobileSecuritycards}
      </div>
    </section>
    <section className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {SecurityCardsList}
    </section>
    </main>
  );
};
