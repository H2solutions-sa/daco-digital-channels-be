import { JSX } from 'react';
import { MapPin } from "lucide-react";
import { ComponentProps } from 'lib/component-props';
import { Field, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';
import Image from 'next/image';

type MapLevelProps = ComponentProps & {
  fields:{
    Intro:Field<string>,
    Header:Field<string>,
    Description:Field<string>,
    MapTitle:Field<string>,
    MapImage:ImageField
  }
}

export const Default = (props: MapLevelProps): JSX.Element => {

  return (
    <div>
          {/* Intro */}
          <p className="mt-4 text-sm sm:text-[15px] md:text-base leading-6 sm:leading-7 text-slate-800">
           {props.fields.Intro?.value}
          </p>

          {/* Section Header */}
          {props.fields.Description?.value &&
          <div className="mt-5 flex items-center gap-2">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#4D9CD3]" />
            <h2 className="text-base sm:text-[17px] md:text-lg font-semibold text-slate-900">
              {props.fields.Header?.value}
            </h2>
          </div>
          }
          {/* Descriptions */}
          <p className="mt-2 text-sm sm:text-[15px] md:text-base text-slate-700 leading-6 sm:leading-7">
            {props.fields.Description?.value}
          </p>

          {/* Maps */}
          <div>
            <h3 className="mb-3 text-sm sm:text-[15px] md:text-base font-semibold text-slate-900">
              {props.fields.MapTitle?.value}
            </h3>
            {props.fields.MapImage.value?.src &&
            <Image
              src={props.fields.MapImage.value?.src}
              alt={props.fields.MapTitle.value}
              width={2400}
              height={1350}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 900px"
              className="w-full h-auto rounded-xl shadow-sm"
            />
            }
          </div>
    </div>
  );
};
