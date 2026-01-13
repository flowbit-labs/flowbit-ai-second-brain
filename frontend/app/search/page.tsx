"use client";
import { useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import { ask, search } from "../api";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [mode, setMode] = useState<"semantic" | "keyword">("semantic");
  const [results, setResults] = useState<any>(null);
  const [answer, setAnswer] = useState<any>(null);
  const [busy, setBusy] = useState("");

  return (
    <div className="grid gap-6">
      <Card>
        <div className="text-sm font-semibold mb-3">Search</div>
        <div className="flex gap-2">
          <Input placeholder="Search your library…" value={q} onChange={(e) => setQ(e.target.value)} />
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
            className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
          >
            <option value="semantic">Semantic</option>
            <option value="keyword">Keyword</option>
          </select>
          <Button onClick={async () => {
            if (!q.trim()) return;
            setBusy("Searching…");
            const r = await search(q.trim(), mode);
            setResults(r);
            setBusy("");
          }}>Go</Button>
        </div>
        {busy && <div className="text-xs text-zinc-400 mt-2">{busy}</div>}
      </Card>

      <Card>
        <div className="text-sm font-semibold mb-3">Ask your library</div>
        <div className="flex gap-2">
          <Input placeholder='Try: "Summarize what I saved about focus"' value={q} onChange={(e) => setQ(e.target.value)} />
          <Button onClick={async () => {
            if (!q.trim()) return;
            setBusy("Thinking…");
            const r = await ask(q.trim(), 6);
            setAnswer(r);
            setBusy("");
          }}>Ask</Button>
        </div>
        {answer?.answer && (
          <div className="mt-4 text-sm whitespace-pre-wrap text-zinc-200">{answer.answer}</div>
        )}
        {answer?.sources?.length > 0 && (
          <div className="mt-4 text-xs text-zinc-400">
            <div className="font-semibold mb-2">Sources</div>
            <div className="grid gap-2">
              {answer.sources.map((s: any, idx: number) => (
                <div key={idx} className="rounded-xl border border-zinc-800 bg-zinc-950/30 px-3 py-2">
                  <div className="text-zinc-200">{s.title}</div>
                  <div>{s.type.toUpperCase()} • {s.source}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {results && (
        <Card>
          <div className="text-sm font-semibold mb-3">Results</div>

          {results.mode === "keyword" && (
            <div className="grid gap-2">
              {results.items.map((it: any) => (
                <a key={it.id} href={`/item/${it.id}`} className="rounded-xl border border-zinc-800 bg-zinc-950/30 px-4 py-3 hover:bg-zinc-950/60 transition">
                  <div className="text-sm font-medium">{it.title}</div>
                  <div className="text-xs text-zinc-400">{it.type.toUpperCase()} • {it.source}</div>
                </a>
              ))}
            </div>
          )}

          {results.mode === "semantic" && (
            <div className="grid gap-2">
              {results.hits.map((h: any, idx: number) => (
                <div key={idx} className="rounded-xl border border-zinc-800 bg-zinc-950/30 px-4 py-3">
                  <div className="text-sm font-medium">{h.title}</div>
                  <div className="text-xs text-zinc-400">{h.type.toUpperCase()} • {h.source}</div>
                  <div className="text-xs text-zinc-300 mt-2 line-clamp-3 whitespace-pre-wrap">{h.chunk}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
