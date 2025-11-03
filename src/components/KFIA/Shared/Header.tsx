import { JSX , useState} from 'react';
import Image from "next/image";
import Link from "next/link";
import { ImageField , Field, Placeholder} from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import {  Search as SearchIcon, Phone } from "lucide-react";
import { SearchOverlay } from "../header/SearchOverlay";

type Link ={
    href:string,
    text:string
}
type HeaderProps = ComponentProps & {
fields:{
Logo:ImageField,
ContactButton:Field<Link>,
}
}

export const Default = (props: HeaderProps): JSX.Element => {

  const [searchOpen, setSearchOpen] = useState(false);
  return (
       <header className="bg-white relative z-40 font-sans">
      <div
        className="h-[60px] sm:h-[66px] md:h-[72px] xl:h-[84px] flex items-center justify-between px-3 sm:px-4 md:px-5 xl:px-8"
        style={{ maxWidth: "1460px", margin: "0 auto" }}
      >
        <div className="flex items-center gap-3 sm:gap-4 md:gap-4 xl:gap-5 shrink-0">
        <Link href="/" className="shrink-0 block" aria-label="KFIA Home">
        {props.fields.Logo.value?.src &&
            <Image src={props.fields.Logo.value?.src} alt="KFIA" width={160} height={30} className="sm:hidden" priority /> }
          {props.fields.Logo.value?.src &&  <Image src={props.fields.Logo.value?.src} alt="KFIA" width={200} height={38} className="hidden sm:block xl:hidden" priority /> }
          {props.fields.Logo.value?.src &&  <Image src={props.fields.Logo.value?.src} alt="KFIA" width={240} height={44} className="hidden xl:block" priority /> }
         
            </Link>
        </div>
      {!searchOpen && (
          <nav className="hidden xl:flex items-center gap-6 2xl:gap-8 text-[15px] 2xl:text-[16px] font-semibold">
           <Placeholder name={`jss-navigation`} rendering={props.rendering} />
          </nav>
        )}

        <div className="flex items-center gap-2 sm:gap-3 md:gap-3 xl:gap-4 shrink-0">
          <button
            onClick={() => setSearchOpen(true)}
            className="h-9 w-9 xl:h-11 xl:w-11 rounded-full border border-slate-400/90 flex items-center justify-center hover:bg-slate-50"
            aria-label="Open search"
          >
            <SearchIcon className="w-[18px] h-[18px] xl:w-[20px] xl:h-[20px] text-slate-700" />
          </button>

          {/* Mobile contact button (light grey) */}
          <Link
            href={props.fields.ContactButton?.value?.href}
            className="inline-flex xl:hidden h-9 w-9 items-center justify-center rounded-full bg-slate-100 border border-slate-300 text-slate-700 hover:bg-slate-50"
            aria-label="Contact us"
          >
            <Phone className="w-[18px] h-[18px]" />
           <span> {props.fields.ContactButton?.value?.text}</span>
          </Link>

          {/* Desktop contact button (light grey) */}
          <Link
            href={props.fields.ContactButton?.value?.href}
            className="hidden xl:flex items-center gap-2 px-3 py-2 2xl:px-5 2xl:py-3 text-sm 2xl:text-base rounded-full bg-slate-100 border border-slate-300 text-slate-800 hover:bg-slate-50"
            aria-label="Contact us"
          >
            <Phone className="w-[16px] h-[16px] 2xl:w-[20px] 2xl:h-[20px]" />
             <span> {props.fields.ContactButton?.value?.text}</span>
          </Link>
        </div>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <Placeholder name="jss-mobile-navigation" rendering={props.rendering} />

    </header>
  );
};
