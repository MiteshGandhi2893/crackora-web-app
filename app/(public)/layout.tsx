// app/(public)/layout.tsx
import { Footer } from "@/components/Footer";
import { Header } from "@/components/header/Header";
import { ExamMenuUIProvider } from "@/providers/ExamMenuUIProvider";
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ExamMenuUIProvider>
        <Header />
        <main className="select-none">{children}</main>
        <Footer />
      </ExamMenuUIProvider>
    </>
  );
}
