import { JSX } from 'react';
import { Field, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';
import { useI18n } from 'next-localization';
import { ComponentProps } from 'lib/component-props';
import Link from 'next/link';

type Link ={
  href:string,
  text:string
}
type EventsCardsProps = ComponentProps & {
  fields:{
    items:EventsCard[]
  }
}
type EventsCard = ComponentProps & {
  fields:{
    Title:Field<string>,
    Description:Field<string>,
    CardLink:Field<Link>,
    Image:ImageField
  }
}

export const Default = (props: EventsCardsProps): JSX.Element => {
  const {t} = useI18n();
  const EventCards= props.fields.items && props.fields.items.map((e,index) =>
        <article key={index}
      className="
        bg-[#F9F9FB] rounded-[20px] shadow-sm
        w-full max-w-full lg:w-[574px]
        h-auto lg:h-[198px]
        p-4 sm:p-5
      "
    >
      {/* Always image left, text right */}
      <div
        className="
          grid items-center gap-4 md:gap-5
          grid-cols-[96px_1fr]
          sm:grid-cols-[110px_1fr]
          md:grid-cols-[130px_1fr]
          lg:grid-cols-[150px_1fr]
        "
      >
        {/* Thumbnail */}
        <div className="justify-self-start">
          <div
            className="
              w-[96px] h-[96px]
              sm:w-[110px] sm:h-[110px]
              md:w-[130px] md:h-[130px]
              lg:w-[150px] lg:h-[150px]
              rounded-[20px] overflow-hidden bg-neutral-300
            "
          >
            {e.fields.Image.value?.src ? <img src={e.fields.Image.value?.src} alt={e.fields.Title?.value} className="w-full h-full object-cover" /> : null}
          </div>
        </div>

        {/* Text + Button */}
        <div className="flex flex-col">
          {/* Heading in black */}
          <h4 className="text-[16.5px] sm:text-[18px] md:text-[20px] font-semibold text-black leading-tight mb-1">
            {e.fields.Title?.value}
          </h4>

          {/* Body in #808080 */}
          <p className="text-[13px] sm:text-[13.5px] md:text-[14px] text-[#808080] leading-relaxed mb-3 md:mb-4">
            {e.fields.Description?.value}
          </p>

          <a
            href={e.fields.CardLink?.value?.href}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center justify-center
              w-full sm:w-[240px] md:w-[280px] lg:w-[314px]
              h-[42px] rounded-[10px]
              text-[14px] font-medium text-white
              bg-[color:var(--kfia-brand)] hover:opacity-90 transition
            "
          >
            {e.fields.CardLink?.value?.text}
          </a>
        </div>
      </div>
    </article>
  )
  return (
    <div className='kfia-content'>
      <div className="max-w-[1200px] mx-auto mt-14 sm:mt-16">
        {/* <h2 className="text-[20px] sm:text-[22px] md:text-[28px] font-semibold text-[color:var(--kfia-brand)] text-center">
          {t("Events-title")}
        </h2>
        <p className="mt-3 text-center text-neutral-600 max-w-3xl mx-auto text-[14px] sm:text-[15px]">
          {t("events-subtitle")}
        </p> */}
      </div>

      {/* LINKS & RESOURCES */}
      <div className="max-w-[1200px] mx-auto mt-8 sm:mt-10 mb-4">
        <h3 className="text-[20px] sm:text-[22px] md:text-[28px] font-semibold text-[color:var(--kfia-brand)] mt-8 sm:mt-10">
          {t("event-resources")}
        </h3>
      </div>
      <div className="flex flex-col gap-5 w-full lg:w-[574px]">
        {EventCards}
      </div>
    </div>
  );
};
