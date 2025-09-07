import { JSX } from 'react';
import Image from "next/image";
import { ComponentProps } from 'lib/component-props';
import { ImageField } from '@sitecore-jss/sitecore-jss-nextjs';

type ImageBannerProps = ComponentProps & {
  fields:{
    BannerImg: ImageField;
  }
}

export const Default = (props: ImageBannerProps): JSX.Element => {
  return (
    <>
        {/* Banner */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        <div className="relative w-full pt-[56%] sm:pt-[46%] md:pt-[38%] lg:pt-[32%]">
          {props.fields.BannerImg.value?.src && (
          <Image
            src={props.fields.BannerImg?.value?.src}
            alt="Taxi service pricing banner"
            fill
            priority
            className="object-cover"
          />)}
        </div>
      </div>
    </>
  );
};
