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
        <h2 className="text-[22px] sm:text-[24px] md:text-[28px] font-semibold text-[color:var(--kfia-brand)]">
          {props.fields.Title?.value}
        </h2>
        <p className="mt-2 max-w-3xl mx-auto text-[color:var(--kfia-subtitle)]">
          {props.fields.Description?.value}
        </p>
      </div>
    </div>
    </div>
  </section>
  );
};
