import { JSX } from 'react';
import { ChevronDown } from "lucide-react";
import React from "react";
import { ComponentProps } from 'lib/component-props';
import { Field } from '@sitecore-jss/sitecore-jss-nextjs';
import Link from 'next/link';

type DesktopNavigationProps = ComponentProps & {
fields:{
  items:navItems[];
}
}

type Link = {
  href:string,
  text:string
}
type navItems = ComponentProps &{
  fields:{
      MenuTitle:Field<Link>,
      MenuLinks:{displayName:string, fields:{ Link: Field<Link>} }[],
  }
}

function useHoverable() {
  const [hoverable, setHoverable] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setHoverable(!!mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return hoverable;
}

export const Default = (props: DesktopNavigationProps): JSX.Element => {
  const hoverable = useHoverable();
  const [openIndex, setOpenIndex] = React.useState<number | null>(null); // track which menu is open

  const onToggle = (index: number) =>
    setOpenIndex((prev) => (prev === index ? null : index));
  const onMouseEnter = (index: number) => setOpenIndex(index);
  const onMouseLeave = () => setOpenIndex(null);

  return (
    <nav className="hidden xl:flex items-center gap-6 2xl:gap-8 text-[15px] 2xl:text-[16px] font-semibold text-[color:var(--kfia-brand)]">
    <div className="relative flex items-center flex-none">
      {props.fields.items?.map((menuItem, index) => (
        <div
                key={index}
                className="inline-flex rounded-full border-2 border-transparent hover:border-[color:var(--kfia-brand)] transition-colors"
              >
        <div
         
          className="relative flex items-center flex-none"
          onMouseEnter={hoverable ? () => onMouseEnter(index) : undefined}
          onMouseLeave={hoverable ? onMouseLeave : undefined}
        >
          {/* Label button */}
          <button
            type="button"
            onClick={
              hoverable ? (e) => e.preventDefault() : () => onToggle(index)
            }
            aria-expanded={openIndex === index}
            className="group inline-flex items-center gap-1 px-2 py-1.5 xl:px-3 xl:py-2 rounded-md whitespace-nowrap touch-manipulation"
          >
            <Link href={menuItem.fields.MenuTitle?.value?.href} className="relative transition-colors group-hover:text-[color:var(--kfia-brand)]">
              {menuItem.fields.MenuTitle?.value?.text}
            </Link>
            <ChevronDown
              className={`w-4 h-4 translate-y-[1px] text-slate-400 transition-transform ${
                openIndex === index ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          {openIndex === index && (
            <div className="absolute top-full left-0 pt-2 z-40">
              <ul
                className="w-[300px] xl:w-[320px] rounded-md border border-slate-200 bg-white shadow-md overflow-hidden font-sans font-normal"
                role="menu"
              >
                {menuItem.fields.MenuLinks?.map((linkObj, i) => {
                  const link = linkObj.fields.Link.value;
                  return (
                    <li key={linkObj.displayName} role="none">
                      <Link
                        href={`${link.href}#${linkObj.displayName}`}
                        role="menuitem"
                       // onClick={(e) => onItemClick(`${link.href}#${linkObj.displayName}`, e)}
                        className="block px-4 py-2.5 xl:py-3 text-[15px] whitespace-nowrap transition-all duration-200 hover:bg-slate-50 hover:text-[color:var(--kfia-brand)] hover:font-semibold hover:border-l-4 hover:border-[color:var(--kfia-brand)]"
                      >
                        {link.text}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        </div>
      ))}
    </div>
    </nav>
  );
};

