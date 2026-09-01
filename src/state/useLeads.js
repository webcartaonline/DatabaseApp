import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { initialLeadsState, leadsReducer } from "./leadsReducer.js";
import { STORAGE_KEYS, readJSON, writeJSON } from "../lib/storage.js";
import { fetchLeads, pushLeads } from "../lib/api.js";
import { visibleLeads } from "../lib/sync.js";

const CACHE_DELAY = 350;
const PUSH_DELAY = 900;

const statusFor = (error) => (error.message === "unauthorized" ? "unauthorized" : "offline");

/**
 * Estado de los negocios con cache local (para abrir al instante y sin red)
 * y sincronizacion remota (para verlos desde cualquier dispositivo).
 * Devuelve acciones con nombres de negocio, no de reducer, para que los
 * componentes no sepan como esta implementado por dentro.
 */
export function useLeads(token) {
  const [state, dispatch] = useReducer(leadsReducer, initialLeadsState);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("idle");
  const syncedRef = useRef("");

  // 1. Cache local: la app arranca al instante, con o sin cobertura.
  useEffect(() => {
    const stored = readJSON(STORAGE_KEYS.leads);
    if (Array.isArray(stored)) dispatch({ type: "hydrate", leads: stored });
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return undefined;
    const timer = setTimeout(() => writeJSON(STORAGE_KEYS.leads, state.leads), CACHE_DELAY);
    return () => clearTimeout(timer);
  }, [state.leads, ready]);

  // 2. Bajada: trae lo del servidor y lo fusiona con lo que ya hay aqui.
  const pull = useCallback(async () => {
    if (!token) return;
    setStatus("syncing");
    try {
      const remote = await fetchLeads(token);
      syncedRef.current = JSON.stringify(remote);
      dispatch({ type: "merge", leads: remote });
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
    if (JSON.stringify(state.leads) === syncedRef.current) return undefined;

    const timer = setTimeout(async () => {
      setStatus("syncing");
      try {
        const merged = await pushLeads(token, state.leads);
        syncedRef.current = JSON.stringify(merged);
        dispatch({ type: "merge", leads: merged });
        setStatus("synced");
      } catch (error) {
        setStatus(statusFor(error));
      }
    }, PUSH_DELAY);

    return () => clearTimeout(timer);
  }, [state.leads, ready, token]);

  const actions = useMemo(
    () => ({
      addLead: (lead) => dispatch({ type: "addLead", lead }),
      deleteLead: (id) => dispatch({ type: "deleteLead", id }),
      renameLead: (id, name) => dispatch({ type: "renameLead", id, name }),
      addField: (id, field) => dispatch({ type: "addField", id, field }),
      patchField: (id, fieldId, patch) => dispatch({ type: "patchField", id, fieldId, patch }),
      deleteField: (id, fieldId) => dispatch({ type: "deleteField", id, fieldId }),
      moveField: (id, fieldId, offset) => dispatch({ type: "moveField", id, fieldId, offset }),
    }),
    []
  );

  const leads = useMemo(() => visibleLeads(state.leads), [state.leads]);

  return { leads, ready, status, refresh: pull, actions };
}
