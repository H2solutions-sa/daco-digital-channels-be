import { Field } from '@sitecore-jss/sitecore-jss-nextjs';
import { RichText } from '@sitecore-jss/sitecore-jss-react';
import { ComponentProps } from 'lib/component-props';
import { useId,useState } from 'react';
import { ChevronDown } from "lucide-react";
import { JSX } from 'react';

type AccordionProps = ComponentProps & {
fields:{
 items: AccordionItemProps[]
},
 controlledOpenIndex?: number; // which index is open (for controlled mode)
  onToggle?: (openIndex: number | null) => void;
}
type AccordionItemProps = ComponentProps & {
fields:{
  Title:Field<string>,
  AccordionContent: Field<string>
}
}

export const Default = (props: AccordionProps): JSX.Element => {
   const internalId = useId();

  const [uncontrolledOpenIndex, setUncontrolledOpenIndex] = useState<number | null>(null);

  // resolve controlled vs uncontrolled
  const openIndex = props.controlledOpenIndex ?? uncontrolledOpenIndex;

  const setOpenIndex = (index: number) => {
    const newIndex = openIndex === index ? null : index; // close if same one clicked
    if (props.controlledOpenIndex === undefined) {
      setUncontrolledOpenIndex(newIndex);
    }
    props.onToggle?.(newIndex);
  };
const AccordionList = props.fields.items 
&& props.fields.items.map((accordion,index) => {
  const isOpen = openIndex === index;

  return(
      <div className={`border border-slate-200 rounded-lg bg-white`}>
      {/* Header */}
      <button key={index}
        type="button"
        aria-expanded={isOpen}
        aria-controls={`acc-panel-${internalId}`}
         onClick={() => setOpenIndex(index)}
        className="
          w-full text-left
          grid grid-cols-[auto_1fr_auto] items-center gap-x-2 sm:gap-x-2.5
          px-4 py-3 sm:px-5 sm:py-4 md:px-6 md:py-4
        "
      >
        {/* fixed bullet column: never wraps */}
        <span
          aria-hidden
          className="rounded-full bg-[#4D9CD3]
                     w-[6px] h-[6px] sm:w-[7px] sm:h-[7px] md:w-[8px] md:h-[8px]"
        />

        {/* title column: can wrap freely */}
        <span className="font-semibold text-slate-900 leading-snug
                         text-[15px] sm:text-[16px] md:text-[17px]">
          {accordion.fields.Title?.value}
        </span>

        {/* chevron column */}
        <ChevronDown
          className={`text-slate-500 transition-transform
                      w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-5 md:h-5
                      ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Panel */}
      {isOpen && (
        <div
          id={`acc-panel-${internalId}`}
          className="pt-1 pb-4 px-4 sm:px-5 md:px-6
                     text-[14px] md:text-[15px] leading-7 text-slate-700"
        >
          <RichText field={accordion.fields?.AccordionContent}/>
        </div>
      )}
    </div>
  )
});

  return (
    <div className={`mt-5 sm:mt-6 space-y-3`}>
      {AccordionList}
    </div>
  );
};
