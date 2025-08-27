import { JSX } from 'react';
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Globe } from 'lucide-react';
const LanguageSwitcher = (): JSX.Element => {
  const router = useRouter();
  const [storedLang, setStoredLang] = useState<string>("en");
  const switchLanguage = () => {
    const currentLocale = Cookies.get("lang") || "en";
    const newLocale = currentLocale === "en" ? "ar" : "en";
    Cookies.set("lang", newLocale);
    router.push(router.asPath, router.asPath, {locale: newLocale});
  };
  useEffect(() => {
    const storedLangFromCookie = Cookies.get("lang");
    const newLocale = storedLangFromCookie || "en";
    setStoredLang(newLocale);

    // Update html attribute based on the language when component mounts
    document.documentElement.setAttribute(
      "dir",
      newLocale === "ar" ? "rtl" : "ltr"
    );
    document.documentElement.setAttribute(
      "lang",
      newLocale === "ar" ? "ar" : "en"
    );
  }, []);

  return (
    <div>
        
    <a className="flex items-center gap-1 sm:gap-2 text-[11px] sm:text-xs text-slate-700 shrink-0 px-2"
      onClick={switchLanguage}>
      <span className="w-4 h-4 grid place-items-center" aria-hidden><Globe className="w-3.5 h-3.5" /></span>
      <span className="whitespace-nowrap">{storedLang === "en" ? "عربي" : "English"}</span>
    </a> 
    </div>
  );
};

export default LanguageSwitcher;
