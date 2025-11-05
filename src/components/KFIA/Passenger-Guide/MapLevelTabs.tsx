import { JSX ,useEffect,useState } from 'react';
import Link from 'next/link';
import {  ArrowLeft } from "lucide-react";
import { Field,Placeholder } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import { usePathname } from 'next/navigation';

type MapTabsWrapperProps = ComponentProps & {
  id: string; // Sitecore ID
  displayName:string;
  fields:{
  TabName:Field<string>
  }
}

type MapLevelTabsProps = ComponentProps & {
  fields:{
  items: MapTabsWrapperProps[];
}
}

export const Default = (props: MapLevelTabsProps): JSX.Element => {
   const [activeTab, setActiveTab] = useState(0);
  
    const handleTabClick = (index: number) => {
    setActiveTab(index);
  };
     const pathname = usePathname() ?? "";
      const [isAirportMap, setIsAirportMap] = useState(false);
        
      useEffect(() => {
          // Check if the URL contains "Shope-dine" (case-insensitive)
          setIsAirportMap(pathname?.toLowerCase().includes("map"));
      }, [pathname]);
  const MapTabHeaders =
  <div
      role="tablist"
      aria-label="Airport map levels"
      className={[
        "-mx-4 px-4", // edge-to-edge on mobile so pills can scroll
        "flex gap-2 overflow-x-auto no-scrollbar touch-pan-x",
        "sm:mx-0 sm:px-0 sm:flex-wrap"
      ].join(" ")}>
   { props.fields.items &&
     props.fields.items.map(
      (tab, index) => 
        index <= props.fields.items.length && (
          <Link
            key={index}
            role="tab"
            href={`#${tab.displayName}`}
            onClick={() => handleTabClick(index)}
            className={[
              "shrink-0 whitespace-nowrap",
              "px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-lg text-sm font-medium transition",
               activeTab === index  
                ? "bg-[color:var(--kfia-brand)] text-white shadow"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200",
            ].join(" ")}
          >
            {tab.fields.TabName?.value}
          </Link>)
     )
    }
  </div>


    const MapTabInclusives =
    props.fields.items &&
    props.fields.items.map((tab, index) => (
      <div
        key={index} id={tab.displayName} 
        className={`tab-content ${activeTab === index ? "active" : ""}`}
      >
        {activeTab === index && (
        <Placeholder name={`jss-Map-level-${index}`} rendering={props.rendering} />
        )}
      </div>
    ));

  return (
    <>
    {isAirportMap ?
    (<div className="kfia-content p-0 mt-8 mb-4">
        <Link className="inline-flex items-center gap-2 text-[color:var(--kfia-brand)] hover:underline text-[14px] sm:text-[15px] font-medium" href="/guide/passenger">
          <ArrowLeft className="h-4 w-4" />
          Back to Passenger Guide
        </Link>
      </div>):<></>
    }
    <section className='kfia-content kfia-section pt-6 md:pt-8 mt-8 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 md:p-6 shadow-sm' data-level>
      <div className="mt-4">
        {MapTabHeaders}
      </div>
      <div>
      {MapTabInclusives}
      </div>
    </section>
    </>
  );
};
