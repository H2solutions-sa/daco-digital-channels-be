import { JSX } from 'react';
import { ComponentProps } from 'lib/component-props';
import { useMemo, useState } from "react";
import SearchBar from "./common/SearchBar";
import Tabs from "./FlightSection/Tabs";
import MiniFlightsTable, { RowSmall } from "./FlightSection/MiniFlightsTable";
import AirlineQuickLook from "./FlightSection/AirlineQuickLook";
import Link from "next/link";
import { Field, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';
import Image from 'next/image';
type FlightsSectionProps = ComponentProps & {
fields:{
 Title:Field<string>,
 SubTitle:Field<string>,
 Image:ImageField
}
}

export const Default = (props: FlightsSectionProps): JSX.Element => {
  const [tab, setTab] = useState<"arrivals" | "departures">("departures");
  const [showQuickLook, setShowQuickLook] = useState(false);
  const [searchCode, setSearchCode] = useState("SV");

  const rows: RowSmall[] = useMemo(
    () => [
      {
        flight: "ME 423",
        airlineLogo: "/-/media/Project/Daco Digital Channels/shared/mea.png",
        destination: "Beirut (BEY)",
        sch: "11:45",
        status: "LANDED",
        gate: "51IB",
        counter: "3",
      },
      {
        flight: "FZ 856",
        airlineLogo: "/-/media/Project/Daco Digital Channels/shared/flydubai.png",
        destination: "Dubai (DXB)",
        sch: "12:15",
        status: "LANDED",
        gate: "807",
        counter: "4",
      },
      {
        flight: "SV 1391",
        airlineLogo: "/-/media/Project/Daco Digital Channels/shared/saudia.png",
        destination: "AlQouf (AJF)",
        sch: "12:10",
        status: "LANDED",
        gate: "321A",
        counter: "5",
      },
      {
        flight: "XY 053",
        airlineLogo: "/-/media/Project/Daco Digital Channels/shared/flynas.png",
        destination: "Jeddah (JED)",
        sch: "12:10",
        status: "LATE",
        gate: "51IB",
        counter: "11",
      },
    ],
    []
  );

  function handleSearch() {
    setShowQuickLook(true);
  }

  const seeAllHref =
    tab === "arrivals"
      ? "/flights/arrivals#arrivals"
      : "/flights/departures#departures";
  const seeAllLabel =
    tab === "arrivals" ? "SEE ALL ARRIVALS" : "SEE ALL DEPARTURES";

  return (
    <section
      id="flights"
      className="w-full kfia-bg-muted scroll-mt-[96px] overflow-x-hidden"
    >
      <div className="mx-auto w-full max-w-[1440px] px-3 sm:px-4 md:px-8 kfia-section">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_560px] gap-y-8 lg:gap-y-0 lg:gap-16 xl:gap-24 2xl:gap-28 lg:items-stretch">
          {/* Left Column */}
          <div className="flex flex-col justify-center max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            <h2 className=" font-semibold tracking-tight text-[color:var(--kfia-brand)] text-[24px] sm:text-[32px] md:text-[length:var(--heading2-size)]">
              {props.fields.Title?.value}
              <br className="hidden sm:block" /> 
            </h2>
            <p className="mt-3 sm:mt-5 md:mt-8 max-w-[60ch] text-[color:var(--kfia-subtitle)] leading-6 sm:leading-7 md:leading-8 text-[14px] sm:text-[15px] md:text-[length:var(--paragraph1-size)]">
              {props.fields.SubTitle?.value}
            </p>
            <div className="w-full max-w-none lg:max-w-[60ch] overflow-hidden rounded-2xl mt-2 sm:mt-3 md:mt-4">
              <div className="relative w-full h-[190px] sm:h-[230px] md:h-[280px] lg:h-[360px] xl:h-[400px] overflow-hidden rounded-2xl">
                {props.fields.Image.value?.src && 
                <Image
                  src={props.fields.Image.value.src}
                  alt="Terminal aerial"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60ch"
                />
                }
              </div>
            </div>
          </div>
          

          {/* Right Column */}
          <div className="flex flex-col w-full lg:w-[560px] lg:justify-self-end mt-8 lg:mt-0">
            {showQuickLook ? (
              <AirlineQuickLook
                code={searchCode}
                setCode={setSearchCode}
                onBack={() => setShowQuickLook(false)}
              />
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 md:p-6 shadow-sm">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                  }}
                  className="contents"
                >
                  <SearchBar
                    value={searchCode}
                    onChange={setSearchCode}
                    onSearch={handleSearch}
                  />
                </form>

                <Tabs tab={tab} setTab={setTab} />

                <MiniFlightsTable rows={rows} />

                <div className="mt-4 flex justify-end">
                  <Link
                    href={seeAllHref}
                    className="text-sm font-medium kfia-link"
                    aria-label={seeAllLabel}
                  >
                    {seeAllLabel}
                  </Link>
                </div>
              </div>   )}
          </div>
        </div>
      </div>
    </section>
  );
};
