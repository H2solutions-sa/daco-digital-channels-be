import { JSX } from 'react';
import { ComponentProps } from 'lib/component-props';
import { RichText, Field,Text,ComponentParams, ComponentRendering, Placeholder  } from '@sitecore-jss/sitecore-jss-nextjs';

type ContentRenderingProps = ComponentProps & {
fields:{
      Title:Field<string>,
      Content: Field<string>
rendering: ComponentRendering & { params: ComponentParams };
}
}

export const Default = (props: ContentRenderingProps): JSX.Element => {
  return (
     <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {props.fields.Title?.value &&(
        <div className="px-4 sm:px-5 md:px-7 py-4 border-b border-slate-200">
            <h2 className="text-[18px] md:text-[20px] font-semibold text-[color:var(--kfia-brand)]">
              <Text field={props.fields.Title} />
            </h2>
          </div> )}
      <div className="px-4 sm:px-5 md:px-7 py-5 sm:py-6 md:py-7">
        <RichText field={props.fields.Content}/>
        <Placeholder name="jss-component-in-richtext" rendering={props.rendering} />
        </div>
    </section>
  );
};
