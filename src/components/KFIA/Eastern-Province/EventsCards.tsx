import { JSX } from 'react';
import { Field } from '@sitecore-jss/sitecore-jss-nextjs';
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
  }
}

export const Default = (props: EventsCardsProps): JSX.Element => {
  const {t} = useI18n();
  const EventCards= props.fields.items && props.fields.items.map((e,index) =>
    <article key={index} className="bg-[#F4F2FA] rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-sm">
      {/* Title */}
      <h4 className="text-lg sm:text-xl font-semibold text-[color:var(--kfia-brand)] mb-2">
        {e.fields.Title?.value}
      </h4>

      {/* Description */}
      <p className="text-sm sm:text-base text-neutral-700 mb-6 leading-relaxed">
        {e.fields.Description?.value}
      </p>

      {/* Full-width button */}
      <Link
        href={e.fields.CardLink?.value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto w-full inline-flex items-center justify-center rounded-lg py-3 text-sm sm:text-base font-medium text-white bg-[color:var(--kfia-brand)] hover:opacity-90 transition-colors"
      >
        {e.fields.CardLink?.value?.text}
      </Link>
    </article>
  )
  return (
    <div className='kfia-content'>
      <div className="max-w-[1200px] mx-auto mt-14 sm:mt-16">
        <h2 className="text-[20px] sm:text-[22px] md:text-[28px] font-semibold text-[color:var(--kfia-brand)] text-center">
          {t("Events-title")}
        </h2>
        <p className="mt-3 text-center text-neutral-600 max-w-3xl mx-auto text-[14px] sm:text-[15px]">
          {t("events-subtitle")}
        </p>
      </div>

      {/* LINKS & RESOURCES */}
      <div className="max-w-[1200px] mx-auto mt-8 sm:mt-10">
        <h3 className="text-[20px] sm:text-[22px] md:text-[28px] font-semibold text-[color:var(--kfia-brand)]">
          {t("event-resources")}
        </h3>
      </div>
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-4">
        {EventCards}
      </div>
    </div>
  );
};
