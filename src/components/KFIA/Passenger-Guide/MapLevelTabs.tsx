import { JSX ,useState } from 'react';
import Link from 'next/link';
import { Field,Placeholder } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';

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
    };
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
    <section data-level>
      <div className="mt-4">
        {MapTabHeaders}
      </div>
      <div>
      {MapTabInclusives}
      </div>
    </section>
  );
};
