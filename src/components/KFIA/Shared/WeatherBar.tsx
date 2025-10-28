import { JSX} from 'react';
import { ComponentProps } from 'lib/component-props';
import {  Field } from '@sitecore-jss/sitecore-jss-nextjs';
import { AlertCircle } from "lucide-react";
import Link from 'next/link';

type Link = {
    href:string,
    text:string
}
type WeatherBarProps = ComponentProps & {
fields:{
  Text:Field<string>,
  Button:Field<Link>
  isAvailable:Field<boolean>
}
}

export const Default = (props: WeatherBarProps): JSX.Element => {
  return (
    <>
  { props.fields.isAvailable.value === true && 
    <div
      role="region"
      aria-label="Weather disruption alert"
      className="
        relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen
        bg-[color:var(--kfia-secondary)] text-white
        z-10
      "
    >
      {/* Centered container */}
      <div className="mx-auto max-w-[1400px] px-4 py-3 sm:py-4 md:py-5">
        {/* Left on mobile, center on md+ */}
        <div className="flex justify-start md:justify-center">
          <div className="inline-flex items-start gap-3 text-left md:items-center md:text-center">
            <span
              aria-hidden="true"
              className="inline-flex items-center justify-center mt-0.5 md:mt-0"
            >
              <AlertCircle className="h-6 w-6 text-white md:h-7 md:w-7" />
            </span>

            <p className="text-sm sm:text-base md:text-lg leading-snug text-white">
              {props.fields.Text?.value}
              <Link
                href={props.fields.Button.value.href}
                className="underline underline-offset-2 font-semibold hover:text-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm"
              >
                {props.fields.Button.value.text}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    }
    </>
  );
};
