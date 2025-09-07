import { JSX } from 'react';
import { ComponentParams, ComponentRendering, Placeholder } from '@sitecore-jss/sitecore-jss-nextjs';

interface TwoColumnContainerProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
}

export const Default = (props: TwoColumnContainerProps): JSX.Element => {

  return (
   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 -mt-6">
    <Placeholder name="jss-content-first-side" rendering={props.rendering} />
    <Placeholder name="jss-content-second-side" rendering={props.rendering} />
    </div>
  );
};
