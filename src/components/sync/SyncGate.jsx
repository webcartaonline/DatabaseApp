import { useState } from "react";
import Icon from "../ui/Icon.jsx";

/** Primera pantalla en cada dispositivo nuevo. La clave se escribe una vez. */
export default function SyncGate({ onConnect, onSkip, invalid }) {
  const [value, setValue] = useState("");

  return (
    <div className="lt-hero lt-gate-screen">
      <main className="lt-shell lt-gate">
        <div className="lt-app-icon">
          <Icon name="link" size={28} />
        </div>
        <div>
          <div className="lt-kicker">Posibles clientes</div>
          <h1 className="lt-title">Conectar este dispositivo</h1>
        </div>
        <p className="lt-sub">
          Escribe la clave de sincronización para ver los negocios que guardaste desde otros dispositivos.
        </p>

        <input
          className="lt-input lt-input-glass"
          type="password"
          autoComplete="off"
          value={value}
          placeholder="Clave de sincronización"
          aria-label="Clave de sincronización"
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && value.trim()) onConnect(value);
          }}
        />

        {invalid && <p className="lt-error">La clave no es correcta.</p>}

        <button
          type="button"
          className="lt-btn lt-btn-pill lt-btn-full"
          disabled={!value.trim()}
          onClick={() => onConnect(value)}
        >
          Conectar
        </button>

        <button type="button" className="lt-btn lt-btn-glass lt-btn-full" onClick={onSkip}>
          Usar solo en este dispositivo
        </button>
      </main>
    </div>
  );
}
