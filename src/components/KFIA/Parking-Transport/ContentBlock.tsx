import { JSX } from 'react';
import { ComponentProps } from 'lib/component-props';
import { RichText, Field,Text } from '@sitecore-jss/sitecore-jss-nextjs';

type ContentRenderingProps = ComponentProps & {
fields:{
      Title:Field<string>,
      Content: Field<string>
}
}

export const Default = ({ fields }: ContentRenderingProps): JSX.Element => {
  return (
     <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {fields.Title?.value &&(
        <div className="px-4 sm:px-5 md:px-7 py-4 border-b border-slate-200">
            <h2 className="text-[18px] md:text-[20px] font-semibold text-[color:var(--kfia-brand)]">
              <Text field={fields.Title} />
            </h2>
          </div> )}
      <div className="px-4 sm:px-5 md:px-7 py-5 sm:py-6 md:py-7">
        <RichText field={fields.Content}/>
        </div>
    </section>
  );
};
