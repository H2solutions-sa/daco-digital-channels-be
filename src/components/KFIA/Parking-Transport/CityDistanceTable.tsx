import { JSX } from 'react';
import { ComponentProps } from 'lib/component-props';
import { Clock3 } from "lucide-react";
import { Field } from '@sitecore-jss/sitecore-jss-nextjs';
type CityDistanceTableProps = ComponentProps & {
  fields:{
  items: CityRow[]
  }
}
type CityRow = ComponentProps & {
  fields:{
   City:Field<string>,
   Distance:Field<string>,
   Time:Field<string>
 }
}

export const Default = (props: CityDistanceTableProps): JSX.Element => {

  return (
     <ul className="mt-3 divide-y divide-slate-200 border-y border-slate-200">
              {props.fields.items.map((row) => (
                <li key={row.fields.City.value} className="py-3 md:py-3.5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      {/* DOT: light blue */}
                      <span className="h-1.5 w-1.5 rounded-full bg-[#4D9CD3]" />
                      <span className="text-[14px] md:text-[15px] font-medium text-slate-900 tracking-wide">
                        {row.fields.City.value}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-[13px] md:text-[14px] text-slate-700">{row.fields.Distance.value}</div>
                      <div className="mt-1 inline-flex items-center gap-1 text-[12px] md:text-[13px] text-slate-500">
                        <Clock3 className="h-[14px] w-[14px]" />
                        {row.fields.Time.value}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
  );
};
