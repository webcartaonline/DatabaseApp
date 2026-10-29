import { uid } from "./id.js";
import { isPending } from "./leads.js";
import { mergeRecords } from "./sync.js";

/**
 * Categoria fija con id conocido: existe en todos los dispositivos sin tener
 * que sincronizarla y recoge los negocios guardados antes de las categorias.
 * Si se edita, la version editada (updatedAt mayor) gana en la fusion.
 */
export const DEFAULT_CATEGORY = Object.freeze({
  id: "general",
  name: "General",
  description: "Negocios de cualquier tipo. Aquí están los que guardaste antes de crear categorías.",
  createdAt: 0,
  updatedAt: 0,
});

const cleanValues = ({ name, description }) => ({
  name: name.trim(),
  description: description.trim(),
});

export function createCategory(values) {
  const now = Date.now();
  return { id: uid(), ...cleanValues(values), createdAt: now, updatedAt: now };
}

export const editCategory = (category, values) => ({ ...category, ...cleanValues(values) });

/** Todas las categorias, con la fija siempre presente y en orden de creacion. */
export const withDefaultCategory = (categories) =>
  mergeRecords([DEFAULT_CATEGORY], categories).sort((a, b) => a.createdAt - b.createdAt);

/** Los negocios sin categoria (anteriores a esta funcion) van a la fija. */
export const categoryIdOf = (lead) => lead.categoryId || DEFAULT_CATEGORY.id;

export const leadsInCategory = (leads, categoryId) =>
  leads.filter((lead) => categoryIdOf(lead) === categoryId);

/** Evita dos categorias con el mismo nombre (sin distinguir mayusculas). */
export const isNameTaken = (categories, name, exceptId) => {
  const wanted = name.trim().toLowerCase();
  return categories.some(
    (category) => category.id !== exceptId && category.name.trim().toLowerCase() === wanted
  );
};

/** Negocios por contactar agrupados por categoria. */
export const pendingByCategory = (leads, categories) =>
  categories.map((category) => ({
    category,
    leads: leadsInCategory(leads, category.id).filter(isPending),
  }));
