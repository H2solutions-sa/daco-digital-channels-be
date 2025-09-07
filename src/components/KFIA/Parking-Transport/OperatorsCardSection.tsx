import { JSX,useState,useRef,useMemo,useEffect } from 'react';
import { ComponentProps } from 'lib/component-props';
import { Field, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';
import Image from "next/image";
import { MapPin } from "lucide-react";
type OperatorsCardSectionProps = ComponentProps & {
  fields:{
    items:OperatorCard[],
  }
}
type OperatorCard = ComponentProps &{
  fields:{
    OperatorImg:ImageField,
    PhoneLabel:Field<string>,
    PhoneNumber:Field<string>,
    Location:Field<string>
  }
}

export const Default = (props: OperatorsCardSectionProps): JSX.Element => {
  /* ---------- desktop paging ---------- */
  const PAGE_SIZE = 9;
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(props.fields.items.length / PAGE_SIZE));
  const start = page * PAGE_SIZE;
  const visible = useMemo(
    () => props.fields.items.slice(start, start + PAGE_SIZE),
    [start]
  );

  /* ---------- mobile slider ---------- */
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const totalSlides = props.fields.items.length;
   const minHeightClass = "min-h-[280px] sm:min-h-[340px] md:min-h-[380px]";
  const imageHeightClass = "h-[130px] sm:h-[160px] md:h-[190px]";
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    const onScroll = () => {
      const cardWidth = el.clientWidth * 0.85;
      const gap = 16; // gap-4
      const i = Math.round(el.scrollLeft / (cardWidth + gap));
      setActiveSlide(Math.max(0, Math.min(totalSlides - 1, i)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [totalSlides]);

  const gotoSlide = (i: number) => {
    const el = sliderRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(totalSlides - 1, i));
    const cardWidth = el.clientWidth * 0.85;
    const gap = 16;
    el.scrollTo({ left: clamped * (cardWidth + gap), behavior: "smooth" });
    setActiveSlide(clamped);
  };

  const operatorCardItem = 
(optCard: OperatorCard, index: number) =>(
     <article key={index}
      className={[
        "flex h-full flex-col rounded-xl border border-slate-200 bg-slate-50",
        "p-4 sm:p-5 md:p-6",
        minHeightClass,
      ].join(" ")}
    >
      {/* Logo */}
      <div className={`relative mx-auto w-full ${imageHeightClass}`}>
        {optCard.fields.OperatorImg.value?.src &&
        <Image src={optCard.fields.OperatorImg.value?.src} alt="" fill className="object-contain" />
        }
        </div>

      {/* Meta */}
      <dl
        className={[
          "mt-4 sm:mt-5 md:mt-6",
          "space-y-4 sm:space-y-5 md:space-y-6",
          "text-[14px] sm:text-[15px] leading-6",
        ].join(" ")}
      >
        {/* Phone — allow wrapping + safe breaking */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 sm:gap-x-3 text-slate-900">
          <span className="text-slate-500 pr-0.5 sm:pr-1">{optCard.fields.PhoneLabel.value}</span>
          <a
            href={`tel:${optCard.fields.PhoneNumber.value}`}
            className="font-medium hover:underline break-all"
          >
            {optCard.fields.PhoneNumber.value}
          </a>
        </div>

        {/* Level */}
        <div className="flex items-center gap-2 sm:gap-3 text-slate-900">
          <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-[color:var(--kfia-brand)]" />
          <span className="font-medium">{optCard.fields.Location.value}</span>
        </div>
      </dl>
    </article>
  );
  return (
    <div>
        {/* ---- Mobile: slider ---- */}
        <div className="px-4 py-6 md:hidden">
          <div
            ref={sliderRef}
            className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory"
            aria-label="Car rental companies"
          >
            {props.fields.items.map((c, i) => (
              <div
                key={i}
                className="snap-start shrink-0 w-[85%]"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${totalSlides}`}
              >
                {operatorCardItem(c,i)}
              </div>
            ))}
          </div>

          {/* dots */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {props.fields.items.map((_, i) => (
              <button
                key={i}
                onClick={() => gotoSlide(i)}
                className={`h-1.5 rounded-full transition-all ${
                  activeSlide === i ? "w-6 bg-[color:var(--kfia-brand)]" : "w-1.5 bg-slate-300"
                }`}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={activeSlide === i ? "true" : undefined}
              />
            ))}
          </div>
        </div>

        {/* ---- Desktop/Tablet: grid ---- */}
        <div className="hidden md:block">
          <div className="px-5 md:px-7 py-8 md:py-9 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
            {visible.map((c,i) => (
              operatorCardItem(c,i)
            ))}
          </div>

          {/* Pager dots */}
          <div className="pb-6 md:pb-7 flex items-center justify-center gap-2">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                aria-label={`Go to page ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  page === i ? "w-8 bg-[color:var(--kfia-brand)]" : "w-1.5 bg-slate-300"
                }`}
                aria-current={page === i ? "true" : undefined}
              />
            ))}
          </div>
        </div>
    </div>
  );
};
