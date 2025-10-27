"use client";
import { useState, useRef, JSX } from "react";
import { Field, ImageField, RichText } from "@sitecore-jss/sitecore-jss-nextjs";
import { ComponentProps } from "lib/component-props";
import Image from "next/image";
import { ArrowLeftRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "next-localization";

/* -------------------- Types -------------------- */
type FlipCardProps = ComponentProps & {
  fields: {
    Label: Field<string>;
    Image: ImageField;
    Content: Field<string>;
  };
};

type CardsSetProps = ComponentProps & {
  fields: {
    items: FlipCardProps[];
  };
};

/* -------------------- Flip Card -------------------- */
function FlipCard({ city, flipped, onFlip }: { city: FlipCardProps; flipped: boolean; onFlip: () => void }) {
  return (
    <div
      key={city.fields.Label?.value}
      className="w-full aspect-[4/5] xs:aspect-[5/6] md:aspect-[353/384] [perspective:1000px] snap-start cursor-pointer"
      onClick={onFlip}
    >
      <div
        className={`relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d]
        ${flipped ? "[transform:rotateY(180deg)]" : ""}`}
      >
        {/* FRONT */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-md bg-neutral-100 [backface-visibility:hidden]">
          {city.fields.Image?.value?.src && (
            <Image
              src={city.fields.Image.value.src}
              alt={city.fields.Label?.value}
              fill
              priority={false}
              className="object-cover"
              sizes="(max-width:480px)80vw,(max-width:900px)50vw,(max-width:1400px)33vw,360px"
            />
          )}
          {/* Title */}
          <div className="absolute inset-x-0 bottom-0 px-2 pb-2 pt-6 bg-gradient-to-t from-black/45 to-transparent">
            <div className="inline-flex max-w-full rounded-lg bg-[color:var(--kfia-brand)] text-white px-2 py-0.5 text-[13px] font-medium">
              <span className="truncate">{city.fields.Label?.value}</span>
            </div>
          </div>

          {/* Icon */}
          <div className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-[color:var(--kfia-brand)] text-white grid place-items-center shadow-md pointer-events-none">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 rounded-2xl bg-white text-black border border-neutral-200 p-3 sm:p-4 [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-hidden">
          <RichText field={city.fields.Content} />
          <div className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-[color:var(--kfia-brand)] text-white grid place-items-center shadow-md pointer-events-none">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- Main Component -------------------- */
export const Default = (props: CardsSetProps): JSX.Element => {
  const items = props.fields.items || [];
  const [flipped, setFlipped] = useState<boolean[]>(Array(items.length).fill(false));
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFlip = (index: number) => {
    setFlipped((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };

  const scroll = (dir: number) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };
 const {t} = useI18n();
  return (
    <section className="kfia-content kfia-section pt-6 md:pt-8">
      <h2
        className="text-center font-semibold text-[color:var(--kfia-brand)] mb-5"
        style={{ fontSize: "var(--heading4-size)" }}
      >
        {t('Destinations')}
      </h2>

      <div className="max-w-[1200px] mx-auto relative">
        {/* Desktop grid */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((city, i) => (
            <FlipCard key={i} city={city} flipped={flipped[i]} onFlip={() => toggleFlip(i)} />
          ))}
        </div>

        {/* Mobile slider */}
        <div
          ref={containerRef}
          className="sm:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pl-1 pr-3 [scrollbar-width:none] [-ms-overflow-style:none]"
          style={{ WebkitOverflowScrolling: "touch", scrollPaddingLeft: "32px" } as React.CSSProperties}
        >
          {items.map((city, i) => (
            <div key={i} className="shrink-0 snap-start w-[86%] max-w-[340px]">
              <FlipCard city={city} flipped={flipped[i]} onFlip={() => toggleFlip(i)} />
            </div>
          ))}
              {/* Arrows visible only on md+ */}
        <button
          onClick={() => scroll(-1)}
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur rounded-full shadow p-2 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[color:var(--kfia-brand)]"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={() => scroll(1)}
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur rounded-full shadow p-2 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[color:var(--kfia-brand)]"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
        </div>

    
      </div>
    </section>
  );
};
