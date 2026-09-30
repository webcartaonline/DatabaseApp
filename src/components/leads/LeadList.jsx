import { useEffect, useMemo, useState } from "react";
import { isFilled, searchIndex } from "../../lib/leads.js";
import EmptyState from "../ui/EmptyState.jsx";
import Icon from "../ui/Icon.jsx";
import SearchInput from "../ui/SearchInput.jsx";
import SyncBadge from "../ui/SyncBadge.jsx";
import ThemeToggle from "../ui/ThemeToggle.jsx";
import LeadCard from "./LeadCard.jsx";

/** Listado con cabecera de resumen, buscador, filtro por estado y sincronizacion. */
export default function LeadList({ leads, onOpen, onNew, syncStatus, onRetrySync }) {
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
      <header className="lt-hero">
        <div className="lt-hero-inner">
          <div className="lt-hero-grid">
            <div className="lt-hero-left">
              <div className="lt-hero-tools">
                <div className="lt-app-icon">
                  <Icon name="store" size={28} />
                </div>
                <ThemeToggle />
              </div>
              <div>
                <div className="lt-kicker">Gestor de clientes</div>
                <h1 className="lt-title">Posibles clientes</h1>
              </div>
            </div>

            <div className="lt-summary">
              <span className="lt-summary-k">Tu cartera</span>
              <span className="lt-summary-n">{leads.length}</span>
              <span className="lt-summary-l">
                {leads.length === 1 ? "negocio guardado" : "negocios guardados"}
              </span>
              {syncStatus && <SyncBadge status={syncStatus} onRetry={onRetrySync} />}
            </div>
          </div>

          <div className="lt-actions">
            <button type="button" className="lt-new" onClick={onNew}>
              <span className="lt-ring">
                <Icon name="plus" size={18} />
              </span>
              Nuevo
            </button>
            <SearchInput value={query} onChange={setQuery} placeholder="Buscar por nombre, calle o dato" />
          </div>

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

      <main className="lt-stage">
        <div className="lt-shell">
          <div className="lt-stage-head">
            <h2 className="lt-stage-title">Negocios</h2>
            {leads.length > 0 && (
              <span className="lt-stage-meta">
                {visible.length} de {leads.length}
              </span>
            )}
          </div>

          {visible.length === 0 ? (
            <EmptyState title={leads.length === 0 ? "Aún no hay negocios" : "Ningún resultado"}>
              {leads.length === 0
                ? "Añade el primer local con su nombre y su dirección. Después podrás sumarle los campos que necesites."
                : "Prueba con otro término o quita el filtro de estado."}
            </EmptyState>
          ) : (
            <div className="lt-list">
              {visible.map((lead) => (
                <LeadCard key={lead.id} lead={lead} onOpen={onOpen} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
