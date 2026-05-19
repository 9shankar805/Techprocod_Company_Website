/**
 * renderSections.tsx
 *
 * Server-safe section rendering utility.
 * NO 'use client' directive — this file can be imported by both
 * server components (public pages) and client components (PagePreview).
 */

import React from 'react';
import { Section } from './types';

// Section components
import HeroSection from '@/components/home/HeroSection';
import ServicesOverview from '@/components/home/ServicesOverview';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import TechStack from '@/components/home/TechStack';
import Testimonials from '@/components/home/Testimonials';
import CTASection from '@/components/home/CTASection';
import StatsSection from '@/components/home/StatsSection';
import AboutHero from '@/components/about/AboutHero';
import MissionVision from '@/components/about/MissionVision';
import WhyChooseUs from '@/components/about/WhyChooseUs';
import Timeline from '@/components/about/Timeline';
import TeamSection from '@/components/about/TeamSection';
import ServicesList from '@/components/services/ServicesList';
import ProcessSection from '@/components/services/ProcessSection';
import PortfolioHero from '@/components/portfolio/PortfolioHero';
import ProjectsGrid from '@/components/portfolio/ProjectsGrid';
import ProductsList from '@/components/products/ProductsList';
import BlogGrid from '@/components/blog/BlogGrid';
import JobListings from '@/components/careers/JobListings';

// Placeholder for section types without a dedicated component
function SectionPlaceholder({ type }: { type: string }) {
  return (
    <div
      style={{
        padding: '48px 24px',
        background: '#f3f4f6',
        border: '2px dashed #d1d5db',
        borderRadius: 8,
        textAlign: 'center',
        color: '#6b7280',
        fontSize: 14,
        fontWeight: 500,
      }}
    >
      <span style={{ fontSize: 20, display: 'block', marginBottom: 8 }}>🧩</span>
      {type} — no preview component
    </div>
  );
}

function makePlaceholder(sectionType: string): React.ComponentType {
  function Placeholder() {
    return <SectionPlaceholder type={sectionType} />;
  }
  Placeholder.displayName = `${sectionType}Placeholder`;
  return Placeholder;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SECTION_COMPONENTS: Record<string, React.ComponentType<any>> = {
  HeroSection,
  ClientLogos: makePlaceholder('ClientLogos'),
  ServicesOverview,
  FeaturedProjects,
  TechStack,
  Testimonials,
  FAQSection: makePlaceholder('FAQSection'),
  CTASection,
  AboutHero,
  Stats: StatsSection,
  MissionVision,
  Values: WhyChooseUs,
  Timeline,
  TeamSection,
  ServicesHero: makePlaceholder('ServicesHero'),
  ServicesList,
  ProcessSection,
  PortfolioHero,
  ProjectsGrid,
  ProductsHero: makePlaceholder('ProductsHero'),
  ProductsList,
  BlogHero: makePlaceholder('BlogHero'),
  BlogGrid,
  CareersHero: makePlaceholder('CareersHero'),
  JobListings,
};

/**
 * Renders a single section using the SECTION_COMPONENTS dispatch map.
 * Pure helper — no selection or click handling.
 * Used by public server pages and the admin PagePreview.
 */
export function renderSection(section: Section): React.ReactNode {
  const Component = SECTION_COMPONENTS[section.type];

  if (!Component) {
    return (
      <div
        key={section.id}
        style={{
          padding: '24px',
          background: 'rgba(234, 179, 8, 0.1)',
          border: '1px solid rgba(234, 179, 8, 0.3)',
          borderRadius: 8,
          color: '#ca8a04',
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        ⚠️ Unknown section type: <strong>{section.type}</strong>
      </div>
    );
  }

  return <Component key={section.id} {...(section.content as object)} />;
}
