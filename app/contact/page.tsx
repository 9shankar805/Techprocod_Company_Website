import type { Metadata } from "next";
import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Tech Procod | Get a Free Quote | Nepal",
  description:
    "Contact Tech Procod Pvt Ltd for a free consultation and project quote. Web development, mobile apps, e-commerce, and custom software. Call +977-9800000000 or email info@techprocod.com.",
  keywords: [
    "contact Tech Procod",
    "get a quote",
    "free consultation",
    "contact form",
    "phone number",
    "email",
    "business inquiry",
  ],
  openGraph: {
    title: "Contact Tech Procod",
    description: "Get in touch for a free consultation and project quote",
    url: "https://techprocod.com/contact",
    type: "website",
  },
  alternates: {
    canonical: "https://techprocod.com/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactForm />
    </>
  );
}
