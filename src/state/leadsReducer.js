/** Toda la mutacion de datos vive aqui: una sola fuente de verdad. */

export const initialLeadsState = { leads: [] };

const withLead = (state, id, update) => ({
  leads: state.leads.map((lead) => (lead.id === id ? update(lead) : lead)),
});

export function leadsReducer(state, action) {
  switch (action.type) {
    case "hydrate":
      return { leads: action.leads };

    case "addLead":
      return { leads: [action.lead, ...state.leads] };

    case "deleteLead":
      return { leads: state.leads.filter((lead) => lead.id !== action.id) };

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

    default:
      return state;
  }
}
