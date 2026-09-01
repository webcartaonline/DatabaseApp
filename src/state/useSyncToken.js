import { useCallback, useState } from "react";
import { STORAGE_KEYS, readJSON, writeJSON } from "../lib/storage.js";

/**
 * La clave se escribe una vez por dispositivo y se recuerda.
 * null = todavia no se ha preguntado. "" = el usuario eligio no sincronizar.
 */
export function useSyncToken() {
  const [token, setToken] = useState(() => readJSON(STORAGE_KEYS.syncToken, null));

  const saveToken = useCallback((value) => {
    const clean = value.trim();
    writeJSON(STORAGE_KEYS.syncToken, clean);
    setToken(clean);
  }, []);

  const clearToken = useCallback(() => {
    writeJSON(STORAGE_KEYS.syncToken, null);
    setToken(null);
  }, []);

  return { token, saveToken, clearToken };
}
