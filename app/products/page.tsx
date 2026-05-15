import type { Metadata } from "next";
import ProductsHero from "@/components/products/ProductsHero";
import ProductsList from "@/components/products/ProductsList";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Software Products | POS, Hotel Management, Delivery System | Tech Procod",
  description:
    "Ready-made software products by Tech Procod: POS System, Hotel Management System, Delivery Management, School Management, and E-commerce Platform. Affordable, scalable solutions for Nepal.",
  keywords: [
    "POS system Nepal",
    "hotel management software",
    "delivery management system",
    "school management software",
    "e-commerce platform",
    "software products",
    "business software Nepal",
    "affordable software",
  ],
  openGraph: {
    title: "Software Products | Tech Procod",
    description: "Ready-made software solutions: POS, Hotel Management, Delivery, School Management, E-commerce",
    url: "https://techprocod.com/products",
    type: "website",
  },
  alternates: {
    canonical: "https://techprocod.com/products",
  },
};

export default function ProductsPage() {
  return (
    <>
      <ProductsHero />
      <ProductsList />
      <CTASection />
    </>
  );
}
