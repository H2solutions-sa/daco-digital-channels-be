import { JSX } from 'react';
import Image from 'next/image';
import { ComponentProps } from 'lib/component-props';
import { Field, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';
type SecurityPanelProps = ComponentProps & {
  fields:{
    items:Panelprops[],
  }
}
type Panelprops = ComponentProps & {
  fields:{
    Icon:ImageField,
    Header:Field<string>,
    IntroHeader:Field<string>,
    Intro:Field<string>,
    SubHeader:Field<string>,
    Description:Field<string>,
    StylingClass:Field<string>
  }
}

export const Default = (props: SecurityPanelProps): JSX.Element => {
const SecurityPanel = props.fields.items &&
props.fields.items.map((securityCard, i) => (
    <section
      className={`rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-4 sm:p-5 ${i == props.fields.items.length-1 ? "md:col-span-2":""}`}
    >
      <div key={i} className="flex items-center gap-2">
        {/* Icon in subtle badge to match Figma */}
        <span className="grid place-items-center h-6 w-6 rounded-lg border border-blue-200 bg-blue-50">
          {securityCard.fields.Icon?.value?.src &&
          <Image
            src={securityCard.fields.Icon?.value?.src}
            alt={`${securityCard.fields.Header?.value}`}
            width={24}
            height={24}
            />
          }
        </span>
        <h3 className="text-[14px] font-semibold text-slate-900 leading-tight">{securityCard.fields.Header?.value}</h3>
      </div>
   <div className="mt-3 text-[13px] leading-6 text-slate-700">
      { securityCard.fields.StylingClass.value ?
      (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6">
        <div className="pb-3 md:pb-0 md:pr-6 md:border-r md:border-slate-200">
          {securityCard.fields?.IntroHeader.value && 
            <p className="font-medium text-slate-900">{securityCard.fields?.IntroHeader.value}</p>
          }
          <p className="mt-1">
            {securityCard.fields.Intro?.value}
          </p>
        </div>

          <div className="pt-3 md:pt-0 md:pl-6">
          <p className="font-medium text-slate-900">{securityCard.fields.SubHeader?.value}</p>
          <p className="mt-1">
           {securityCard.fields.Description?.value}
          </p>
          </div>
      </div>
      ) : (
      <>
      {securityCard.fields?.IntroHeader.value && 
        <p className="font-medium text-slate-900">{securityCard.fields?.IntroHeader.value}</p>
      }
         <p>
            {securityCard.fields.Intro?.value}
          </p>
          <div className="my-3 h-px bg-slate-200" />
          <p className="font-medium text-slate-900">{securityCard.fields.SubHeader?.value}</p>
          <p className="mt-1">
           {securityCard.fields.Description?.value}
        </p>
        </>
      )
      }
      </div>

    </section>
));
  return (
    <div className="kfia-content kfia-section pt-6 md:pt-8 space-y-6 md:space-y-8">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
      {SecurityPanel}
      </section>
      </div>
  );
};
