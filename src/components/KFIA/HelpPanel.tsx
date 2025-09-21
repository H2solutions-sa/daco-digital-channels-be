import {  JSX } from 'react';
import { ComponentProps } from 'lib/component-props';
import {  Field, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';
import Image from "next/image";
import Link from 'next/link';

type Link = {
  href: string;
  text: string;
}
type HelpPanelProps = ComponentProps & {
 fields :{
  Title: Field<string>,
  Subtitle:Field<string>,
  ButtonLink:Field<Link>,
  Background:ImageField
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
        <div className="relative w-full overflow-hidden rounded-[32px] md:rounded-[40px]">
        {/* Background image */}
        <div className="absolute inset-0">
          {(props.fields.Background.value?.src  &&
          <Image
            src={props.fields.Background?.value?.src} // <-- Replace with your actual background image path
            alt={props.fields.Title.value}
            fill
            className="object-cover"
            priority
          />)}
          {/* Dark overlay for contrast */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 text-center text-white px-6 py-16 md:py-20 lg:py-28">

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
          <Link
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
          </Link>
        </div>
        </div>
      </div>
    </section>
  );
};
