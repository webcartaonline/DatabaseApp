import { useEffect, useMemo, useState } from "react";
import { isFilled, searchIndex } from "../../lib/leads.js";
import EmptyState from "../ui/EmptyState.jsx";
import SearchInput from "../ui/SearchInput.jsx";
import SyncBadge from "../ui/SyncBadge.jsx";
import ThemeToggle from "../ui/ThemeToggle.jsx";
import LeadCard from "./LeadCard.jsx";

/** Listado con buscador, filtro por estado e indicador de sincronizacion. */
export default function LeadList({ leads, onOpen, syncStatus, onRetrySync }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const statuses = useMemo(() => {
    const found = new Set();
    leads.forEach((lead) =>
      lead.fields.forEach((field) => {
        if (field.type === "status" && isFilled(field)) found.add(field.value);
      })
    );
    return [...found].sort();
  }, [leads]);

  // Si el estado por el que se filtraba ya no existe, se limpia el filtro.
  useEffect(() => {
    if (statusFilter && !statuses.includes(statusFilter)) setStatusFilter("");
  }, [statuses, statusFilter]);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesStatus =
        !statusFilter ||
        lead.fields.some((field) => field.type === "status" && field.value === statusFilter);

      if (!matchesStatus) return false;
      return !term || searchIndex(lead).includes(term);
    });
  }, [leads, query, statusFilter]);

  return (
    <>
      <header className="lt-top">
        <div className="lt-top-inner">
          <div className="lt-bar">
            <div className="lt-grow">
              <h1 className="lt-title">Posibles clientes</h1>
              <div className="lt-sub">
                {leads.length} {leads.length === 1 ? "negocio guardado" : "negocios guardados"}
              </div>
              {syncStatus && <SyncBadge status={syncStatus} onRetry={onRetrySync} />}
            </div>
            <ThemeToggle />
          </div>

          <SearchInput value={query} onChange={setQuery} placeholder="Buscar por nombre, calle o dato" />

          {statuses.length > 0 && (
            <div className="lt-chips">
              <button
                type="button"
                className={`lt-chip${statusFilter === "" ? " is-active" : ""}`}
                onClick={() => setStatusFilter("")}
              >
                Todos
              </button>
              {statuses.map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`lt-chip${statusFilter === status ? " is-active" : ""}`}
                  onClick={() => setStatusFilter(statusFilter === status ? "" : status)}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="lt-shell">
        {visible.length === 0 ? (
          <EmptyState title={leads.length === 0 ? "Aun no hay negocios" : "Ningun resultado"}>
            {leads.length === 0
              ? "Anade el primer local con su nombre y su direccion. Despues podras sumarle los campos que necesites."
              : "Prueba con otro termino o quita el filtro de estado."}
          </EmptyState>
        ) : (
          <div className="lt-list">
            {visible.map((lead) => (
              <LeadCard key={lead.id} lead={lead} onOpen={onOpen} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
