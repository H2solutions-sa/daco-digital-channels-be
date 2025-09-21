import { JSX } from 'react';
import { Field, ImageField, Placeholder } from '@sitecore-jss/sitecore-jss-nextjs';
import Link from "next/link";
import Image from "next/image";
import { ComponentProps } from 'lib/component-props';
import { usePathname } from "next/navigation";


type Linkfield = {
  href : string,
  text:string
}
type SideNavTabs = ComponentProps &{
  fields:{
  items:SectionSideNavProps[]
  }
}
type SectionSideNavProps = ComponentProps & {
  fields:{
    Link:Field<Linkfield>,
    Icon:ImageField
  }
}

export const Default = (props: SideNavTabs): JSX.Element => {
    const pathname = usePathname() ?? "";
  return (
    <div id="facilities-body" className="mx-auto my-6 max-w-[1200px] px-4 md:px-6">
     <div
      className="
        grid gap-6 lg:gap-8
        md:grid-cols-[minmax(240px,290px)_minmax(0,1fr)]
      "
    >
      <aside className={`relative md:sticky md:top-6`}>
      {/* Back link */}
      {/* {back && (
        <div className="mb-3 sm:mb-4 md:mb-0 md:absolute md:-top-9 md:left-0">
          <Link
            href={back.href}
            className="inline-flex items-center gap-2 text-[14px] sm:text-[15px] font-medium text-[color:var(--kfia-brand)] hover:underline"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" /> 
            {back.label ?? "Back"}
          </Link>
        </div>
      )} */}

      {/* Sidebar nav */}
      <nav
        className="w-full rounded-2xl bg-[oklch(0.97_0_0)] p-3 sm:p-4"
        aria-label="Section navigation"
      >
        {/* {heading && (
          <h2 className="px-3.5 pb-2 text-[12px] sm:text-[13px] font-semibold tracking-wide text-[color:var(--kfia-brand)]/70 uppercase">
            {heading}
          </h2>
        )} */}

        <ul className="space-y-2">
          {props.fields.items?.map((item, index) => {
            const normalized = item.fields.Link.value.href;
            const active = pathname === normalized || pathname.startsWith(normalized + "/");

            return (
              <li key={index}>
                <Link
                  href={item.fields.Link.value.href}
                  scroll={false} 
                  className={[
                    "flex items-center gap-3 px-3.5 py-2.5 sm:py-3 rounded-xl transition text-[14px] sm:text-[15px]",
                    active
                      ? "bg-[color:var(--kfia-brand)] text-white font-semibold shadow-sm"
                      : "text-[color:var(--kfia-brand)]/90 hover:bg-white hover:shadow-sm",
                  ].join(" ")}
                  aria-current={active ? "page" : undefined}
                >
                  {item.fields.Icon.value?.src && (
                    <Image
                    src={item.fields.Icon.value?.src}
                    alt={item.fields.Link.value.text}
                    width={18}
                    height={18}
                    className={`shrink-0 w-[18px] h-[18px] sm:w-5 sm:h-5 ${
                        active ? "white-icon" : "text-[color:var(--kfia-brand)]/90"
                    }`}
                    />
                  )}
                  <span className="leading-tight break-words">{item.fields.Link.value.text}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      </aside>
       <section
        className="
          rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 md:p-6
          min-w-0
        "
      >
        <Placeholder name="jss-aside-content" rendering={props.rendering}/>
      </section>
      </div> 
      </div>
  );
};
