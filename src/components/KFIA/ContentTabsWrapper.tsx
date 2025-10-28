import { JSX , useState, useEffect } from 'react';
import { ComponentProps } from 'lib/component-props';
import { Field,Placeholder } from '@sitecore-jss/sitecore-jss-nextjs';
import Link from 'next/link';

type TabsListprops = ComponentProps&{
fields:{
  items:ContentTabsWrapperProps[];
}
}
type ContentTabsWrapperProps = ComponentProps & {
  id: string; // Sitecore ID
  displayName:string;
  fields:{
  TabName:Field<string>
  }
}

export const Default = (props: TabsListprops): JSX.Element => {
 const [activeTab, setActiveTab] = useState(0);
  useEffect(() => {
    const handleHashChange = () => {
      const hash = decodeURIComponent(window.location.hash.replace("#", ""));
      const index = props.fields.items.findIndex(
        (tab) => tab.displayName === hash
      );

      if (index !== -1) {
        setActiveTab(index);
      }
    };

    handleHashChange(); // run on mount
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [props.fields.items]);

  const handleTabClick = (index: number, displayName: string) => {
    setActiveTab(index);
    // router.push(`${router.pathname}#${encodeURIComponent(displayName)}`, undefined, {
    //   shallow: true,
    // });
  };

   const TabHeaders =
    props.fields.items &&
    props.fields.items.map(
      (tab, index) =>
        index <= props.fields.items.length && (
          <li
            key={index}
               className={[
                      // same text size & padding as screenshot
                      "inline-flex items-center justify-center whitespace-nowrap",
                      "text-[13px] leading-none font-medium",
                    ].join(" ")}
          >
             <Link
                      className={[
                    // layout
                    "flex items-center justify-center gap-2 rounded-xl px-4 sm:px-5 py-2.5",
                    "text-[14px] sm:text-[15px] leading-none font-semibold whitespace-nowrap",
                    // MOBILE: fixed-ish width items so they slide; DESKTOP: flex to fill
                    "min-w-[140px] flex-none snap-center md:min-w-0 md:flex-1",
                    // equal height
                    "min-h-[34px] md:min-h-[38px] text-center",
                    // states
                    activeTab === index  
                      ? "bg-[color:var(--kfia-brand,#60498C)] text-white shadow-sm ring-1 ring-[color:var(--kfia-brand,#60498C)]/35"
                      : "text-[color:var(--kfia-brand,#60498C)] hover:bg-[color:var(--kfia-brand,#60498C)]/15",
                    // focus
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kfia-brand,#60498C)]/30",
                    "transition-colors",
                  ].join(" ")}
                      role="tab"
                      href={`#${tab.displayName}`}
                      aria-controls={tab.displayName}
                      onClick={() => handleTabClick(index, tab.displayName)}
                    >
                      {tab.fields.TabName?.value}
                    </Link>
          </li>
        )
    );
  const TabInclusives =
    props.fields.items &&
    props.fields.items.map((tab, index) => (
      <div
        key={index} id={tab.displayName} 
        className={`tab-content ${activeTab === index ? "active" : ""}`}
      >
        {activeTab === index && (
          <div key={index}>
            <div data-tab-content="">
              <div role="tabpanel">
                <section>
                  <div className="space-y-8 -mt-">
                    <Placeholder name={`jss-content-tab-${index}`} rendering={props.rendering} />
                    </div>
                    </section>
              </div>
            </div>
          </div>
        )}
      </div>
    ));

  return (
    <div className="bg-white">
      <div className="pt-4 sm:pt-6"></div>
      <div className="py-2 sm:py-3">
      <div className="kfia-content">
        <nav aria-label="Section tabs" className="py-2 sm:py-3">
          {/* Rail */}
          <div
            className="
             rounded-2xl bg-[color:var(--kfia-brand,#60498C)]/12 px-3 py-2
            "
          >
            {/* Row: evenly spaced like the reference */}
            <div className="flex items-center justify-between gap-1.5 overflow-x-auto no-scrollbar">
              {TabHeaders}
            </div>
            </div>
        </nav>
        {TabInclusives}
      </div>
      </div>
    </div>
  );
};
