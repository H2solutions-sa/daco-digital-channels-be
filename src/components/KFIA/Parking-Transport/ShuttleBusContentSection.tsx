import { JSX } from 'react';
import { ComponentProps } from 'lib/component-props';
import { useI18n } from 'next-localization';
import Image from 'next/image';
import { Field, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';
import { Placeholder, RichText } from '@sitecore-jss/sitecore-jss-react';
type ShuttleBusContentSectionProps= ComponentProps &  {
 fields:{
  Image:ImageField,
  Branch:Field<string>,
  Phone:Field<string>,
  Info:Field<string>,
  Description:Field<string>
 }
}

export const Default = (props: ShuttleBusContentSectionProps): JSX.Element => {
 const {t} = useI18n();
  return (
   <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-5 md:px-7 py-4 border-b border-slate-200">
          <h2 className="text-[16px] md:text-[17px] font-semibold text-[color:var(--kfia-brand)]">
            {t("Bus-Info-Title")}
          </h2>
        </div>

        <div className="px-5 md:px-7 py-6 md:py-7 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Left: Logo + meta + intro */}
          <div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-5 flex items-center gap-4 sm:gap-5">
              <div className="relative w-[140px] sm:w-[170px] h-[48px] sm:h-[56px] shrink-0">
                {props.fields.Image.value?.src &&(
                <Image src={props.fields.Image?.value?.src} alt={props.fields.Branch?.value} fill className="object-contain" />
                )}
                </div>

              <dl className="text-[13.5px] sm:text-[14px] md:text-[15px] text-slate-800 leading-6">
                <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                  <dt className="text-slate-500">{t("Branch")}</dt>
                  <dd className="font-medium">{props.fields.Branch?.value}</dd>
                </div>
                <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                  <dt className="text-slate-500">{t("Phone")}</dt>
                  <dd className="font-medium ltr:tracking-wider">{props.fields.Phone?.value}</dd>
                </div>
              </dl>
            </div>

            <p className="mt-5 text-[14px] md:text-[15px] text-slate-700 leading-relaxed">
              {props.fields.Description?.value}
            </p>
          </div>

          {/* Right text block */}
          <div className="text-[14px] md:text-[15px] text-slate-700 leading-relaxed">
            <RichText field={props.fields.Info}></RichText>
          </div>
        </div>
          <Placeholder name="jss-component-fares-table" rendering={props.rendering}/>
      </section>
  );
};
