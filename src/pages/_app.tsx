import { JSX } from 'react';
import type { AppProps } from 'next/app';
import { I18nProvider } from 'next-localization';
import { SitecorePageProps } from 'lib/page-props';
import { useEffect } from "react";
import 'assets/globals.css';
import Cookies from "js-cookie";


function App({ Component, pageProps }: AppProps<SitecorePageProps>): JSX.Element {
  const { dictionary, ...rest } = pageProps;
  useEffect(() => {
    // Extract language from the URL or set a default
    const language = pageProps.locale;
    if (language) {
      Cookies.set("lang", language.toLowerCase());
      // Set layout attribute based on language
      document.documentElement.dir =
        language.toLowerCase() === "ar" ? "rtl" : "ltr";
      document.documentElement.lang =
        language.toLowerCase() === "ar" ? "ar" : "en";
      document.documentElement.setAttribute(
        "dir",
        language.toLowerCase() === "ar" ? "rtl" : "ltr"
      );
    }
    // Update language switcher elements by class on load
    const languageSwitcher = document.querySelector(".language-switcher");
    if (languageSwitcher) {
      const spanElement = languageSwitcher.querySelector("span");
      const imgElement = languageSwitcher.querySelector("img");

      if (spanElement) {
        spanElement.textContent = language === "en" ? "عربي" : "English";
      }
      if (imgElement) {
        imgElement.src =
          language === "en"
            ? "/-/media/PreLaunch-Onebank/eg"
            : "/-/media/PreLaunch-Onebank/en";
      }
    }
  }, [pageProps.locale]);
  return (
    <>
      {/*
        // Use the next-localization (w/ rosetta) library to provide our translation dictionary to the app.
        // Note Next.js does not (currently) provide anything for translation, only i18n routing.
        // If your app is not multilingual, next-localization and references to it can be removed.
      */}
      <I18nProvider lngDict={dictionary} locale={pageProps.locale}>
        <Component {...rest} />
      </I18nProvider>
    </>
  );
}

export default App;
