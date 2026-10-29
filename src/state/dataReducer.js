import { mergeData } from "../lib/sync.js";

/** Toda la mutacion de datos vive aqui: una sola fuente de verdad. */

export const initialDataState = { leads: [], categories: [] };

/** Sella la fecha de modificacion: es lo que decide quien gana al sincronizar. */
const stamp = (record) => ({ ...record, updatedAt: Date.now() });

/** Aplica un cambio a un negocio. */
const withLead = (state, id, update) => ({
  ...state,
  leads: state.leads.map((lead) => (lead.id === id ? stamp(update(lead)) : lead)),
});

/** Sustituye el registro con el mismo id o lo anade al final. */
const upsert = (list, record) =>
  list.some((item) => item.id === record.id)
    ? list.map((item) => (item.id === record.id ? record : item))
    : [...list, record];

export function dataReducer(state, action) {
  switch (action.type) {
    case "hydrate":
      return mergeData(initialDataState, action.data);

    // Fusiona lo que llega del servidor con lo que ya hay en memoria.
    case "merge":
      return mergeData(state, action.data);

    case "addLead":
      return { ...state, leads: [action.lead, ...state.leads] };

    // Lapida en vez de borrado real: asi el borrado tambien viaja a los
    // demas dispositivos cuando se sincroniza.
    case "deleteLead":
      return withLead(state, action.id, (lead) => ({
        id: lead.id,
        createdAt: lead.createdAt,
        deletedAt: Date.now(),
      }));

    case "moveLead":
      return withLead(state, action.id, (lead) => ({ ...lead, categoryId: action.categoryId }));

    case "renameLead":
      return withLead(state, action.id, (lead) => ({ ...lead, name: action.name }));

    case "addField":
      return withLead(state, action.id, (lead) => ({
        ...lead,
        fields: [...lead.fields, action.field],
      }));

    case "patchField":
      return withLead(state, action.id, (lead) => ({
        ...lead,
        fields: lead.fields.map((field) =>
          field.id === action.fieldId ? { ...field, ...action.patch } : field
        ),
      }));

    case "deleteField":
      return withLead(state, action.id, (lead) => ({
        ...lead,
        fields: lead.fields.filter((field) => field.id !== action.fieldId),
      }));

    case "moveField":
      return withLead(state, action.id, (lead) => {
        const from = lead.fields.findIndex((field) => field.id === action.fieldId);
        const to = from + action.offset;
        if (from < 0 || to < 0 || to >= lead.fields.length) return lead;

        const fields = [...lead.fields];
        const [moved] = fields.splice(from, 1);
        fields.splice(to, 0, moved);
        return { ...lead, fields };
      });

    // Crear y editar categorias es la misma operacion: guardar por id.
    case "saveCategory":
      return { ...state, categories: upsert(state.categories, stamp(action.category)) };

    default:
      return state;
  }
}
