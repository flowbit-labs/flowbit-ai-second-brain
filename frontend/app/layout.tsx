import "./globals.css";

export const metadata = {
  title: "Flowbit Second Brain",
  description: "A minimal AI second brain for PDFs, links, and notes."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <header className="flex items-center justify-between mb-8">
            <div>
              <div className="text-xl font-semibold tracking-tight">Flowbit Second Brain</div>
              <div className="text-sm text-zinc-400">Minimal AI knowledge system</div>
            </div>
            <nav className="flex gap-4 text-sm text-zinc-300">
              <a className="hover:text-white" href="/">Dashboard</a>
              <a className="hover:text-white" href="/library">Library</a>
              <a className="hover:text-white" href="/search">Search / Ask</a>
            </nav>
          </header>
          {children}
          <footer className="mt-14 text-xs text-zinc-500">
            Built by Flowbit Labs — local-first, minimal, practical.
          </footer>
        </div>
      </body>
    </html>
  );
}
