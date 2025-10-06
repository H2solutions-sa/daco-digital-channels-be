import { JSX } from 'react';
import { ImageField } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';

type AboutKSAImageProps = ComponentProps & {
 fields:{
  Image:ImageField
 }
}

export const Default = (props: AboutKSAImageProps): JSX.Element => {

  return (
     <div className="rounded-2xl overflow-hidden bg-neutral-200 h-56 sm:h-64 md:h-[410px] lg:h-[430px]">
          <img
            src={props.fields.Image.value?.src}
            alt="Saudi heritage site"
            className="w-full h-full object-cover"
          />
        </div>
  );
};
