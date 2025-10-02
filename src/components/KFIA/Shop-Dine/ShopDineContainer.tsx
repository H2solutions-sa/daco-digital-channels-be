import { JSX } from 'react';
import { ComponentParams, ComponentRendering, Placeholder } from '@sitecore-jss/sitecore-jss-nextjs';

interface ShopDineContainerProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
}

export const Default = (props: ShopDineContainerProps): JSX.Element => {
  return (
    <div className="mx-auto my-6 max-w-[1200px] px-4 md:px-6">
    <section className="kfia-content rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5 md:p-6">
      <Placeholder name="jss-shop-dine-container" rendering={props.rendering} />
    </section>
    </div>
  );
};
