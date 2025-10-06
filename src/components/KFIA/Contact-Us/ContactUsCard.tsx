import { JSX } from 'react';
import { Field } from '@sitecore-jss/sitecore-jss-nextjs';
import {Phone,Mail,Briefcase,} from "lucide-react"
import { ComponentProps } from 'lib/component-props';
import { useI18n } from 'next-localization';
type ContactUsCardProps = ComponentProps & {
  fields:{
    Title:Field<string>,
    Address:Field<string>,
    Phone:Field<string>,
    GeneralEmail:Field<string>,
    CommertialEmail:Field<string>
  }
}
function ContactRow({
  icon,
  title,
  line,
}: {
  icon: React.ReactNode;
  title: string;
  line: string;
}) {
  return (
    <li className="flex items-center gap-3 sm:gap-4 bg-[#F9FAFB] rounded-xl border border-neutral-200 p-3.5 sm:p-4 shadow-sm">
      <span className="text-[color:var(--kfia-brand)]">{icon}</span>
      <div className="min-w-0">
        <p className="text-[15px] sm:text-[16px] font-semibold text-[color:var(--kfia-brand)]">
          {title}
        </p>
        <p className="text-[14px] sm:text-[15px] text-neutral-800 truncate">{line}</p>
      </div>
    </li>
  );
}
export const Default = (props: ContactUsCardProps): JSX.Element => {
 const {t} = useI18n();
  return (
    <section className="rounded-2xl bg-white border border-neutral-200 p-5 sm:p-6 shadow-sm">
            <div className="flex items-start gap-2 sm:gap-3 mb-3">
              <div className="min-w-0">
                <h3 className="text-[18px] sm:text-[20px] font-semibold text-[color:var(--kfia-brand)]">
                  {props.fields.Title?.value}
                </h3>
                <p className="mt-1 text-[14px] sm:text-[15px] leading-relaxed text-neutral-800">
                  {props.fields.Address?.value}
                </p>
              </div>
            </div>

            <ul className="mt-3 space-y-3">
              <ContactRow icon={<Phone className="w-[18px] h-[18px]" />} title={t("Passenger Relations")} line={props.fields.Phone?.value} />
              <ContactRow icon={<Mail className="w-[18px] h-[18px]" />} title={t("General Inquiries")} line={props.fields.GeneralEmail?.value} />
              <ContactRow icon={<Briefcase className="w-[18px] h-[18px]" />} title={t("Investment-label")} line={props.fields.CommertialEmail?.value} />
            </ul>
          </section>
  );
};
