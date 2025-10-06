import { JSX } from 'react';
import { MapPin } from "lucide-react";
import { ComponentProps } from 'lib/component-props';
import { Field } from '@sitecore-jss/sitecore-jss-nextjs';

type AboutKSAProps = ComponentProps & {
  fields:{
    Title:Field<string>,
    FirstBullet:Field<string>,
    SecondBullet:Field<string>,
    ThirdBullet:Field<string>,
  }
}

export const Default = (props: AboutKSAProps): JSX.Element => {
const Bullet: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex items-start gap-3 sm:gap-3.5">
    <MapPin className="mt-1 shrink-0 w-[18px] h-[18px] text-[color:var(--kfia-brand)]" />
    <span className="leading-relaxed">{children}</span>
  </li>
);

  return (
  <section
      className={`bg-white border border-neutral-200 rounded-2xl p-5 sm:p-7 lg:p-8 shadow-smrounded-2xl bg-[#F4F2FA] border border-[#E8E4F6] p-5 sm:p-7 md:p-8
                     md:min-h-[410px] lg:min-h-[430px]`}
    >
      {/* Title with KFIA brand color */}
      <h2 className="text-xl sm:text-2xl font-semibold text-[color:var(--kfia-brand)] mb-3">
        {props.fields.Title?.value}
      </h2>

      {/* Content */}
      <div className="text-[15px] sm:text-[16px] leading-7 text-neutral-800">
         <ul className="space-y-5 sm:space-y-6 text-[14.5px] sm:text-[15.5px]">
            <Bullet>
              {props.fields.FirstBullet?.value}
            </Bullet>
            <Bullet>
              {props.fields.SecondBullet?.value}
            </Bullet>
            <Bullet>
              {props.fields.ThirdBullet?.value}
            </Bullet>
          </ul>
      </div>
    </section>
  );
};
