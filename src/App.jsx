import { useEffect, useState } from "react";
import LeadDetail from "./components/leads/LeadDetail.jsx";
import LeadList from "./components/leads/LeadList.jsx";
import NewLeadSheet from "./components/leads/NewLeadSheet.jsx";
import SyncGate from "./components/sync/SyncGate.jsx";
import Icon from "./components/ui/Icon.jsx";
import { createLead } from "./lib/leads.js";
import { useLeads } from "./state/useLeads.js";
import { useSyncToken } from "./state/useSyncToken.js";

/**
 * Une las dos vistas de la app. Solo hay dos pantallas, asi que la navegacion
 * se resuelve con el id del negocio abierto en lugar de un router.
 */
export default function App() {
  const { token, saveToken, clearToken } = useSyncToken();
  const { leads, ready, status, refresh, actions } = useLeads(token);
  const [selectedId, setSelectedId] = useState(null);
  const [newLeadOpen, setNewLeadOpen] = useState(false);

  const selected = leads.find((lead) => lead.id === selectedId) || null;

  // Si el negocio abierto desaparece, se vuelve al listado.
  useEffect(() => {
    if (ready && selectedId && !selected) setSelectedId(null);
  }, [ready, selectedId, selected]);

  const handleCreateLead = (name, address) => {
    const lead = createLead(name, address);
    actions.addLead(lead);
    setNewLeadOpen(false);
    setSelectedId(lead.id);
  };

  const handleDeleteLead = () => {
    const id = selectedId;
    setSelectedId(null);
    actions.deleteLead(id);
  };

  if (!ready) return null;

  // Primera vez en este dispositivo: pide la clave antes de mostrar nada.
  if (token === null) {
    return (
      <SyncGate
        onConnect={saveToken}
        onSkip={() => saveToken("")}
        invalid={status === "unauthorized"}
      />
    );
  }

  return (
    <>
      {selected ? (
        <LeadDetail
          lead={selected}
          onBack={() => setSelectedId(null)}
          onRename={(name) => actions.renameLead(selected.id, name)}
          onAddField={(field) => actions.addField(selected.id, field)}
          onPatchField={(fieldId, patch) => actions.patchField(selected.id, fieldId, patch)}
          onMoveField={(fieldId, offset) => actions.moveField(selected.id, fieldId, offset)}
          onDeleteField={(fieldId) => actions.deleteField(selected.id, fieldId)}
          onDelete={handleDeleteLead}
        />
      ) : (
        <>
          <LeadList
            leads={leads}
            onOpen={setSelectedId}
            syncStatus={token ? status : null}
            onRetrySync={status === "unauthorized" ? clearToken : refresh}
          />
          <button type="button" className="lt-fab" onClick={() => setNewLeadOpen(true)}>
            <Icon name="plus" size={19} />
            Nuevo
          </button>
        </>
      )}

      {newLeadOpen && <NewLeadSheet onClose={() => setNewLeadOpen(false)} onCreate={handleCreateLead} />}
    </>
  );
}
