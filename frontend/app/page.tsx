"use client";

import { useEffect, useState } from "react";
import Card from "./components/Card";
import Button from "./components/Button";
import Input from "./components/Input";
import TextArea from "./components/TextArea";
import { ingestLink, ingestNote, ingestPdf, listItems } from "./api";

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [url, setUrl] = useState("");
  const [noteTitle, setNoteTitle] = useState("Untitled note");
  const [noteText, setNoteText] = useState("");
  const [pdf, setPdf] = useState<File | null>(null);
  const [busy, setBusy] = useState("");

  async function refresh() {
    const data = await listItems();
    setItems(data);
  }

  useEffect(() => { refresh(); }, []);

  return (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <div className="text-sm font-semibold mb-3">Add PDF</div>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdf(e.target.files?.[0] || null)}
            className="text-sm"
          />
          <div className="mt-3">
            <Button onClick={async () => {
              if (!pdf) return;
              setBusy("Uploading PDF…");
              await ingestPdf(pdf);
              setBusy("");
              setPdf(null);
              await refresh();
            }}>Upload</Button>
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold mb-3">Add Link</div>
          <Input placeholder="https://…" value={url} onChange={(e) => setUrl(e.target.value)} />
          <div className="mt-3">
            <Button onClick={async () => {
              if (!url.trim()) return;
              setBusy("Saving link…");
              await ingestLink(url.trim());
              setBusy("");
              setUrl("");
              await refresh();
            }}>Save</Button>
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold mb-3">Add Note</div>
          <Input value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} />
          <div className="mt-2" />
          <TextArea rows={6} placeholder="Paste your note…" value={noteText} onChange={(e) => setNoteText(e.target.value)} />
          <div className="mt-3">
            <Button onClick={async () => {
              if (!noteText.trim()) return;
              setBusy("Saving note…");
              await ingestNote(noteTitle, noteText);
              setBusy("");
              setNoteText("");
              setNoteTitle("Untitled note");
              await refresh();
            }}>Save</Button>
          </div>
        </Card>
      </div>

      {busy && <div className="text-sm text-zinc-400">{busy}</div>}

      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold">Recent items</div>
          <a className="text-sm text-zinc-300 hover:text-white" href="/library">View all</a>
        </div>
        <div className="grid gap-2">
          {items.slice(0, 8).map((it) => (
            <a
              key={it.id}
              href={`/item/${it.id}`}
              className="rounded-xl border border-zinc-800 bg-zinc-950/30 px-4 py-3 hover:bg-zinc-950/60 transition"
            >
              <div className="text-sm font-medium">{it.title || "Untitled"}</div>
              <div className="text-xs text-zinc-400">{it.type.toUpperCase()} • {it.source}</div>
            </a>
          ))}
        </div>
      </Card>
    </div>
  );
}
