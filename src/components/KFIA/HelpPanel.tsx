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

            {/* Brand overlay */}
            <div className="absolute inset-0 bg-[color:var(--kfia-brand)]/35 mix-blend-multiply" />
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
        </div>
      </div>
        {/* Button */}
        <div className="mt-6 flex justify-center">
          <Link
            href= {props.fields.ButtonLink?.value?.href}
            className="
               inline-block px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 rounded-[12px]
                sm:rounded-[14px] bg-[color:var(--kfia-brand)] text-white font-medium
                 text-[14px] sm:text-[15px] md:text-[16px] shadow-md 
                 hover:bg-[color:var(--kfia-brand)]/90 transition-colors 
            "
          >
           {props.fields.ButtonLink?.value?.text}
          </Link>
        </div>
    </section>
  );
};
