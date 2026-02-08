// app/(public)/layout.tsx
import { Header } from "@/components/header/Header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}
