/**
 * Fusion de los datos de la app (negocios y categorias). Es codigo puro y sin
 * APIs del navegador porque tambien lo usa la funcion de Vercel (api/leads.js).
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

/** Fusiona dos listas de registros con id y updatedAt. */
export function mergeRecords(base = [], incoming = []) {
  const byId = new Map(base.map((record) => [record.id, record]));
  incoming.forEach((record) => byId.set(record.id, newest(byId.get(record.id), record)));
  return [...byId.values()].sort((a, b) => b.createdAt - a.createdAt);
}

/** Descarta las lapidas antiguas para que la lista no crezca sin fin. */
export const pruneDeleted = (records, now = Date.now()) =>
  records.filter((record) => !record.deletedAt || now - record.deletedAt < DELETED_TTL);

/** Lo que ve la interfaz: todo menos lo borrado. */
export const visibleRecords = (records) => records.filter((record) => !record.deletedAt);

const asList = (value) => (Array.isArray(value) ? value : []);

/** Da siempre la forma { leads, categories }, aunque falte alguna lista. */
export const toData = (raw) => ({
  leads: asList(raw?.leads),
  categories: asList(raw?.categories),
});

/** Fusiona dos conjuntos completos de datos, lista a lista. */
export function mergeData(base, incoming) {
  const current = toData(base);
  const next = toData(incoming);
  return {
    leads: pruneDeleted(mergeRecords(current.leads, next.leads)),
    categories: pruneDeleted(mergeRecords(current.categories, next.categories)),
  };
}
