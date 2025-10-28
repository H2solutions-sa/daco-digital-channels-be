import { JSX } from 'react';
import { ComponentProps } from 'lib/component-props';
import { useI18n } from 'next-localization';
import { MapPin } from "lucide-react";
import { Field, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';
import Image from "next/image";

type PillEntryCardListProps = ComponentProps & {
 fields:{
  items:PillEntryCardProps[]
 }
}

type PillEntryCardProps = ComponentProps & {
 fields:{
  PillTitle:Field<string>,
  Location:Field<string>,
  Details: Field<string>
  Image:ImageField
 }
}

export const Default = (props: PillEntryCardListProps): JSX.Element => {
const {t} = useI18n();

  const dropOffCardList = props.fields.items && props.fields.items.slice(0,4).map((pillCard, i) => (
              <div key={i} className="snap-start shrink-0 w-[100%] h-[540px]">
                    <div
                      className={[
                        "h-full min-h-[340px] flex flex-col p-4",
                        "rounded-xl border border-slate-200 bg-slate-50",
                        "md:min-h-0 md:block md:p-6",
                      ].join(" ")}
                    >
                      <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-[13px] md:text-[14px] font-medium text-slate-800">
                        <span className="inline-block h-[6px] w-[6px] rounded-full bg-[color:var(--kfia-secondary)]" />
                        {pillCard.fields.PillTitle?.value}
                      </div>

                      {pillCard.fields.Image?.value?.src && (
                        <div className="mt-4">
                          <div className="relative w-full overflow-hidden rounded-lg bg-slate-100 aspect-[16/9] sm:aspect-[4/3] md:aspect-[16/9]">
                            <Image
                              src={pillCard.fields.Image?.value?.src}
                              alt={pillCard.fields.PillTitle?.value}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          </div>
                        </div>
                      )}

                      <div className="mt-4 flex-1 min-h-0 flex flex-col gap-4 md:block">
                        <div className="shrink-0">
                          <div className="flex items-center gap-2 text-[14px] md:text-[15px] font-semibold text-slate-900">
                            <MapPin className="h-[16px] w-[16px] text-slate-500" />
                            {t("Location")}
                          </div>
                          <p className="mt-1 text-[13px] md:text-[14px] text-slate-700 leading-relaxed line-clamp-4 md:line-clamp-none">
                            {pillCard.fields.Location?.value}
                          </p>
                        </div>

                        <div className="md:hidden h-px bg-slate-200/70" />

                        <div className="min-h-0 flex-1">
                          <div className="flex items-center gap-2 text-[14px] md:text-[15px] font-semibold text-slate-900">
                            <span className="inline-block h-[10px] w-[10px] rounded-full border border-[color:var(--kfia-secondary)]" />
                            {t("Details")}
                          </div>
                          <p className="mt-1 text-[13px] md:text-[14px] text-slate-700 leading-relaxed line-clamp-6 md:line-clamp-none">
                            {pillCard.fields.Details?.value}
                          </p>
                        </div>
                      </div>
                    </div>
              </div>
            ));

  const pickUpCardList = props.fields.items && props.fields.items.slice(4,8).map((pickUpPillCard, c) => (
              <div key={c} className="snap-start shrink-0 w-[100%] h-[540px]">
                    <div
                      className={[
                        "h-full min-h-[340px] flex flex-col p-4",
                        "rounded-xl border border-slate-200 bg-slate-50",
                        "md:min-h-0 md:block md:p-6",
                      ].join(" ")}
                    >
                      <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-[13px] md:text-[14px] font-medium text-slate-800">
                        <span className="inline-block h-[6px] w-[6px] rounded-full bg-[color:var(--kfia-secondary)]" />
                        {pickUpPillCard.fields.PillTitle?.value}
                      </div>
 {pickUpPillCard.fields.Image?.value?.src && (
                        <div className="mt-4">
                          <div className="relative w-full overflow-hidden rounded-lg bg-slate-100 aspect-[16/9] sm:aspect-[4/3] md:aspect-[16/9]">
                            <Image
                              src={pickUpPillCard.fields.Image?.value?.src}
                              alt={pickUpPillCard.fields.PillTitle?.value}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          </div>
                        </div>
                      )}
                      <div className="mt-4 flex-1 min-h-0 flex flex-col gap-4 md:block">
                        <div className="shrink-0">
                          <div className="flex items-center gap-2 text-[14px] md:text-[15px] font-semibold text-slate-900">
                            <MapPin className="h-[16px] w-[16px] text-slate-500" />
                            {t("Location")}
                          </div>
                          <p className="mt-1 text-[13px] md:text-[14px] text-slate-700 leading-relaxed line-clamp-4 md:line-clamp-none">
                            {pickUpPillCard.fields.Location?.value}
                          </p>
                        </div>

                        <div className="md:hidden h-px bg-slate-200/70" />

                        <div className="min-h-0 flex-1">
                          <div className="flex items-center gap-2 text-[14px] md:text-[15px] font-semibold text-slate-900">
                            <span className="inline-block h-[10px] w-[10px] rounded-full border border-[color:var(--kfia-secondary)]" />
                            {t("Details")}
                          </div>
                          <p className="mt-1 text-[13px] md:text-[14px] text-slate-700 leading-relaxed line-clamp-6 md:line-clamp-none">
                            {pickUpPillCard.fields.Details?.value}
                          </p>
                        </div>
                      </div>
                    </div>
              </div>
            ));
  return (
  <div className="space-y-6 -mt-6">
      {/* Main content card */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-5 md:px-7 py-4 border-b border-slate-200">
          <h2 className="text-[18px] md:text-[20px] font-semibold text-[color:var(--kfia-brand)]">
            {t("Pick-up-drop-off")}
          </h2>
        </div>

        {/* Intro: Pick Up */}
        <div className="px-5 md:px-7 pt-6 md:pt-7">
          <h3 className="text-[16px] md:text-[18px] font-semibold text-slate-900">
            {t("Pick-up-title")}
          </h3>
          <p className="mt-2 text-[14px] md:text-[15px] text-slate-800 leading-relaxed">
          {t("Pick-up-description")}
          </p>
        </div>

        {/* Pick-up: mobile swipe / desktop grid */}
        <div className="px-5 md:px-7 py-6 md:py-7">
          {/* Mobile swipeable row */}
          <div className="md:hidden -mx-1 no-scrollbar flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-1">
           {pickUpCardList}
          </div>

          {/* Tablet/Desktop grid (unchanged) */}
          <div className="hidden md:grid grid-cols-2 gap-6">
            {pickUpCardList}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-200 mx-5 md:mx-7" />

        {/* Intro: Drop Off */}
        <div className="px-5 md:px-7 pt-6 md:pt-7">
          <h3 className="text-[16px] md:text-[18px] font-semibold text-slate-900">{t("Drop-off-title")}</h3>
          <p className="mt-2 text-[14px] md:text-[15px] text-slate-800 leading-relaxed">
            {t("drop-off-description")}
          </p>
        </div>

        {/* Drop-off: mobile swipe / desktop grid */}
        <div className="px-5 md:px-7 py-6 md:py-7">
          {/* Mobile swipeable row */}
          <div className="md:hidden -mx-1 no-scrollbar flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-1">
            {dropOffCardList}
          </div>

          {/* Tablet/Desktop grid (unchanged) */}
          <div className="hidden md:grid grid-cols-2 gap-6">
            {dropOffCardList}
          </div>
        </div>
      </section>
    </div>
  );
};
