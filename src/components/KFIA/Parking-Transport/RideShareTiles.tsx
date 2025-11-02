import { JSX } from 'react';
import { Field } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';

type RideShareTilesProps = ComponentProps & {
  fields:{
    items:TileProps[]
  }
}

type TileProps = ComponentProps & {
  fields:{
    Step:Field<String>,
    Title:Field<string>,
    Description:Field<string>
  }
}

export const Default = (props: RideShareTilesProps): JSX.Element => {
  const TileList = props.fields.items && props.fields.items.map((tile,i) =>(

      <article key ={i} className="relative rounded-2xl border border-[#E7EDF4] bg-white p-6 shadow-sm">
      {/* Step number */}
      <div
        className="text-[color:var(--kfia-secondary)] font-semibold tracking-tight leading-none"
        style={{ fontSize: "var(--heading4-size)" }}
      >
        {tile.fields.Step?.value}
      </div>

      {/* Title */}
      <h3
        className="mt-3 text-slate-900 font-semibold"
        style={{ fontSize: "var(--title-md-size)" }}
      >
        {tile.fields.Title?.value}
      </h3>

      <p className="mt-2 text-slate-700 leading-7" style={{ fontSize: "var(--paragraph1-size)" }}>
        {tile.fields.Description?.value}
      </p>
    </article>
  ))
  return (
   
        <div className="relative mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-7">
           {TileList}
          </div>
        </div>
  );
};
