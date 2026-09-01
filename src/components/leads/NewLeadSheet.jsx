import { useState } from "react";
import Sheet from "../ui/Sheet.jsx";

/** Alta rapida: nombre y direccion, pensado para rellenar en la calle. */
export default function NewLeadSheet({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const isValid = name.trim().length > 0;

  const submit = () => {
    if (isValid) onCreate(name, address);
  };

  const submitOnEnter = (event) => {
    if (event.key === "Enter") submit();
  };

  return (
    <Sheet title="Nuevo negocio" onClose={onClose}>
      <div className="lt-field-group">
        <label className="lt-label" htmlFor="new-lead-name">
          Nombre del local
        </label>
        <input
          id="new-lead-name"
          className="lt-input"
          value={name}
          autoFocus
          placeholder="Panaderia del Carmen"
          onChange={(event) => setName(event.target.value)}
          onKeyDown={submitOnEnter}
        />
      </div>

      <div className="lt-field-group">
        <label className="lt-label" htmlFor="new-lead-address">
          Direccion
        </label>
        <input
          id="new-lead-address"
          className="lt-input"
          value={address}
          placeholder="Calle Mayor 14, Murcia"
          onChange={(event) => setAddress(event.target.value)}
          onKeyDown={submitOnEnter}
        />
        <p className="lt-hint">Se guarda con un acceso directo a Google Maps.</p>
      </div>

      <button type="button" className="lt-btn lt-btn-primary lt-btn-full" disabled={!isValid} onClick={submit}>
        Guardar negocio
      </button>
    </Sheet>
  );
}
