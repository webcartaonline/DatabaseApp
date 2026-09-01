import { uid } from "./id.js";
import { DEFAULT_STATUSES, typeOf } from "../constants/fieldTypes.js";

/** Crea un campo vacio del tipo indicado. */
export function createField(typeId, label, options) {
  const type = typeOf(typeId);
  const field = {
    id: uid(),
    type: type.id,
    label: label || type.label,
    value: type.empty,
  };

  if (type.id === "status") {
    field.options = options && options.length ? options : DEFAULT_STATUSES;
  }

  return field;
}

/** Un negocio nuevo nace con direccion y estado; el resto se anade a mano. */
export function createLead(name, address) {
  return {
    id: uid(),
    name: name.trim(),
    createdAt: Date.now(),
    fields: [
      { ...createField("address", "Direccion"), value: address.trim() },
      { ...createField("status", "Estado"), value: "Nuevo" },
    ],
  };
}

/** Indica si un campo tiene un valor real, segun su tipo. */
export function isFilled(field) {
  if (field.type === "checkbox") return field.value === true;
  if (field.type === "rating") return Number(field.value) > 0;
  return String(field.value || "").trim().length > 0;
}

/** Primer campo relleno de un tipo concreto; se usa en la tarjeta del listado. */
export const findField = (lead, typeId) =>
  lead.fields.find((field) => field.type === typeId && isFilled(field));

/** Texto sobre el que busca el buscador. */
export const searchIndex = (lead) =>
  [lead.name, ...lead.fields.map((field) => `${field.label} ${field.value}`)]
    .join(" ")
    .toLowerCase();
