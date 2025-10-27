import { JSX } from 'react';
import { ComponentProps } from 'lib/component-props';
import Image from 'next/image';
import { Field, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';

type AsideContentBannerProps = ComponentProps & {
fields:{
  Header:Field<string>,
  SubHeader:Field<string>,
  Image:ImageField,
  HeaderIcon:ImageField
}
}

export const Default = (props: AsideContentBannerProps): JSX.Element => {


  return (
    <div>
          <h1 className="flex items-center gap-2 font-semibold text-[color:var(--kfia-brand)]"
            style={{ fontSize: "var(--title-lg-size)" }}>
             { props.fields.HeaderIcon.value?.src && 
              <Image
                  src={props.fields.HeaderIcon?.value?.src}
                  alt={props.fields.Header?.value}
                  width={24}
                  height={24}
                  className="object-cover"
                  priority
              />
              }
              {props.fields.Header?.value}
          </h1>
          <p className="mt-1 text-sm sm:text-base text-[color:var(--kfia-subtitle)]">
            {props.fields.SubHeader?.value}
          </p>
          <div className="mt-3 sm:mt-5">
            <div className="relative w-full h-[180px] sm:h-[260px] md:h-[300px] rounded-xl overflow-hidden bg-slate-100">
              {props.fields.Image.value?.src &&
              <Image
                src={props.fields.Image.value?.src}
                alt={props.fields.Header?.value}
                fill
                className="object-cover"
                priority
              />
              }
            </div>
          </div>
       </div>
  );
};
