/** Formato de fechas en castellano. */
export const formatDate = (timestamp) =>
  new Date(timestamp).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
