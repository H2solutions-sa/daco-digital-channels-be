import { JSX } from 'react';
import { User,IdCard,Smartphone,AtSign, Tag,ChevronDown,MessageSquareText} from "lucide-react";
import { useI18n } from 'next-localization';

function FieldLabel({
  children,
  hint,
  htmlFor,
}: {
  children: React.ReactNode;
  hint?: string;
  htmlFor?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-[13px] sm:text-[14px] font-medium text-neutral-700"
      >
        {children}
      </label>
      {hint ? (
        <span className="text-[11px] sm:text-[12px] text-neutral-500">{hint}</span>
      ) : null}
    </div>
  );
}

function InputWithIcon({
  id,
  type = "text",
  placeholder,
  icon,
}: {
  id: string;
  type?: string;
  placeholder: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--kfia-brand)] opacity-80">
        {icon}
      </span>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="h-11 sm:h-12 w-full rounded-lg border border-neutral-300 bg-white pl-9 pr-3.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-[color:var(--kfia-brand)]"
      />
    </div>
  );
}

function SelectWithIcon({
  id,
  defaultValue = "",
  children,
}: {
  id: string;
  defaultValue?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-[16px] w-[16px] text-[color:var(--kfia-brand)] opacity-80 pointer-events-none" />
      <select
        id={id}
        name={id}
        defaultValue={defaultValue}
        className="peer appearance-none w-full h-11 sm:h-12 rounded-lg border border-neutral-300 bg-white pl-9 pr-10 text-[14px] focus:outline-none focus:ring-2 focus:ring-[color:var(--kfia-brand)]"
      >
        <option value="">{""}</option>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-neutral-500 peer-focus:text-[color:var(--kfia-brand)]" />
    </div>
  );
}

function TextareaWithIcon({
  id,
  placeholder,
}: {
  id: string;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <MessageSquareText className="absolute left-3 top-3 h-[18px] w-[18px] text-[color:var(--kfia-brand)] opacity-80 pointer-events-none" />
      <textarea
        id={id}
        placeholder={placeholder}
        className="mt-0 h-36 sm:h-40 w-full rounded-lg border border-neutral-300 bg-white pl-10 pr-3.5 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[color:var(--kfia-brand)] resize-none"
      />
    </div>
  );
}

export const Default = (): JSX.Element => {
  const {t} = useI18n();
  return (
       <div className="max-w-[980px] mx-auto mt-2">
          <h1 className="text-center leading-tight text-[color:var(--kfia-brand)] mb-8 sm:mb-10 text-[30px] sm:text-[38px] md:text-[46px]">
           {t("Form-Title")}
          </h1>
          <p className="text-center text-neutral-600 text-[13.5px] sm:text-[14px] mt-2">
           {t("Form-Subtitle")}
          </p>

          <form
            className="mt-6 rounded-2xl bg-[#F4F2FA] border border-[#E8E4F6] shadow-sm p-5 sm:p-6 md:p-7"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="first">{t("form-first-Name")}</FieldLabel>
                <InputWithIcon id="first" placeholder={t("form-first-Name")} icon={<User className="h-[16px] w-[16px]" />} />
              </div>
              <div>
                <FieldLabel htmlFor="last">{t("form-last-name")}</FieldLabel>
                <InputWithIcon id="last" placeholder={t("form-last-name")} icon={<IdCard className="h-[16px] w-[16px]" />} />
              </div>
            </div>

            {/* Row 2 */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="phone">{t("form-contact-number")}</FieldLabel>
                <InputWithIcon id="phone" placeholder={t("form-contact-number")} icon={<Smartphone className="h-[16px] w-[16px]" />} />
              </div>
              <div>
                <FieldLabel htmlFor="email">{t("form-email-address")}</FieldLabel>
                <InputWithIcon id="email" type="email" placeholder={t("form-email-address")} icon={<AtSign className="h-[16px] w-[16px]" />} />
              </div>
            </div>

            {/* Subject (ONLY) */}
            <div className="mt-4">
              <FieldLabel htmlFor="subject" hint={t("pick-subject")}>
                {t("form-subject")}
              </FieldLabel>
              <SelectWithIcon id="subject" defaultValue="">
                <option value="lost-found">{t("lost-found")}</option>
                <option value="immigration">{t("immigration")}</option>
                <option value="help-desk">{t("help-desk")}</option>
                <option value="baggage-services">{t("baggage-services")}</option>
                <option value="security">{t("security")}</option>
                <option value="customs">{t("customs")}</option>
                <option value="airline">{t("airline")}</option>
                <option value="ground-transport">{t("ground-transport")}</option>
                <option value="parking">{t("parking")}</option>
                <option value="accessibility">{t("accessibility")}</option>
                <option value="flight-info">{t("flight-info")}</option>
                <option value="other">{t("other")}</option>
              </SelectWithIcon>
            </div>

            {/* Comments */}
            <div className="mt-4">
              <FieldLabel htmlFor="comments">{t("form-comments")}</FieldLabel>
              <TextareaWithIcon id="comments" placeholder={t("form-comments-placeholder")} />
            </div>

            {/* Submit */}
            <div className="mt-6 flex justify-center">
              <button
                type="submit"
                className="min-w-[170px] rounded-full bg-[color:var(--kfia-brand)] px-7 py-3 text-white font-semibold hover:opacity-90 transition shadow-sm"
              >
                {t("form-submit")}
              </button>
            </div>
          </form>
        </div>
  );
};
