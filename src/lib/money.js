/** Importes en euros con formato espanol: "1250,5" -> "1250,50 €". */

const CURRENCY = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });
const THOUSANDS_ONLY = /^-?\d{1,3}(\.\d{3})+$/;

/**
 * Convierte lo que se escribe a numero. Acepta "150", "150,5", "1.250,50",
 * "1250.50" o "150 €". Devuelve null si no hay un numero claro.
 */
export function parseAmount(value) {
  const text = String(value ?? "").replace(/[^\d.,-]/g, "");
  if (!/\d/.test(text)) return null;

  let normalized;
  if (text.includes(",")) {
    normalized = text.replace(/\./g, "").replace(",", ".");
  } else if (THOUSANDS_ONLY.test(text)) {
    normalized = text.replace(/\./g, "");
  } else {
    normalized = text;
  }

  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : null;
}

/** Texto final del importe, con el simbolo del euro. Si no es un numero, se deja tal cual. */
export function formatAmount(value) {
  const text = String(value ?? "").trim();
  if (!text) return "";
  const amount = parseAmount(text);
  return amount === null ? text : CURRENCY.format(amount);
}

/** Version para editar: el numero sin el simbolo, "1250,50 €" -> "1250,50". */
export const editableAmount = (value) => String(value ?? "").replace(/\s*€\s*$/, "").trim();
