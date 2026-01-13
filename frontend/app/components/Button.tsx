export default function Button({
  children, onClick, type="button"
}: { children: React.ReactNode; onClick?: () => void; type?: "button" | "submit" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="rounded-xl bg-zinc-100 text-zinc-950 px-4 py-2 text-sm font-medium hover:bg-white transition"
    >
      {children}
    </button>
  );
}
