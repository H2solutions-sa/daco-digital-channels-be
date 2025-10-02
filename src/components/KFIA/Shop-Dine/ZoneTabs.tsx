import { JSX ,useState } from 'react';
import Link from 'next/link';
import { Field,Placeholder } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';

type ZoneTabsWrapperProps = ComponentProps & {
  id: string; // Sitecore ID
  displayName:string;
  fields:{
  TabName:Field<string>
  }
}

type ZoneTabsProps = ComponentProps & {
  fields:{
  items: ZoneTabsWrapperProps[];
}
}

export const Default = (props: ZoneTabsProps): JSX.Element => {
  const [activeTab, setActiveTab] = useState(0);
  
  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };
  const ZoneTabHeaders =
  <div
      role="tablist"
      aria-label="Zone Tabs"
      className={[
        "mt-4 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3"
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
                  "h-[44px] sm:h-[48px] w-full rounded-xl border text-sm transition text-center pt-3",
                  activeTab === index  
                    ? "bg-[color:var(--kfia-brand)] text-white border-[color:var(--kfia-brand)] shadow-sm"
                    : "bg-white text-[color:var(--kfia-brand)] border-[color:var(--kfia-brand)]/15 hover:bg-[oklch(0.98_0_0)]",
                ].join(" ")}
          >
            {tab.fields.TabName?.value}
          </Link>)
     )
    };
  </div>
 const ZoneTabInclusives =
    props.fields.items &&
    props.fields.items.map((tab, i) => (
      <div
        key={i} id={tab.displayName} 
        className={`tab-content ${activeTab === i ? "active" : ""}`}
      >
        {activeTab === i && (
        <Placeholder name={`jss-Zone-level-${i}`} rendering={props.rendering} />
        )}
      </div>
    ));
  return (
    <section data-level>
      <div className="mt-4">
        {ZoneTabHeaders}
      </div>
      <div>
      {ZoneTabInclusives}
      </div>
    </section>
  );
};
