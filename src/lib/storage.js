/**
 * Acceso a localStorage tolerante a fallos: si el navegador lo bloquea
 * (modo privado, permisos), la app sigue funcionando sin guardar.
 */
const PREFIX = "gestor-clientes";

export const STORAGE_KEYS = {
  leads: `${PREFIX}:leads:v1`,
  theme: `${PREFIX}:theme`,
  syncToken: `${PREFIX}:sync-token`,
};

export function readJSON(key, fallback = null) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch (error) {
    console.warn("No se pudo leer el almacenamiento local", error);
    return fallback;
  }
}

export function writeJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("No se pudo guardar en el almacenamiento local", error);
  }
}
