export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 py-10">
      <div className="mx-auto max-w-7xl px-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Diteka. Visos teisės saugomos.
      </div>
    </footer>
  );
}
