import { useEffect, useMemo, useReducer, useState } from "react";
import { initialLeadsState, leadsReducer } from "./leadsReducer.js";
import { STORAGE_KEYS, readJSON, writeJSON } from "../lib/storage.js";

const SAVE_DELAY = 350;

/**
 * Estado de los negocios + carga y guardado automatico en el navegador.
 * Devuelve acciones con nombres de negocio, no de reducer, para que los
 * componentes no sepan como esta implementado por dentro.
 */
export function useLeads() {
  const [state, dispatch] = useReducer(leadsReducer, initialLeadsState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readJSON(STORAGE_KEYS.leads);
    if (Array.isArray(stored)) dispatch({ type: "hydrate", leads: stored });
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return undefined;
    const timer = setTimeout(() => writeJSON(STORAGE_KEYS.leads, state.leads), SAVE_DELAY);
    return () => clearTimeout(timer);
  }, [state.leads, ready]);

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

  return { leads: state.leads, ready, actions };
}
