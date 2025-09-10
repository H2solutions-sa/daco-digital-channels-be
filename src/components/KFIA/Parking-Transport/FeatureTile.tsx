import { Field, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import { JSX } from 'react';
import Image from "next/image";
type FeatureTileProps = ComponentProps & {
  fields:{
   items:Tile[];
}
}

type Tile = ComponentProps & {
  fields:{
    Image:ImageField,
    Description:Field<string>
  }
}


export const Default = (props: FeatureTileProps): JSX.Element => {

  return (
    <div>
        {/* Mobile vertical tiles */}
        <div className="px-5 md:px-7 py-5 md:hidden space-y-3.5">
              { props.fields?.items && props.fields.items.map((tile,i) => (
      <div key={i}
      className={[
        // mobile: tighter padding + equal-looking height without feeling huge
        "rounded-xl border border-slate-200 bg-slate-50 p-4 md:p-6",
        "flex flex-col justify-between",
        // make tiles visually consistent in height on mobile without forcing a big min-height
        "min-h-[116px] md:min-h-0",
        "h-6 w-6 text-[color:var(--kfia-secondary)]",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        {/* icon circle slightly smaller on mobile */}
        <div className="inline-flex h-10 w-10 md:h-11 md:w-11 shrink-0 items-center justify-center rounded-full bg-white border border-slate-200">
          {tile.fields.Image.value?.src &&
          <Image
                      src={tile.fields.Image.value?.src}
                      alt=""
                      width={24}
                      height={24}
          />}
        </div>
        <p className="text-[13px] sm:text-[14px] md:text-[15px] leading-relaxed text-slate-800">
          {tile.fields.Description?.value}
        </p>
      </div>
    </div>))}
        </div>
    <div className="hidden md:grid px-5 md:px-3 py-6 md:py-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    { props.fields?.items && props.fields.items.map((tile,i) => (
      <div key={i}
      className={[
        // mobile: tighter padding + equal-looking height without feeling huge
        "rounded-xl border border-slate-200 bg-slate-50 p-4 md:p-6",
        "flex flex-col justify-between",

      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        {/* icon circle slightly smaller on mobile */}
        <div className="inline-flex h-10 w-10 md:h-11 md:w-11 shrink-0 items-center justify-center rounded-full bg-white border border-slate-200">
          {tile.fields.Image.value?.src &&
          <Image
                      src={tile.fields.Image.value?.src}
                      alt=""
                      width={24}
                      height={24}
          />}
        </div>
        <p className="text-[13px] sm:text-[14px] md:text-[15px] leading-relaxed text-slate-800">
          {tile.fields.Description?.value}
        </p>
      </div>
    </div>))}
    </div>
    </div>
    )
};
