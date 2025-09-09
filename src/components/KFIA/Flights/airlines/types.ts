import { Field, ImageField } from "@sitecore-jss/sitecore-jss-nextjs";
type Link = {
  href: string;
  text: string;
};
export type Airline = {
   fields: {
     name: Field<string>;
     logo: ImageField;
     website?: Field<Link>;
     phone?: Field<string>;
     email?: Field<string>;
   };
};