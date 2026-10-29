import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { dataReducer, initialDataState } from "./dataReducer.js";
import { STORAGE_KEYS, readJSON, writeJSON } from "../lib/storage.js";
import { fetchData, pushData } from "../lib/api.js";
import { visibleRecords } from "../lib/sync.js";
import { withDefaultCategory } from "../lib/categories.js";

const CACHE_DELAY = 350;
const PUSH_DELAY = 900;

const statusFor = (error) => (error.message === "unauthorized" ? "unauthorized" : "offline");

const readCache = () => ({
  leads: readJSON(STORAGE_KEYS.leads),
  categories: readJSON(STORAGE_KEYS.categories),
});

const writeCache = ({ leads, categories }) => {
  writeJSON(STORAGE_KEYS.leads, leads);
  writeJSON(STORAGE_KEYS.categories, categories);
};

/**
 * Negocios y categorias con cache local (para abrir al instante y sin red)
 * y sincronizacion remota (para verlos desde cualquier dispositivo).
 * Devuelve acciones con nombres de negocio, no de reducer, para que los
 * componentes no sepan como esta implementado por dentro.
 */
export function useSyncedData(token) {
  const [state, dispatch] = useReducer(dataReducer, initialDataState);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("idle");
  const syncedRef = useRef("");

  // 1. Cache local: la app arranca al instante, con o sin cobertura.
  useEffect(() => {
    dispatch({ type: "hydrate", data: readCache() });
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return undefined;
    const timer = setTimeout(() => writeCache(state), CACHE_DELAY);
    return () => clearTimeout(timer);
  }, [state, ready]);

  // 2. Bajada: trae lo del servidor y lo fusiona con lo que ya hay aqui.
  const pull = useCallback(async () => {
    if (!token) return;
    setStatus("syncing");
    try {
      const remote = await fetchData(token);
      syncedRef.current = JSON.stringify(remote);
      dispatch({ type: "merge", data: remote });
      setStatus("synced");
    } catch (error) {
      setStatus(statusFor(error));
    }
  }, [token]);

  useEffect(() => {
    pull();
  }, [pull]);

  // Vuelve a mirar al recuperar el foco o la conexion: por eso no hay que
  // hacer nada para ver en otro dispositivo lo que se guardo en la calle.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") pull();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("online", pull);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("online", pull);
    };
  }, [pull]);

  // 3. Subida: solo si lo local difiere de lo ultimo que confirmo el servidor.
  useEffect(() => {
    if (!ready || !token) return undefined;
    if (JSON.stringify(state) === syncedRef.current) return undefined;

    const timer = setTimeout(async () => {
      setStatus("syncing");
      try {
        const merged = await pushData(token, state);
        syncedRef.current = JSON.stringify(merged);
        dispatch({ type: "merge", data: merged });
        setStatus("synced");
      } catch (error) {
        setStatus(statusFor(error));
      }
    }, PUSH_DELAY);

    return () => clearTimeout(timer);
  }, [state, ready, token]);

  const actions = useMemo(
    () => ({
      addLead: (lead) => dispatch({ type: "addLead", lead }),
      deleteLead: (id) => dispatch({ type: "deleteLead", id }),
      moveLead: (id, categoryId) => dispatch({ type: "moveLead", id, categoryId }),
      renameLead: (id, name) => dispatch({ type: "renameLead", id, name }),
      addField: (id, field) => dispatch({ type: "addField", id, field }),
      patchField: (id, fieldId, patch) => dispatch({ type: "patchField", id, fieldId, patch }),
      deleteField: (id, fieldId) => dispatch({ type: "deleteField", id, fieldId }),
      moveField: (id, fieldId, offset) => dispatch({ type: "moveField", id, fieldId, offset }),
      saveCategory: (category) => dispatch({ type: "saveCategory", category }),
    }),
    []
  );

  const leads = useMemo(() => visibleRecords(state.leads), [state.leads]);
  const categories = useMemo(
    () => withDefaultCategory(visibleRecords(state.categories)),
    [state.categories]
  );

  return { leads, categories, ready, status, refresh: pull, actions };
}
