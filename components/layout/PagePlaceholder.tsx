/** Stand-in until Faz 6 fills these routes with real content. */
export function PagePlaceholder({ title }: { title: string }) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-5 px-8">
      <p className="font-mono text-label text-signal">FAZ 6 — İÇERİK BEKLİYOR</p>
      <h1 className="text-display text-center text-light">{title}</h1>
    </main>
  );
}
