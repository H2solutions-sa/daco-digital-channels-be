import { JSX } from 'react';
import { Field, ImageField, Placeholder } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import Image from 'next/image'
import Link from 'next/link';
type Link ={
  href:string,
  text:string
}
type CardsSectionProps = ComponentProps & {
  fields:{
    items: ImageCard[]
  }
}
type ImageCard ={
  fields:{
    CardLink:Field<Link>,
    CardTitle:Field<string>,
    CardSubTitle: Field<string>
    CardImg:ImageField,

  }
}

export const Default = (props: CardsSectionProps): JSX.Element => {
//const  className="snap-center shrink-0 w-[85%] sm:w-[65%] md:w-[55%] lg:w-[45%]"
const Card = 
props.fields.items && props.fields.items.map((card,index)=>(
    <Link key={index}
      href={card.fields.CardLink?.value?.href}
      className={`group relative block overflow-hidden rounded-[24px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kfia-brand)] focus-visible:ring-offset-2`}
    >
      {/* Image (taller on desktop, shorter on phones) */}
      <div className="relative w-full h-[18rem] sm:h-[22rem] lg:h-[26rem]">
       {card.fields.CardImg?.value?.src && 
       <Image
          src={card.fields.CardImg?.value?.src}
          alt={card.fields.CardTitle?.value}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(min-width: 1280px) 420px, (min-width: 768px) 33vw, 100vw"
          priority={false}
        />
       }
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" aria-hidden="true" />

      {/* Text */}
      <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end">
        <h3 className="text-white text-lg sm:text-xl font-semibold">{card.fields.CardTitle?.value}</h3>
        <p className="text-white/85 mt-1 leading-6 break-words text-[14px] sm:text-[15px] md:text-[length:var(--paragraph1-size)] ">{card.fields.CardSubTitle?.value}</p>
      </div>
    </Link>
));

const MobileCard = 
props.fields.items && props.fields.items.map((card,index)=>(
    <Link key={index}
      href={card.fields.CardLink?.value?.href}
      className={`group relative block overflow-hidden rounded-[24px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kfia-brand)] focus-visible:ring-offset-2 snap-center shrink-0 w-[85%] sm:w-[65%] md:w-[55%] lg:w-[45%]`}
    >
      {/* Image (taller on desktop, shorter on phones) */}
      <div className="relative w-full h-[18rem] sm:h-[22rem] lg:h-[26rem]">
       {card.fields.CardImg?.value?.src && 
       <Image
          src={card.fields.CardImg?.value?.src}
          alt={card.fields.CardTitle?.value}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105 h-full"
          sizes="(min-width: 1280px) 420px, (min-width: 768px) 33vw, 100vw"
          priority={false}
        />
       }
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" aria-hidden="true" />

      {/* Text */}
      <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end">
        <h3 className="text-white font-semibold text-[16px] sm:text-[18px] md:text-[length:var(--title-md-size)]">{card.fields.CardTitle?.value}</h3>
        <p className="text-white/85 mt-1 leading-6 break-words text-[14px] sm:text-[15px] md:text-[length:var(--paragraph1-size)]">{card.fields.CardSubTitle?.value}</p>
      </div>
    </Link>
));

  return (
    <section id="shop-dine" className="kfia-section" aria-label="Shopping and Dining">
      <Placeholder name="jss-cards-top-heading-section" rendering={props.rendering} />
        <div className="xl:hidden -mx-4 px-4">
          <div
            className="
              flex gap-4 overflow-x-auto pb-2
              snap-x snap-mandatory scroll-pl-4
              no-scrollbar touch-pan-x
            "
            style={{ WebkitOverflowScrolling: "touch" }}
            aria-label="Shop & Dine categories"
          >
          {MobileCard}
          </div>
        </div>
      {/* Page container */}
      <div className="w-full mx-auto px-4 sm:px-5 md:px-6 max-w-[1200px] lg:max-w-[1320px] xl:max-w-[1440px]">
         <div className="hidden xl:grid grid-cols-3 gap-6 items-stretch">
            {Card}
          </div>
          </div>
          </section>
  );
};
