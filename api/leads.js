import { Redis } from "@upstash/redis";
import { mergeData } from "../src/lib/sync.js";

/**
 * Unico endpoint de sincronizacion (negocios y categorias).
 *   GET -> devuelve { leads, categories } guardados en el servidor
 *   PUT -> fusiona lo que llega con lo del servidor y devuelve el resultado
 *
 * El PUT fusiona en vez de sobrescribir: si el movil y el portatil escriben
 * casi a la vez, no se pierde el trabajo de ninguno. Si un movil con una
 * version antigua manda solo negocios, las categorias guardadas se conservan.
 */
const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const KEYS = {
  leads: "gestor-clientes:leads:v1",
  categories: "gestor-clientes:categories:v1",
};

const readList = async (key) => {
  const stored = await redis.get(key);
  return Array.isArray(stored) ? stored : [];
};

const readData = async () => {
  const [leads, categories] = await Promise.all([readList(KEYS.leads), readList(KEYS.categories)]);
  return { leads, categories };
};

const writeData = (data) =>
  Promise.all([redis.set(KEYS.leads, data.leads), redis.set(KEYS.categories, data.categories)]);

export default async function handler(request, response) {
  if (request.headers["x-sync-token"] !== process.env.SYNC_TOKEN) {
    return response.status(401).json({ error: "Token invalido" });
  }

  try {
    if (request.method === "GET") {
      return response.status(200).json(await readData());
    }

    if (request.method === "PUT") {
      const merged = mergeData(await readData(), request.body);
      await writeData(merged);
      return response.status(200).json(merged);
    }

    response.setHeader("Allow", "GET, PUT");
    return response.status(405).json({ error: "Metodo no permitido" });
  } catch (error) {
    console.error("Fallo de sincronizacion", error);
    return response.status(500).json({ error: "Fallo de sincronizacion" });
  }
}
