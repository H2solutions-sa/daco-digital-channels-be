import { JSX } from 'react';
import { useEffect, useState } from "react";
import { Clock, Sun, Accessibility } from "lucide-react";
import LanguageSwitcher from './LanguageSwitcher';
import Image from 'next/image';
import { useI18n } from 'next-localization';


export const Default = (): JSX.Element => {
  const {t} = useI18n();
  const [now, setNow] = useState(new Date());
  useEffect(() => { const i = setInterval(() => setNow(new Date()), 60_000); return () => clearInterval(i); }, []);
  const hh = now.getHours().toString().padStart(2,"0");
  const mm = now.getMinutes().toString().padStart(2,"0");

  const Item = ({ icon, label, hideLabelOnMobile=false }:{
    icon: React.ReactNode; label: string; hideLabelOnMobile?: boolean;
  }) => (
    <div style={{cursor:"pointer"}} className="flex items-center gap-1 sm:gap-2 text-[11px] sm:text-xs text-slate-700 shrink-0 px-2">
      <span className="w-4 h-4 grid place-items-center" aria-hidden>{icon}</span>
      <span className={hideLabelOnMobile ? "hidden sm:inline whitespace-nowrap" : "whitespace-nowrap"}>{label}</span>
    </div>
  );
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="kfia-content kfia-content--flush">
        <div className="h-8 sm:h-9 flex items-center">
          <div className="ml-auto flex items-center divide-x divide-gray-300 overflow-x-auto text-[11px] sm:text-xs">
            <Item icon={<Clock className="w-3.5 h-3.5" />} label={`${hh}:${mm}`} />
            <Item icon={<Sun className="w-3.5 h-3.5" />} label="30°C Dammam" />
            <LanguageSwitcher/>
             {/* Corporate site logo (SVG) */}
            <Item
              icon={
                <Image
                  src="/-/media/Project/Daco Digital Channels/Icons/icon-logo-top.svg"
                  alt=""                // decorative; label text provides the meaning
                  width={14}
                  height={14}
                  className="site-icon"
                  priority={false}
                />
              }
              label={t("Corporate-Site")}
              hideLabelOnMobile
            />
            <Item icon={<Accessibility className="w-3.5 h-3.5" />} label="Accessibility" hideLabelOnMobile />
          </div>
        </div>
      </div>
    </div>
  );
};
