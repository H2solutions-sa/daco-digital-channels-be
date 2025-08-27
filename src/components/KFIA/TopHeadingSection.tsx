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
       <div className="text-center mb-8 md:mb-12">
          <h2 className="font-semibold text-slate-900 tracking-tight text-4xl md:text-6xl">
            {props.fields.Title?.value}
          </h2>
          {props.fields.Description?.value && 
          (<p className="mt-2 text-slate-600 max-w-3xl mx-auto">
            {props.fields.Description?.value}
          </p>)
          }
        </div>
  );
};
