"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import CookieConsent from "@/components/CookieConsent";
import BackToTop from "@/components/BackToTop";
import Chatbot from "@/components/Chatbot";

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <FloatingContact />
      <CookieConsent />
      <BackToTop />
      <Chatbot />
    </>
  );
}
