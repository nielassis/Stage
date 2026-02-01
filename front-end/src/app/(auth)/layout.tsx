import { GuestGuard } from "@/src/components/misc/guards/guestGuard";
import { Footer } from "@/src/components/misc/layout/footer";
import { Header } from "@/src/components/misc/layout/header";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/40">
      <Header />

      <main className="flex min-h-screen items-center justify-center px-4">
        <GuestGuard>{children}</GuestGuard>
      </main>

      <Footer />
    </div>
  );
}
