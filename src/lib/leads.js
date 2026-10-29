import { uid } from "./id.js";
import {
  DEFAULT_STATUSES,
  LEGACY_MENU_LABEL,
  PENDING_CONTACT_STATUSES,
  typeOf,
} from "../constants/fieldTypes.js";

/** El valor vacio se copia: los tipos con objeto no deben compartir referencia. */
const emptyValue = (type) =>
  type.empty && typeof type.empty === "object" ? { ...type.empty } : type.empty;

/**
 * El Activador guarda { on, kind }: el interruptor dice si esta activo y kind
 * la opcion elegida en la lista. Tolera valores sueltos de versiones antiguas.
 */
export function menuValue(value) {
  if (value && typeof value === "object") {
    return { on: value.on === true, kind: value.kind || "" };
  }
  return { on: value === true, kind: "" };
}

/** Pagina web guarda { on, url }: si el negocio tiene web y cual es. */
export function websiteValue(value) {
  if (value && typeof value === "object") {
    return { on: value.on === true, url: value.url || "" };
  }
  return { on: false, url: "" };
}

/**
 * Nombre visible de un campo. El antiguo "Carta en Maps" se muestra como
 * Activador sin reescribir los datos guardados (asi no se fuerza una subida).
 */
export const fieldLabel = (field) =>
  field.type === "menu" && field.label === LEGACY_MENU_LABEL ? typeOf("menu").label : field.label;

/** Crea un campo vacio del tipo indicado. */
export function createField(typeId, label, options) {
  const type = typeOf(typeId);
  const field = {
    id: uid(),
    type: type.id,
    label: label || type.label,
    value: emptyValue(type),
  };

  if (type.id === "status") {
    field.options = options && options.length ? options : DEFAULT_STATUSES;
  } else if (type.options) {
    field.options = options && options.length ? options : type.options;
  }

  return field;
}

/**
 * Un negocio nuevo nace dentro de una categoria solo con direccion y estado;
 * el resto de campos se anaden a mano cuando hacen falta.
 */
export function createLead(name, address, categoryId) {
  const now = Date.now();
  return {
    id: uid(),
    categoryId,
    name: name.trim(),
    createdAt: now,
    updatedAt: now,
    fields: [
      { ...createField("address"), value: address.trim() },
      { ...createField("status"), value: "Nuevo" },
    ],
  };
}

/** Indica si un campo tiene un valor real, segun su tipo. */
export function isFilled(field) {
  if (field.type === "checkbox") return field.value === true;
  if (field.type === "menu") return menuValue(field.value).on;
  if (field.type === "website") return websiteValue(field.value).on;
  if (field.type === "rating") return Number(field.value) > 0;
  return String(field.value || "").trim().length > 0;
}

/** Texto legible del valor de un campo; no todos los valores son cadenas. */
export function fieldText(field) {
  if (field.type === "menu") {
    const { on, kind } = menuValue(field.value);
    return on ? `si ${kind}` : "no";
  }
  if (field.type === "website") {
    const { on, url } = websiteValue(field.value);
    return on ? `si ${url}` : "no";
  }
  return String(field.value || "");
}

/** Primer campo relleno de un tipo concreto; se usa en la tarjeta del listado. */
export const findField = (lead, typeId) =>
  lead.fields.find((field) => field.type === typeId && isFilled(field));

/** Un negocio esta pendiente si su estado aun pide contactarlo. */
export const isPending = (lead) =>
  lead.fields.some(
    (field) => field.type === "status" && PENDING_CONTACT_STATUSES.includes(field.value)
  );

/** Texto sobre el que busca el buscador. */
export const searchIndex = (lead) =>
  [lead.name, ...lead.fields.map((field) => `${fieldLabel(field)} ${fieldText(field)}`)]
    .join(" ")
    .toLowerCase();
