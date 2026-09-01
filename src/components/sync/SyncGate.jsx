import { useState } from "react";

/** Primera pantalla en cada dispositivo nuevo. La clave se escribe una vez. */
export default function SyncGate({ onConnect, onSkip, invalid }) {
  const [value, setValue] = useState("");

  return (
    <main className="lt-shell lt-gate">
      <h1 className="lt-title">Conectar este dispositivo</h1>
      <p className="lt-sub">
        Escribe la clave de sincronizacion para ver los negocios que guardaste desde otros
        dispositivos.
      </p>

      <input
        className="lt-input"
        type="password"
        autoComplete="off"
        value={value}
        placeholder="Clave de sincronizacion"
        aria-label="Clave de sincronizacion"
        onChange={(event) => setValue(event.target.value)}
      />

      {invalid && <p className="lt-error">La clave no es correcta.</p>}

      <button
        type="button"
        className="lt-btn lt-btn-full"
        disabled={!value.trim()}
        onClick={() => onConnect(value)}
      >
        Conectar
      </button>

      <button type="button" className="lt-btn lt-btn-ghost lt-btn-full" onClick={onSkip}>
        Usar solo en este dispositivo
      </button>
    </main>
  );
}
