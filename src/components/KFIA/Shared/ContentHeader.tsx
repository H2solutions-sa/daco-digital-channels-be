import { Field, useSitecoreContext  } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import { JSX } from 'react';

type ContentHeaderProps = ComponentProps & {
  fields:{
    Title:Field<string>,
    Description:Field<string>
  }
}

export const Default = (props: ContentHeaderProps): JSX.Element => {
  const context = useSitecoreContext();
  const pageName = context.sitecoreContext.route?.displayName?.replaceAll(" ", "");
  return (
  <section id={pageName} className="pt-4">
      {/* Heading */}
    <div className="text-center px-4">
    <div className="relative w-full">
      {/* No top spacing at all */}
      <div className="max-w-[1100px] mx-auto px-4 pt-0 pb-0 text-center">
        <h2 className=" text-center font-semibold text-brand leading-tight sm:leading-snug text-[24px] sm:text-[32px] md:text-[40px] lg:text-[length:var(--heading2-size)] ">
          {props.fields.Title?.value}
        </h2>
        <p className=" kfia-subtitle mt-2 leading-relaxed max-w-3xl mx-auto text-[13px] sm:text-[14px] md:text-[15px] lg:text-[length:var(--paragraph1-size)] ">
          {props.fields.Description?.value}
        </p>
      </div>
    </div>
    </div>
  </section>
  );
};
