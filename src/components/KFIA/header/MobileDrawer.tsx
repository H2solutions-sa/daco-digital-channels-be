"use client";

import React, { JSX, useEffect, useState } from "react";
import { ComponentProps } from "lib/component-props";
import { Field } from "@sitecore-jss/sitecore-jss-nextjs";
import { ChevronDown, Phone, X, Menu } from "lucide-react";

type Link = {
  href: string;
  text: string;
};

type navItems = ComponentProps & {
  fields: {
    MenuTitle: Field<Link>;
    MenuLinks: { displayName: string; fields: { Link: Field<Link> } }[];
  };
};

type MobileNavigationProps = ComponentProps & {
  fields: {
    items: navItems[];
  };
};

export const Default = (props: MobileNavigationProps): JSX.Element => {
  const sections = props.fields?.items || [];
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [open, setOpen] = React.useState(false);

 useEffect(() => {
    const body = document.body;
    const prev = body.style.overflow;
    body.style.overflow = open ? "hidden" : prev;
    return () => {
      body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
        <div>
          <button
        className="xl:hidden mobile-toggle-menu inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 hover:bg-slate-50"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="w-[20px] h-[20px]" />
      </button>
      </div>
   <div className={`xl:hidden fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/30 transition-opacity ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />

        {/* Drawer panel */}
        <aside
          className={`absolute right-0 top-0 h-full w-[88%] sm:w-[80%] max-w-[420px] bg-white shadow-xl transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-200">
            <span className="font-semibold">Menu</span>
            <button
              onClick={() => setOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 hover:bg-slate-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-2 overflow-y-auto h-[calc(100%-44px)]">
            <ul className="space-y-1">
              {sections.map((sec, i) => {
                const isOpen = openIdx === i;
                const hasKids = (sec.fields.MenuLinks?.length || 0) > 1;

                const goDefault = () => {
                  const href = sec.fields.MenuLinks[0]?.fields.Link?.value?.href ?? "/";
                  if (href) window.location.href = href;
                };

                return (
                  <li key={sec.fields.MenuTitle?.value.text}>
                    <div className="flex items-center justify-between px-2.5 py-2.5 rounded-lg hover:bg-slate-50">
                      <button
                        type="button"
                        className="text-[15px] font-semibold text-left"
                        onClick={goDefault}
                      >
                        {sec.fields.MenuTitle?.value?.text}
                      </button>

                      {hasKids && (
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          onClick={() => setOpenIdx(isOpen ? null : i)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 hover:bg-slate-100"
                        >
                          <ChevronDown
                            className={`w-4 h-4 text-slate-500 transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      )}
                    </div>

                    {hasKids && isOpen && (
                      <ul className="mt-1 ml-2 border-l border-slate-200">
                        {sec.fields.MenuLinks.map((it) => (
                          <li key={it.fields.Link?.value?.href}>
                            <a
                              href={it.fields.Link?.value?.href}
                              className="block px-4 py-2 text-[15px] transition-all duration-200 hover:text-[color:var(--kfia-brand)] hover:font-semibold hover:border-l-4 hover:border-[color:var(--kfia-brand)] hover:bg-slate-50"
                            >
                              {it.fields.Link?.value?.text}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}

              {/* Emergency link (optional) */}
              <li className="pt-2">
                <a
                  href="#"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[color:var(--kfia-brand)] text-white text-base font-semibold hover:opacity-90"
                >
                  <Phone className="w-[18px] h-[18px]" /> <span>Emergency</span>
                </a>
              </li>
            </ul>
          </nav>
        </aside>
      </div>
      </>

  );
};
