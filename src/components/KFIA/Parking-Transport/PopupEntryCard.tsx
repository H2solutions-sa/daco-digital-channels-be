import { JSX } from 'react';


export const Default = (): JSX.Element => {
  return (
     <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-slate-50 p-5 md:p-6">
            <div className="relative mx-auto w-full h-[140px] md:h-[160px]">
              <img
                src="/-/media/Project/Daco Digital Channels/KFIA/taxi/taxi-pricing-card.svg"
                alt="Taxi Service"
                className="object-contain"
              />
            </div>
            <button
              type="button"
               onClick={() => {
                window.dispatchEvent(new CustomEvent("open-taxi-pricing"));
              }}
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-[color:var(--kfia-brand)] px-4 py-3 font-semibold text-white hover:opacity-90"
              style={{ fontSize: "var(--button-size)" }}
            >
              View Taxi Pricing List
            </button>
          </article>
  );
};
