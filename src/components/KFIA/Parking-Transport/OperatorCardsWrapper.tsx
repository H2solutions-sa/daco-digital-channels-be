import { JSX } from 'react';
import { ComponentProps } from 'lib/component-props';
import { Field,Placeholder } from '@sitecore-jss/sitecore-jss-nextjs';

type OperatorCardsWrapperProps = ComponentProps & {
  fields:{
    Title:Field<string>
  }
}

export const Default = (props: OperatorCardsWrapperProps): JSX.Element => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 md:px-7 py-4 border-b border-slate-200">
          <h3 className="text-[16px] md:text-[17px] font-semibold text-[color:var(--kfia-brand)]">
            {props.fields.Title.value}
          </h3>
        </div>
        <Placeholder name="jss-cards-space" rendering={props.rendering}/>
    </section>
  );
};
