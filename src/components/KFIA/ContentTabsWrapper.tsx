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
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
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
                      "inline-flex items-center justify-center whitespace-nowrap px-3.5 py-2",
                      "text-[13px] leading-none font-medium",
                      // active pill vs plain text
                       activeTab === index  
                        ? "rounded-lg bg-[color:var(--kfia-brand,#60498C)] text-white shadow-sm ring-1 ring-[color:var(--kfia-brand,#60498C)]/35"
                        : "text-[color:var(--kfia-brand,#60498C)]/90 hover:text-[color:var(--kfia-brand,#60498C)]",
                      // focus
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kfia-brand,#60498C)]/30",
                      // keep hit-area consistent
                      "min-w-[max-content]"
                    ].join(" ")}
          >
             <Link
                      className="nav-link"
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
            <div data-tab-content="" className="p-5">
              <div role="tabpanel">
                <section className="kfia-content py-12 md:py-16">
                  <div className="space-y-8 -mt-6">
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
        <nav aria-label="Section tabs" className="relative">
          {/* Rail */}
          <div
            className="
              rounded-2xl
              bg-[color:var(--kfia-brand,#60498C)]/12
              px-2 py-1
            "
          >
            {/* Row: evenly spaced like the reference */}
            <div className="flex items-center justify-between gap-1.5 overflow-x-auto no-scrollbar">
              {TabHeaders}
            </div>
            </div>
                {/* Bottom hairline like the reference */}
          <div className="h-px bg-slate-200/70 mt-2" />
        </nav>
        {TabInclusives}
      </div>
      </div>
    </div>
  );
};
