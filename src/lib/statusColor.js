/**
 * Cada estado recibe un color estable. Los estados habituales tienen su tono
 * asignado; cualquier estado nuevo que escriba el usuario obtiene uno derivado
 * de su texto, asi nunca se queda sin color.
 */
const STATUS_HUES = {
  nuevo: 215,
  contactado: 205,
  "en curso": 265,
  "en proceso": 265,
  negociando: 32,
  pendiente: 48,
  propuesta: 285,
  visitado: 190,
  ganado: 145,
  cliente: 145,
  perdido: 4,
  descartado: 220,
  "sin interes": 220,
};

function hueOf(value) {
  const key = String(value || "").trim().toLowerCase();
  if (STATUS_HUES[key] != null) return STATUS_HUES[key];

  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) % 360;
  }
  return hash;
}

export function statusColor(value, theme) {
  const hue = hueOf(value);
  const isDark = theme === "dark";

  return {
    solid: `hsl(${hue} ${isDark ? 65 : 58}% ${isDark ? 60 : 45}%)`,
    text: `hsl(${hue} ${isDark ? 70 : 55}% ${isDark ? 72 : 34}%)`,
    bg: `hsl(${hue} ${isDark ? 60 : 62}% ${isDark ? 60 : 46}% / ${isDark ? 0.16 : 0.11})`,
  };
}
