import { JSX } from 'react';
import {  Field, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import { FaXTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa6";

import Image from "next/image";
import Link from 'next/link';
type Link = {
    href:string,
    text:string,
    compact?: boolean;
    padLeft?: boolean;
    grow?: boolean;
}
type FooterProps = ComponentProps & {
 fields:{
  Logo:ImageField,
  FlightsFooterLinks:{fields:{ Link: Field<Link> } }[],
  ParkingFooterLinks:{fields:{ Link: Field<Link> } }[],
  ShopsFooterLinks:{fields:{ Link: Field<Link> } }[],
  ServicesFooterLinks:{fields:{ Link: Field<Link> } }[],
  GuideFooterLinks:{fields:{ Link: Field<Link> } }[],
  SocialMediaLinks:{fields:{ Link: Field<Link> , Icon:ImageField } }[],
  CopyrightText:Field<string>,
  WebsiteUpdate:Field<string>
 }
}

export const Default = (props: FooterProps): JSX.Element => {
  const mapLinks = (links: { fields: { Link: Field<Link> } }[] = []) =>
    links.map((item) => ({
      text: item.fields.Link.value?.text || "",
      href: item.fields.Link.value?.href || "#",
    }));
  const FLIGHTS = mapLinks(props.fields.FlightsFooterLinks);
  const PARKING = mapLinks(props.fields.ParkingFooterLinks);
  const SHOPSDINE = mapLinks(props.fields.ShopsFooterLinks);
  const FACILITIES = mapLinks(props.fields.ServicesFooterLinks);
  const GUIDE = mapLinks(props.fields.GuideFooterLinks);
  const SOCIALS = props.fields.SocialMediaLinks?.map((item) => ({
    href: item.fields.Link.value?.href || "#",
    icon: item.fields.Icon,
  })) || [];
  return (
    <footer
      className="w-full bg-[#F4F4F5] text-[#6B7280]"
      style={{ ["--kfia-brand" as any]: "#60498C" }}
    >
      <div className="mx-auto w-full max-w-[1380px] px-4 lg:px-6 xl:px-10 py-10 overflow-x-hidden">
        {/* ===== Top: Logo + Social + Columns ===== */}
        <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between">
          {/* Left: brand + socials */}
          <div className="xl:basis-[23%] flex flex-col items-start">
            {props.fields.Logo.value?.src && 
            <Image
              src={props.fields.Logo.value?.src}
              alt="King Fahd International Airport"
              width={260}
              height={37}
              className="w-36 sm:w-44 md:w-48 xl:w-[260px] h-auto mix-blend-multiply"
              priority
            />
            }
            <div className="mt-5 sm:mt-6 self-start flex items-center gap-3 sm:gap-4 md:gap-5">
                {props.fields.SocialMediaLinks?.map((link, index) => (
                <Link key={index}
                  href={link.fields.Link?.value?.href}
                  aria-label={link.fields.Link?.value?.text}
                  className="
        inline-flex items-center justify-center rounded-full border
        [border-color:var(--kfia-brand)] [color:var(--kfia-brand)] transition-colors
        h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 xl:h-12 xl:w-12
      "
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
          </div>

          {/* Right: columns */}
          <div className="mt-8 xl:mt-0 grow">
            {/* Mobile (<= xl-1): grid */}
            <div className="xl:hidden grid grid-cols-2 gap-x-5 gap-y-6 sm:gap-x-6 sm:gap-y-7">
              <FooterColumn compact title="Flights" items={FLIGHTS} />
              <FooterColumn compact title="Parking & Transport" items={PARKING} />
              <FooterColumn compact title="Shops & Dine" items={SHOPSDINE} />
              <FooterColumn compact title="Facilities & Services" items={FACILITIES} />
              <FooterColumn compact title="Guide" items={GUIDE} />
            </div>

            {/* Desktop / web view */}
            <div className="hidden xl:flex items-stretch justify-start">
              <FooterColumn title="Flights" items={FLIGHTS} padLeft={false} grow={false} />
              <VDivider tightLeft />
              <FooterColumn title="Parking & Transport" items={PARKING} />
              <VDivider tighter />
              <FooterColumn title="Shops & Dine" items={SHOPSDINE} />
              <VDivider tighter />
              <FooterColumn title="Facilities & Services" items={FACILITIES} />
              <VDivider tighter />
              <FooterColumn title="Guide" items={GUIDE} />
            </div>
          </div>
        </div>

        {/* ===== Bottom bar ===== */}
        <div className="mt-8 xl:mt-10 flex flex-col xl:flex-row items-center justify-between gap-3">
          <p className="text-[11px] sm:text-[12px] md:text-[12.5px] leading-[17px] sm:leading-[18px]">
            {props.fields.WebsiteUpdate?.value}
          </p>
          <p className="text-[11px] sm:text-[12px] md:text-[12.5px] leading-[17px] flex items-center gap-2">
            <span>{props.fields.CopyrightText?.value}</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

function FooterColumn({
  title,
  items,
  compact = false,
  padLeft = true,
  grow = true,
}: {
  title: string;
  items: { text: string; href: string }[];
  compact?: boolean;
  padLeft?: boolean;
  grow?: boolean;
}) {
  if (compact) {
    return (
      <div className="min-w-0">
        <h4 className="text-[12px] sm:text-[13px] font-semibold [color:var(--kfia-brand)] mb-1.5 whitespace-nowrap">
          {title}
        </h4>
        <div className="h-px w-full bg-[#E5E7EB] mb-2" />
        <ul className="space-y-[5px] text-[11px] sm:text-[12.5px] leading-[18px]">
          {items.map((it) => (
            <li key={it.text}>
              <Link href={it.href} className="hover:[color:var(--kfia-brand)] transition-colors">
                {it.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div
      className={`relative ${grow ? "flex-1" : "flex-none"} ${
        padLeft ? "pl-3" : "pl-0"
      } min-w-[115px]`}
    >
      <h4 className="text-[12.5px] md:text-[13px] xl:text-[14px] font-semibold [color:var(--kfia-brand)] mb-2 whitespace-nowrap">
        {title}
      </h4>
      <ul className="space-y-[6px] xl:space-y-[7px] text-[11.5px] md:text-[12.5px] xl:text-[13px] leading-[19px] xl:leading-[20px]">
        {items.map((it) => (
          <li key={it.text}>
            <Link
              href={it.href}
              className="hover:[color:var(--kfia-brand)] transition-colors whitespace-nowrap"
            >
              {it.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ========= Divider ========= */
function VDivider({
  tightLeft = false,
  tighter = false,
}: {
  tightLeft?: boolean;
  tighter?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={`self-stretch w-px bg-[#D1D5DB] ${
        tightLeft ? "ml-0.5 mr-4" : tighter ? "mx-4" : "mx-5"
      }`}
    />
  );
}
