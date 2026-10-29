import { useCallback, useEffect, useMemo, useState } from "react";
import CategoryPicker from "./components/categories/CategoryPicker.jsx";
import PendingOverview from "./components/categories/PendingOverview.jsx";
import LeadDetail from "./components/leads/LeadDetail.jsx";
import LeadList from "./components/leads/LeadList.jsx";
import NewLeadSheet from "./components/leads/NewLeadSheet.jsx";
import SyncGate from "./components/sync/SyncGate.jsx";
import { categoryIdOf, createCategory, editCategory, leadsInCategory } from "./lib/categories.js";
import { createLead } from "./lib/leads.js";
import { useActiveCategory } from "./state/useActiveCategory.js";
import { useSyncedData } from "./state/useSyncedData.js";
import { useSyncToken } from "./state/useSyncToken.js";

/** Ventanas que se pueden abrir sobre el listado; solo una a la vez. */
const DIALOGS = { newLead: "newLead", categories: "categories", pending: "pending" };

/**
 * Une las dos vistas de la app. Solo hay dos pantallas, asi que la navegacion
 * se resuelve con el id del negocio abierto en lugar de un router.
 */
export default function App() {
  const { token, saveToken, clearToken } = useSyncToken();
  const { leads, categories, ready, status, refresh, actions } = useSyncedData(token);
  const [activeCategory, setActiveCategoryId] = useActiveCategory(categories);
  const [selectedId, setSelectedId] = useState(null);
  const [dialog, setDialog] = useState(null);

  const selected = leads.find((lead) => lead.id === selectedId) || null;
  const categoryLeads = useMemo(
    () => leadsInCategory(leads, activeCategory.id),
    [leads, activeCategory.id]
  );

  // Si el negocio abierto desaparece, se vuelve al listado.
  useEffect(() => {
    if (ready && selectedId && !selected) setSelectedId(null);
  }, [ready, selectedId, selected]);

  // Cada cambio de pantalla empieza arriba del todo.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedId]);

  const closeDialog = useCallback(() => setDialog(null), []);

  const handleCreateLead = (name, address) => {
    const lead = createLead(name, address, activeCategory.id);
    actions.addLead(lead);
    closeDialog();
    setSelectedId(lead.id);
  };

  const handleDeleteLead = () => {
    const id = selectedId;
    setSelectedId(null);
    actions.deleteLead(id);
  };

  const handleSelectCategory = (id) => {
    setActiveCategoryId(id);
    closeDialog();
  };

  // Una categoria recien creada pasa a ser la actual.
  const handleCreateCategory = (values) => {
    const category = createCategory(values);
    actions.saveCategory(category);
    handleSelectCategory(category.id);
  };

  const handleUpdateCategory = (category, values) => {
    actions.saveCategory(editCategory(category, values));
  };

  // Abrir un pendiente de otra categoria tambien cambia a esa categoria.
  const handleOpenPendingLead = (lead) => {
    setActiveCategoryId(categoryIdOf(lead));
    closeDialog();
    setSelectedId(lead.id);
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
          categories={categories}
          categoryId={categoryIdOf(selected)}
          onBack={() => setSelectedId(null)}
          onMoveToCategory={(categoryId) => actions.moveLead(selected.id, categoryId)}
          onRename={(name) => actions.renameLead(selected.id, name)}
          onAddField={(field) => actions.addField(selected.id, field)}
          onPatchField={(fieldId, patch) => actions.patchField(selected.id, fieldId, patch)}
          onMoveField={(fieldId, offset) => actions.moveField(selected.id, fieldId, offset)}
          onDeleteField={(fieldId) => actions.deleteField(selected.id, fieldId)}
          onDelete={handleDeleteLead}
        />
      ) : (
        <LeadList
          leads={categoryLeads}
          category={activeCategory}
          onOpen={setSelectedId}
          onNew={() => setDialog(DIALOGS.newLead)}
          onOpenCategories={() => setDialog(DIALOGS.categories)}
          onOpenPending={() => setDialog(DIALOGS.pending)}
          syncStatus={token ? status : null}
          onRetrySync={status === "unauthorized" ? clearToken : refresh}
        />
      )}

      {dialog === DIALOGS.newLead && (
        <NewLeadSheet categoryName={activeCategory.name} onClose={closeDialog} onCreate={handleCreateLead} />
      )}

      {dialog === DIALOGS.categories && (
        <CategoryPicker
          categories={categories}
          activeId={activeCategory.id}
          onSelect={handleSelectCategory}
          onCreate={handleCreateCategory}
          onUpdate={handleUpdateCategory}
          onClose={closeDialog}
        />
      )}

      {dialog === DIALOGS.pending && (
        <PendingOverview
          leads={leads}
          categories={categories}
          activeId={activeCategory.id}
          onOpenLead={handleOpenPendingLead}
          onClose={closeDialog}
        />
      )}
    </>
  );
}
