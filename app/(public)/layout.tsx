// app/(public)/layout.tsx
import { Footer } from "@/components/Footer";
import { Header } from "@/components/header/Header";
import { WhatsAppWidget } from "@/components/WhatsappWidget";
import { MenuUIProvider } from "@/providers/MenuUIProvider";
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MenuUIProvider>
        <Header />
        <main className="select-none">{children}</main>
        <WhatsAppWidget />
        <Footer />
      </MenuUIProvider>
    </>
  );
}
