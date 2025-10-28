import { Field, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import { JSX } from 'react';
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

type Link ={
href:string,
text:string    
}
type DirectionsMapProps = ComponentProps & {
fields:{
  MapImage:ImageField,
  MapLink:Field<Link>
}
}

export const Default = (props: DirectionsMapProps): JSX.Element => {

  return (
     <div className="">
          <div className="relative w-full overflow-hidden rounded-xl border border-slate-200">
            {props.fields.MapImage?.value?.src && 
            <Image
              src={props.fields.MapImage?.value?.src}
              alt="KFIA Map"
              width={800}
              height={600}
              className="w-full h-auto object-cover"
              priority
            />
            }
          </div>

          <div className="mt-6">
            <Link
              href={props.fields.MapLink?.value?.href}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-lg bg-[#4D9CD3] px-4 md:px-5 py-2.5 text-white hover:opacity-90 text-[13px] md:text-[14px] font-medium"
            >
              <ExternalLink className="h-[16px] w-[16px]" />
              {props.fields.MapLink?.value?.text}
            </Link>
          </div>
        </div>
  );
};
