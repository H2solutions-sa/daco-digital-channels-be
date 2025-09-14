import { JSX } from 'react';
import { useI18n } from 'next-localization'; 
import { ComponentProps } from 'lib/component-props';
import { Field } from '@sitecore-jss/sitecore-jss-nextjs';
type FaresTableProps = ComponentProps & {
  fields:{
    items:Fares[]
  }
}
type Fares ={
  fields:{
    Time:Field<string>,
    Destination:Field<string>,
    Price:Field<string>
  }
}

export const Default = (props: FaresTableProps): JSX.Element => {
const {t} = useI18n();
const FaresList = props.fields.items && props.fields.items.map((fare,index) => (
  <tr key={index} className="odd:bg-white even:bg-slate-50/60">
                    <td className="px-4 md:px-5 py-3">{fare.fields.Destination?.value}</td>
                    <td className="px-4 md:px-5 py-3">{fare.fields.Time?.value}</td>
                    <td className="px-4 md:px-5 py-3">{fare.fields.Price?.value}</td>
    </tr>
));
const FaresListMobile = props.fields.items && props.fields.items.map((fare,index) => (
 <li
                  key={index}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="text-[15px] font-semibold text-slate-900">
                    {fare.fields.Destination?.value}
                  </div>
                  <dl className="mt-2 grid grid-cols-2 gap-2 text-[13px] text-slate-700">
                    <div className="flex items-center gap-2">
                      <dt className="text-slate-500">Time:</dt>
                      <dd className="font-medium">{fare.fields.Time?.value}</dd>
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <dt className="text-slate-500">Price:</dt>
                      <dd className="font-semibold text-slate-900">{fare.fields.Price?.value}</dd>
                    </div>
                  </dl>
                </li>
));
  return (
        <div className="px-5 md:px-7 pb-6 md:pb-7">
          <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
            {/* Mobile: cards */}
            <ul className="grid gap-3 p-4 md:hidden">
              {FaresListMobile}
            </ul>

            {/* Desktop/tablet: table */}
            <table className="hidden md:table w-full text-left text-[14px] md:text-[15px]">
              <thead className="bg-slate-50 text-slate-700">
                <tr className="border-b border-slate-200">
                  <th className="px-4 md:px-5 py-3 font-semibold">{t("Bus-destination")}</th>
                  <th className="px-4 md:px-5 py-3 font-semibold">{t("Driving-time")}</th>
                  <th className="px-4 md:px-5 py-3 font-semibold">{t("Price")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {FaresList}
              </tbody>
            </table>
          </div>
        </div>
  );
};
