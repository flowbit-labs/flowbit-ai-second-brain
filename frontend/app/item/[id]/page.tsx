"use client";
import { useEffect, useState } from "react";
import Card from "../../components/Card";
import { getItem } from "../../api";

export default function ItemPage({ params }: { params: { id: string } }) {
  const [it, setIt] = useState<any>(null);

  useEffect(() => { getItem(params.id).then(setIt); }, [params.id]);

  if (!it) return <div className="text-sm text-zinc-400">Loading…</div>;

  return (
    <div className="grid gap-6">
      <Card>
        <div className="text-lg font-semibold">{it.title || "Untitled"}</div>
        <div className="text-xs text-zinc-400 mt-1">{it.type.toUpperCase()} • {it.source}</div>
        {it.tags && <div className="text-xs text-zinc-400 mt-2">Tags: {it.tags}</div>}
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <div className="text-sm font-semibold mb-3">AI summary</div>
          <div className="text-sm text-zinc-200 whitespace-pre-wrap">{it.summary || "—"}</div>

          <div className="text-sm font-semibold mt-6 mb-2">Key takeaways</div>
          <div className="text-sm text-zinc-200 whitespace-pre-wrap">{it.takeaways || "—"}</div>
        </Card>

        <Card>
          <div className="text-sm font-semibold mb-3">Extracted content</div>
          <div className="text-sm text-zinc-300 whitespace-pre-wrap max-h-[520px] overflow-auto">
            {it.content || "—"}
          </div>
        </Card>
      </div>
    </div>
  );
}
