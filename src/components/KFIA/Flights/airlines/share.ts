import type { Airline } from "./types";

export function shareAirline(a: Airline) {
  const title = a.fields.name.value;
  const text = `${a.fields.name.value}\n` +
    (a.fields.website?.value.text ? `Website: ${a.fields.website?.value.href}\n` : "") +
    (a.fields.phone?.value ? `Phone: ${a.fields.phone?.value}\n` : "") +
    (a.fields.email?.value ? `Email: ${a.fields.email?.value}\n` : "");
  const url = a.fields.website?.value?.href || (typeof window !== "undefined" ? window.location.href : "");

  if (typeof navigator !== "undefined" && (navigator as any).share) {
    (navigator as any).share({ title, text, url }).catch(() => {});
  } else if (typeof navigator !== "undefined" && navigator.clipboard) {
    navigator.clipboard.writeText(`${title}\n${text}${url}`).then(
      () => alert("Airline details copied to clipboard"),
      () => url && window.open(url, "_blank", "noopener,noreferrer")
    );
  } else if (url) {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}