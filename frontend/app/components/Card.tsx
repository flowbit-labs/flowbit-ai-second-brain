export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 shadow-sm">
      {children}
    </div>
  );
}
