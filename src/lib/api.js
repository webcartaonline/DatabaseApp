/**
 * Cliente del endpoint /api/leads. Lanza errores con nombre para que el hook
 * sepa distinguir entre "no hay red" y "la clave esta mal".
 */
const ENDPOINT = "/api/leads";

async function request(method, token, body) {
  const response = await fetch(ENDPOINT, {
    method,
    headers: { "Content-Type": "application/json", "x-sync-token": token },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401) throw new Error("unauthorized");
  if (!response.ok) throw new Error("request-failed");

  const data = await response.json();
  return Array.isArray(data.leads) ? data.leads : [];
}

export const fetchLeads = (token) => request("GET", token);
export const pushLeads = (token, leads) => request("PUT", token, { leads });
