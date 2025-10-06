import { JSX } from 'react';

export const Default = (): JSX.Element => {
  return (
          <div className="rounded-2xl overflow-hidden shadow-sm border border-neutral-200">
            <iframe
              title="KFIA Location Map"
              className="w-full h-[280px] sm:h-[320px] md:h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28509.349062911153!2d49.7705!3d26.4416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e49ee3a8a3c5a9b%3A0x6e1b7c76a2b1b9a1!2sKing%20Fahd%20International%20Airport!5e0!3m2!1sen!2ssa!4v1690000000000"
            />
          </div>
  );
};
