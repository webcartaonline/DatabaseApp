import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" genera rutas relativas, asi la web funciona tanto en la raiz de un
// dominio como en una subcarpeta (por ejemplo usuario.github.io/gestor-clientes/).
export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    host: true,
    port: 5173,
  },
});
