import { JSX } from 'react';
import { ComponentProps } from 'lib/component-props';
import {  Field } from '@sitecore-jss/sitecore-jss-nextjs';

type TopHeadingSectionProps =  ComponentProps & {
fields:{
  Title:Field<string>,
  Description:Field<string>
}
}

export const Default = (props: TopHeadingSectionProps): JSX.Element => {

  return (
       <div className="text-center mb-10 md:mb-12">
          <h2 className="font-semibold tracking-tight break-words text-[28px] sm:text-[36px] md:text-[length:var(--heading2-size)] text-[color:var(--kfia-lavender)]">
            {props.fields.Title?.value}
          </h2>
          {props.fields.Description?.value && 
          (<p className="mt-2 max-w-3xl mx-auto text-sm sm:text-base text-[color:var(--kfia-subtitle)]">
            {props.fields.Description?.value}
          </p>)
          }
        </div>
  );
};
