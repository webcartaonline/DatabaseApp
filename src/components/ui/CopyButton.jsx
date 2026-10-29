import { useEffect, useState } from "react";
import Icon from "./Icon.jsx";

const FEEDBACK_MS = 1600;

/** Copia al portapapeles con el metodo antiguo, para navegadores sin la API moderna. */
function legacyCopy(text) {
  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "");
  helper.style.position = "fixed";
  helper.style.opacity = "0";
  document.body.appendChild(helper);
  helper.select();
  document.execCommand("copy");
  helper.remove();
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    legacyCopy(text);
  }
}

/** Boton redondo que copia un texto y muestra un check unos instantes. */
export default function CopyButton({ text, label = "Copiar" }) {
  const [copied, setCopied] = useState(false);
  const hasText = String(text || "").length > 0;

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), FEEDBACK_MS);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    await copyText(text);
    setCopied(true);
  };

  return (
    <button
      type="button"
      className={`lt-open${copied ? " is-done" : ""}${hasText ? "" : " is-off"}`}
      title={copied ? "Copiado" : label}
      aria-label={copied ? "Copiado" : label}
      disabled={!hasText}
      onClick={handleCopy}
    >
      <Icon name={copied ? "check" : "copy"} size={17} />
    </button>
  );
}
