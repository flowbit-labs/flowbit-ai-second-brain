const API_BASE = "http://localhost:8000";

export async function listItems() {
  const r = await fetch(`${API_BASE}/items`, { cache: "no-store" });
  return r.json();
}

export async function getItem(id: string) {
  const r = await fetch(`${API_BASE}/items/${id}`, { cache: "no-store" });
  return r.json();
}

export async function ingestLink(url: string) {
  const r = await fetch(`${API_BASE}/ingest/link`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url })
  });
  return r.json();
}

export async function ingestNote(title: string, text: string) {
  const r = await fetch(`${API_BASE}/ingest/note`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, text })
  });
  return r.json();
}

export async function ingestPdf(file: File) {
  const fd = new FormData();
  fd.append("file", file);
  const r = await fetch(`${API_BASE}/ingest/pdf`, { method: "POST", body: fd });
  return r.json();
}

export async function search(q: string, mode: "semantic" | "keyword" = "semantic") {
  const r = await fetch(`${API_BASE}/search?q=${encodeURIComponent(q)}&mode=${mode}`, { cache: "no-store" });
  return r.json();
}

export async function ask(question: string, top_k = 6) {
  const r = await fetch(`${API_BASE}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, top_k })
  });
  return r.json();
}
