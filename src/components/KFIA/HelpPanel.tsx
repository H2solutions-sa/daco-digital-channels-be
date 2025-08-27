import {  JSX } from 'react';
import { ComponentProps } from 'lib/component-props';
import {  Field } from '@sitecore-jss/sitecore-jss-nextjs';

type Link = {
  href: string;
  text: string;
}
type HelpPanelProps = ComponentProps & {
 fields :{
  Title: Field<string>,
  Subtitle:Field<string>,
  ButtonLink:Field<Link>
 }
}

export const Default = (props: HelpPanelProps): JSX.Element => {
  return (
     <section
      id="help"
      className="kfia-content kfia-section"
      aria-label="Help and Support"
      role="region"
    >
      <div
        className="
          mx-auto bg-[#1F1B4E]
          rounded-[40px] md:rounded-[48px]
          px-6 py-16 md:px-10 md:py-20 lg:py-24
          text-center text-white
        "
      >
        {/* Title */}
        <h3 className="font-sans font-semibold tracking-tight text-3xl md:text-5xl lg:text-6xl">
          {props.fields.Title?.value}
        </h3>

        {/* Subtitle */}
        <p className="mt-4 max-w-2xl mx-auto text-white/85 text-base md:text-lg leading-7">
          {props.fields.Subtitle?.value}
        </p>

        {/* Button */}
        <div className="mt-8">
          <a
            href= {props.fields.ButtonLink?.value?.href}
            className="
              inline-block px-6 py-3
              text-base font-medium rounded-xl
              bg-white text-[#1F1B4E]
              shadow-sm hover:bg-slate-100
              transition-all duration-200
            "
          >
           {props.fields.ButtonLink?.value?.text}
          </a>
        </div>
      </div>
    </section>
  );
};
