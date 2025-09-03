import { JSX } from 'react';
import {  Field, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';

import Image from "next/image";
import Link from 'next/link';
type Link = {
    href:string,
    text:string
}
type FooterProps = ComponentProps & {
 fields:{
  Logo:ImageField,
  FooterLinks:{fields:{ Link: Field<Link> } }[],
  SocialMediaLinks:{fields:{ Link: Field<Link> , Icon:ImageField } }[],
  CopyrightText:Field<string>
 }
}

export const Default = (props: FooterProps): JSX.Element => {
  return (
       <footer className="full-bleed kfia-footer">
      <div className="kfia-section">
        <div className="kfia-content">
          {/* Logo (no container around it now) */}
          <div className="flex justify-center">
            {(props.fields.Logo.value?.src &&
            <Image
              src={props.fields.Logo.value?.src}
              alt="King Fahd International Airport logo"
              width={200}
              height={100}
              className="kfia-logo-lg w-auto"
              priority
            />
             )}
          </div>

          {/* Nav */}
          <nav
            className="mt-8 md:mt-10 flex justify-center"
            aria-label="Footer navigation"
          >
            <ul className="flex flex-wrap items-center gap-x-8 md:gap-x-10 gap-y-4 text-slate-800 text-base md:text-lg">
              {props.fields.FooterLinks?.map((link, index) => (
              <li key={index}><Link href={link.fields.Link?.value.href} className="hover:opacity-80">{link.fields.Link?.value?.text}</Link></li>
              ))}
              </ul>
          </nav>

          {/* Socials */}
          <div className="mt-8 md:mt-10 flex justify-center gap-5 md:gap-6">
            {props.fields.SocialMediaLinks?.map((link, index) => (
                <Link key={index}
                  href={link.fields.Link?.value?.href}
                  aria-label={link.fields.Link?.value?.text}
                  className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-slate-300 text-slate-800 hover:bg-slate-100 transition-colors"
                >
                   {(link.fields.Icon?.value?.src &&
                     <Image
                      src={link.fields.Icon?.value?.src}
                      alt="King Fahd International Airport logo"
                      width={25}
                      height={25}
                      className="w-6 h-6"
                      priority
                    />
                   )}
            </Link>
            ))}
          </div>

          <div className="mt-8 md:mt-10">
            <hr className="border-t border-slate-300" />
          </div>

          <div className="mt-6 flex justify-center">
            <p className="text-slate-700 text-base md:text-lg flex items-center gap-2">
              <span>{props.fields.CopyrightText?.value}</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
