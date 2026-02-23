// app/(public)/layout.tsx
import { Footer } from "@/components/Footer";
import { Header } from "@/components/header/Header";
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <>
      <Header />
      <main className="select-none">{children}</main>
      <Footer/>

    </>
  );
}
