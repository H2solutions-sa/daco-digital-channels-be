import { JSX } from 'react';
import Image from "next/image";
import { SquareArrowOutUpRight, MapPin } from "lucide-react";
import { ComponentProps } from 'lib/component-props';
import { Field, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';
import Link from 'next/link';
type Link = {
  href:string,
  text:string
}
type ServieCardProps = ComponentProps & {
 fields:{
  	
  CardLink :Field<Link>,
  CardTitle:Field<string>,
  CardSubTitle:Field<string>,
  CardImg:ImageField,
  Chips:{fields:{ ChipName: Field<string>, ChipIcon:ImageField } }[],
  mediaOnTop:ImageField
 }
}
type ServieCardListProps = ComponentProps & {
  fields:{
    items: ServieCardProps[]
  }
}


export const Default = (props: ServieCardListProps): JSX.Element => {
const CARD_BASE =
  "relative flex h-full flex-col rounded-2xl border border-[oklch(0.75_0_0)]/22 bg-white shadow-sm p-4 " +
  "focus-within:ring-2 focus-within:ring-[color:var(--kfia-brand)]/20";
  const CardList =
    props.fields.items?.map((card ,i ) => (
   <article key={i} className={CARD_BASE} aria-label={card.fields.CardTitle?.value}>
      {/* External link */}
      {card.fields.CardLink?.value?.href ? (
        <Link
          href={card.fields.CardLink?.value?.href}
          target="_blank"
          rel="noreferrer"
          aria-label={`${card.fields.CardTitle?.value} details`}
          className="absolute right-3 top-3 rounded-md p-1.5 text-[color:var(--kfia-brand)]/85 hover:bg-[oklch(0.98_0_0)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kfia-brand)]/40"
        >
          <SquareArrowOutUpRight className="h-4 w-4" />
        </Link>
      ) : null}
      {/* Top media */}
      {card.fields.mediaOnTop?.value?.src? (
        <div className="-mx-4 -mt-4 mb-3 overflow-hidden rounded-t-2xl bg-slate-100">
            <Image
              src={card.fields.mediaOnTop.value?.src}
              alt={`photo`}
              width={800}
              height={450}
              className="h-44 w-full object-cover"
            />
        </div>
      ) : null}
      {/* CONTENT */}
      <div className="flex-1">
        {/* Logo */}
        <div className="flex justify-center">
          {card.fields.CardImg?.value?.src && 
          <Image
            src={card.fields.CardImg?.value?.src}
            alt={`${card.fields.CardTitle?.value} logo`}
            width={280}
            height={112}
            className="h-auto w-auto object-contain"
            style={{ maxHeight: 112, minHeight: 64, maxWidth: 280 }}
            sizes="(max-width: 768px) 200px, 260px"
          />
          }
        </div>

        {/* Title */}
        <h3 className="mt-3 text-center font-semibold tracking-tight text-neutral-900">
          {card.fields.CardTitle?.value}
        </h3>

        {/* Subtitle */}
        {card.fields.CardSubTitle?.value ? (
          <div className="mt-1 flex items-center justify-center gap-1 text-sm text-[color:var(--kfia-brand)]">
            <MapPin className="h-[18px] w-[18px] shrink-0" />
            <span>{card.fields.CardSubTitle?.value}</span>
          </div>
        ) : null}
              {/* Divider */}

        {/* Chips */}
        {card.fields.Chips?.length > 0 ? (
         <><div className="my-4 h-px w-full bg-[oklch(0.92_0_0)]"></div>
         <div
              className={`flex flex-wrap gap-2 justify-start`}
            >
              {card.fields.Chips.map((c, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 rounded-full px-3 text-xs leading-none bg-[oklch(0.96_0_0)] text-[color:var(--kfia-brand)] border border-[oklch(0.90_0_0)]/45 h-8"
                >
                    {c.fields.ChipIcon?.value?.src && 
                    <Image
                      src={c.fields.ChipIcon?.value?.src}
                      alt={`${card.fields.CardTitle?.value} logo`}
                      width={16}
                      height={16}
                    />
                    }
                  {c.fields.ChipName?.value}
                </span>
              )
              )}
            </div></>
        ) : null}
      </div>
    </article>
    )) ?? [];
  return (
  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-level>
    {CardList}
  </div>
  );
};
