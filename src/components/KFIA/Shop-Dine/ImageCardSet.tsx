import { JSX } from 'react';
import { ComponentProps } from 'lib/component-props';
import { ImageField } from '@sitecore-jss/sitecore-jss-nextjs';
import Image from 'next/image';
type ImageCardSetProps = ComponentProps & {
  fields:{
    items:ImageCardProps[]
  }
}

type ImageCardProps = ComponentProps & {
  fields:{
    CardImage:ImageField
  }
}

export const Default = (props: ImageCardSetProps): JSX.Element => {
  return (
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {props.fields.items && props.fields.items.map((b,i) => (
            <div
              key={i}
              className="rounded-xl border border-[oklch(0.90_0_0)]/45 bg-[oklch(0.98_0_0)] p-6 flex items-center justify-center"
            >
              {b.fields.CardImage.value?.src && 
              <Image
                src={b.fields.CardImage.value?.src}
                alt={`brand logo`}
                width={240}
                height={100}
                className="h-auto w-auto object-contain"
                style={{ maxHeight: 72, maxWidth: 220 }}
              />
              }
            </div>
          ))}
        </div>
  );
};
