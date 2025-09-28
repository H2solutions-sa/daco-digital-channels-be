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
  CardImg:ImageField
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
  const CardList =    props.fields.items &&
    props.fields.items.map((card ,i ) => (
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

      </div>
    </article>
    ));
  return (
  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {CardList}
  </div>
  );
};
