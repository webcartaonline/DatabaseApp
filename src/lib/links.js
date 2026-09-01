/** Construccion de enlaces para los campos que se pueden abrir. */

export function normalizeUrl(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  return /^https?:\/\//i.test(text) ? text : `https://${text}`;
}

export function mapsUrl(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (/^https?:\/\//i.test(text)) return text;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(text)}`;
}

export function hrefFor(type, value) {
  const text = String(value || "").trim();
  if (!text) return "";

  switch (type) {
    case "phone":
      return `tel:${text.replace(/[\s()-]/g, "")}`;
    case "email":
      return `mailto:${text}`;
    case "address":
      return mapsUrl(text);
    default:
      return normalizeUrl(text);
  }
}
