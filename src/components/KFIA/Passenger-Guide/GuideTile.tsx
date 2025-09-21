import { JSX } from 'react';
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ComponentProps } from 'lib/component-props';
import { Field, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';

type Link = {
  href:string,
  text:string
}
type GuideTileProps = ComponentProps & {
  fields:{
    CardLink:Field<Link>,
    CardTitle:Field<string>,
    CardImage:ImageField
  }
}
type cardList = ComponentProps & {
  fields:{
    items:GuideTileProps[]
  }
}

export const Default = (props: cardList): JSX.Element => {
  const cardListRendering =props.fields.items &&  props.fields.items.map((card,index) => (
     <Link key={index}
      href={card.fields.CardLink.value?.href}
      className={[
        "block rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm",
        "transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-[color:var(--kfia-brand)]",
      ].join(" ")}
    >
      {/* image */}
      <div className="relative h-44 w-full">
        {card.fields.CardImage.value?.src &&
        <Image src={card.fields.CardImage.value?.src} alt={card.fields.CardTitle.value} fill className="object-cover" />
        }
      </div>

      {/* body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-medium text-slate-900 text-[15px] leading-tight">
            {card.fields.CardTitle.value}
          </h3>
          <span
            aria-hidden
            className="shrink-0 rounded-full w-9 h-9 flex items-center justify-center
                       text-[color:var(--kfia-brand)]
                       bg-[color:var(--kfia-brand)]/10"
          >
            <ArrowUpRight className="w-5 h-5" />
          </span>
        </div>
      </div>
    </Link>
  ))
  return (
    <>
    {cardListRendering}
    </>
  );
};
