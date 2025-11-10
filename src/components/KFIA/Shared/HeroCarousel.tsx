"use client";
import { JSX } from "react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ComponentProps } from "lib/component-props";
import { Field, ImageField } from "@sitecore-jss/sitecore-jss-nextjs";

type HeroCarouselProps = ComponentProps & {
  fields: {
    items: Slide[];
  };
};

type Slide = {
  fields: {
    Kicker: Field<string>;
    Title: Field<string>;
    Blurb: Field<string>;
    Background: ImageField;
  };
};

const AUTOPLAY_MS = 6500;

export const Default = (props: HeroCarouselProps): JSX.Element | null => {
  if (!Array.isArray(props.fields?.items) || props.fields.items.length === 0) {
    return null;
  }

  const safeSlides = props.fields.items;
  const multi = safeSlides.length > 1;

  const [index, setIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const next = () => setIndex((i) => (i + 1) % safeSlides.length);
  const prev = () => setIndex((i) => (i - 1 + safeSlides.length) % safeSlides.length);
  const goTo = (i: number) =>
    setIndex(((i % safeSlides.length) + safeSlides.length) % safeSlides.length);

  useEffect(() => {
    if (!multi) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!document.hidden) next();
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [multi, safeSlides.length]);

  return (
    <section className="full-bleed-carousel relative" aria-label="Hero">
      <div
        className="
           relative overflow-hidden  h-[280px] sm:h-[360px] md:h-[480px] lg:h-[600px] xl:h-[720px] 
        "
      >
        {safeSlides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            {/* Background */}
            {s.fields.Background?.value?.src && (
              <Image
                src={s.fields.Background.value.src}
                alt={s.fields.Title?.value || ""}
                fill
                sizes="100vw"
                priority={i === 0}
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 kfia-hero-overlay" />

            {/* Copy */}
            <div className="absolute inset-0">
            <div className="kfia-content h-full flex items-center">
            <div className="max-w-[60%] text-white px-4 sm:px-0">
                {s.fields.Kicker?.value && (
                  <p className="mb-2 font-medium opacity-90 text-[14px] sm:text-[16px] md:text-[18px]">
                    {s.fields.Kicker.value}
                  </p>
                )}
                {s.fields.Title?.value && (
                  <h1 className="font-bold tracking-tight whitespace-pre-line text-[28px] sm:text-[36px] md:text-[length:var(--heading1-size)] leading-[1.15] md:leading-[1.1] xl:leading-[1.05]">
                    {s.fields.Title.value}
                  </h1>
                )}
                {s.fields.Blurb?.value && (
                  <p className="mt-3 sm:mt-6 max-w-2xl opacity-90 text-[14px] sm:text-[15px] md:text-[18px]">
                    {s.fields.Blurb.value}
                  </p>
                )}
              </div>
            </div>
            </div>
          </div>
        ))}

        {/* Controls */}
        {multi && (
          <>
            {/* Mobile small arrows */}
            <div className="absolute right-3 bottom-[max(1rem,env(safe-area-inset-bottom))] md:hidden z-10 rtl:right-auto rtl:left-3">
              <ArrowGroup size="sm" onPrev={prev} onNext={next} />
            </div>
            {/* Desktop arrows */}
            <div className="hidden md:block absolute right-10 lg:right-14 top-1/2 -translate-y-1/2 z-10 rtl:right-auto rtl:left-10 rtl:lg:left-14">
              <ArrowGroup size="xl" onPrev={prev} onNext={next} />
            </div>

            {/* Dots */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-3 sm:bottom-4 md:bottom-6 flex gap-2 sm:gap-3 z-10">
              {safeSlides.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index
                      ? "w-5 sm:w-6 bg-white"
                      : "w-1.5 bg-white/70 hover:bg-white/90"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

function ArrowGroup({
  size,
  onPrev,
  onNext,
}: {
  size: "sm" | "lg" | "xl";
  onPrev: () => void;
  onNext: () => void;
}) {
  const base =
    "grid place-items-center rounded-full border border-white/70 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 transition";
  const dim =
    size === "sm"
      ? "w-8 h-8"
      : size === "lg"
      ? "w-12 h-12"
      : "w-16 h-16";
  const icon =
    size === "sm"
      ? "w-4 h-4"
      : size === "lg"
      ? "w-[22px] h-[22px]"
      : "w-7 h-7";

  return (
    <div className="pointer-events-none">
      <div className="flex gap-2 sm:gap-3 pointer-events-auto">
        <button
          type="button"
          aria-label="Previous slide"
          className={`${base} ${dim}`}
          onClick={onPrev}
        >
          <ChevronLeft className={`${icon} rtl:rotate-180`} aria-hidden />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          className={`${base} ${dim}`}
          onClick={onNext}
        >
          <ChevronRight className={`${icon} rtl:rotate-180`} aria-hidden />
        </button>
      </div>
    </div>
  );
}
