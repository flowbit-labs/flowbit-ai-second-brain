"use client";
import { useEffect, useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import { listItems } from "../api";

export default function LibraryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    listItems().then(setItems);
  }, []);

  const filtered = items.filter((it) =>
    (it.title || "").toLowerCase().includes(q.toLowerCase()) ||
    (it.tags || "").toLowerCase().includes(q.toLowerCase()) ||
    (it.source || "").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="grid gap-6">
      <Card>
        <div className="text-sm font-semibold mb-3">Library</div>
        <Input placeholder="Filter by title, tags, source…" value={q} onChange={(e) => setQ(e.target.value)} />
      </Card>

      <div className="grid gap-2">
        {filtered.map((it) => (
          <a
            key={it.id}
            href={`/item/${it.id}`}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/30 px-5 py-4 hover:bg-zinc-900/60 transition"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">{it.title || "Untitled"}</div>
              <div className="text-xs text-zinc-400">{it.type.toUpperCase()}</div>
            </div>
            <div className="text-xs text-zinc-500 mt-1">{it.source}</div>
            {it.tags && <div className="text-xs text-zinc-400 mt-2">Tags: {it.tags}</div>}
          </a>
        ))}
      </div>
    </div>
  );
}
