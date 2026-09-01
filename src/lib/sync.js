/**
 * Fusion de dos listas de negocios. Es codigo puro y sin APIs del navegador
 * porque tambien lo usa la funcion de Vercel (api/leads.js).
 *
 * Regla: gana la version con updatedAt mas alto. Los borrados no desaparecen,
 * se marcan con deletedAt para que el borrado tambien viaje a los demas moviles.
 */
const DELETED_TTL = 1000 * 60 * 60 * 24 * 30;

const newest = (a, b) => {
  if (!a) return b;
  if (!b) return a;
  return (b.updatedAt || 0) > (a.updatedAt || 0) ? b : a;
};

export function mergeLeads(base, incoming) {
  const byId = new Map(base.map((lead) => [lead.id, lead]));
  incoming.forEach((lead) => byId.set(lead.id, newest(byId.get(lead.id), lead)));
  return [...byId.values()].sort((a, b) => b.createdAt - a.createdAt);
}

/** Descarta las lapidas antiguas para que la lista no crezca sin fin. */
export const pruneDeleted = (leads, now = Date.now()) =>
  leads.filter((lead) => !lead.deletedAt || now - lead.deletedAt < DELETED_TTL);

/** Lo que ve la interfaz: todo menos lo borrado. */
export const visibleLeads = (leads) => leads.filter((lead) => !lead.deletedAt);
