import { Redis } from "@upstash/redis";
import { mergeLeads, pruneDeleted } from "../src/lib/sync.js";

/**
 * Unico endpoint de sincronizacion.
 *   GET -> devuelve los negocios guardados en el servidor
 *   PUT -> fusiona los que llegan con los del servidor y devuelve el resultado
 *
 * El PUT fusiona en vez de sobrescribir: si el movil y el portatil escriben
 * casi a la vez, no se pierde el trabajo de ninguno.
 *
 */
const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const KEY = "gestor-clientes:leads:v1";

const readLeads = async () => {
  const stored = await redis.get(KEY);
  return Array.isArray(stored) ? stored : [];
};

export default async function handler(request, response) {
  if (request.headers["x-sync-token"] !== process.env.SYNC_TOKEN) {
    return response.status(401).json({ error: "Token invalido" });
  }

  try {
    if (request.method === "GET") {
      return response.status(200).json({ leads: await readLeads() });
    }

    if (request.method === "PUT") {
      const incoming = Array.isArray(request.body?.leads) ? request.body.leads : [];
      const merged = pruneDeleted(mergeLeads(await readLeads(), incoming));
      await redis.set(KEY, merged);
      return response.status(200).json({ leads: merged });
    }

    response.setHeader("Allow", "GET, PUT");
    return response.status(405).json({ error: "Metodo no permitido" });
  } catch (error) {
    console.error("Fallo de sincronizacion", error);
    return response.status(500).json({ error: "Fallo de sincronizacion" });
  }
}
