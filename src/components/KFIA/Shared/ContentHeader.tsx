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
  <section id={pageName} className="kfia-content kfia-section py-8 sm:py-12 scroll-mt-[96px]">
      {/* Heading */}
    <div className="text-center px-4">
    <div className="relative w-full">
      {/* No top spacing at all */}
      <div className="max-w-[1100px] mx-auto px-4 pt-0 pb-0 text-center">
        <h1 className="kfia-headline text-[28px] sm:text-[44px] leading-tight font-semibold">
          {props.fields.Title?.value}
        </h1>
        <p className="kfia-subtitle mt-2 text-sm sm:text-base">
          {props.fields.Description?.value}
        </p>
      </div>
    </div>
    </div>
    
  </section>
  );
};
