import Logo from "./logo";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Logo />
        <span className="text-xs text-muted-foreground">
          Sistema de Gestão de OS
        </span>
      </div>
    </footer>
  );
}
