import { JSX, useRef, useState } from "react";
import Image from "next/image";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import Slider from "react-slick";
import { ComponentProps } from "lib/component-props";
import { Field, ImageField } from "@sitecore-jss/sitecore-jss-nextjs";

type LoungeCardsProps = ComponentProps & {
  fields: {
    CardTitle: Field<string>;
    CardSubTitle: Field<string>;
    CardImg: ImageField;
    Chips: { fields: { ChipName: Field<string>; ChipIcon: ImageField } }[];
    Images: { fields: { slide: ImageField } }[];
  };
};

type LoungeCardsListProps = ComponentProps & {
  fields: {
    items: LoungeCardsProps[];
  };
};

// ⬇️ A small component to handle its own slider logic
const LoungeCard = ({ card }: { card: LoungeCardsProps }) => {
  const [idx, setIdx] = useState(0);
  const slickRef = useRef<Slider | null>(null);

  const settings = {
    arrows: false,
    dots: false,
    infinite: false,
    speed: 350,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    adaptiveHeight: false,
    beforeChange: (_: number, next: number) => setIdx(next),
  } as const;

  const goPrev = () => slickRef.current?.slickPrev();
  const goNext = () => slickRef.current?.slickNext();
  const goTo = (i: number) => slickRef.current?.slickGoTo(i, true);

  const canPrev = idx > 0;

  const CARD_BASE =
    "relative flex h-full flex-col rounded-2xl border border-[oklch(0.75_0_0)]/22 bg-white shadow-sm" +
    "focus-within:ring-2 focus-within:ring-[color:var(--kfia-brand)]/20";

  return (
    <article className={CARD_BASE} aria-label={card.fields.CardTitle?.value}>
      <div className="relative overflow-hidden rounded-xl h-[190px] sm:h-[210px] md:h-[220px]">
        <Slider ref={slickRef} {...settings}>
          {card.fields.Images.map((img, i) => {
            const src = img.fields.slide.value?.src;
            if (!src) return null;
            const isSvg = src.toLowerCase().endsWith(".svg");

            return (
              <div key={i} className="relative h-[190px] sm:h-[210px] md:h-[220px]">
                {isSvg ? (
                  <img src={src} alt="slide" className="h-full w-full object-cover" />
                ) : (
                  <Image src={src} alt="slide" fill sizes="100vw" className="object-cover" priority={i === 0} />
                )}
              </div>
            );
          })}
        </Slider>

        {/* Arrows */}
        {card.fields.Images.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous"
              className={`absolute left-3 top-1/2 -translate-y-1/2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full shadow transition ${
                canPrev
                  ? "bg-[color:var(--kfia-brand)] text-white hover:brightness-110"
                  : "bg-[oklch(0.85_0.03_300)]/50 text-white cursor-not-allowed"
              }`}
              disabled={!canPrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={goNext}
              aria-label="Next"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full shadow bg-[color:var(--kfia-brand)] text-white hover:brightness-110 transition"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        {/* Dots */}
        {card.fields.Images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {card.fields.Images.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 w-2 rounded-full transition ${
                  i === idx ? "bg-[color:var(--kfia-brand)]" : "bg-white/80"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="flex-1 mt-3 text-center">
        {card.fields.CardImg?.value?.src && (
          <div className="flex justify-center">
            <Image
              src={card.fields.CardImg.value.src}
              alt={`${card.fields.CardTitle?.value} logo`}
              width={280}
              height={112}
              className="object-contain"
              style={{ maxHeight: 112, minHeight: 64, maxWidth: 280 }}
            />
          </div>
        )}
        <h3 className="mt-3 font-semibold tracking-tight text-neutral-900">
          {card.fields.CardTitle?.value}
        </h3>
        {card.fields.CardSubTitle?.value && (
          <div className="mt-1 flex items-center justify-center gap-1 text-sm text-[color:var(--kfia-brand)]">
            <MapPin className="h-[18px] w-[18px]" />
            <span>{card.fields.CardSubTitle?.value}</span>
          </div>
        )}
        <div className="mt-5 p-4">
          <button className="w-full rounded-lg bg-[color:var(--kfia-brand)] px-4 py-2.5 font-semibold text-white hover:opacity-90">
            Explore Lounge
          </button>
        </div>
      </div>
    </article>
  );
};

export const Default = (props: LoungeCardsListProps): JSX.Element => (
  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {props.fields.items?.map((card, i) => <LoungeCard key={i} card={card} />)}
  </div>
);
