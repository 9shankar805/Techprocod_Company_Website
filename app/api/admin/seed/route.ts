import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { SECTION_DEFINITIONS } from '@/app/admin/page-builder/pageRegistry';
import { Section } from '@/app/admin/page-builder/types';

/**
 * Seed Firestore with professional demo data for all pages.
 * Only accessible by an admin session.
 */
export async function POST(request: Request) {
  try {
    const session = request.headers.get('cookie')?.includes('admin_session=true');
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pages = [
      {
        id: 'home',
        sections: [
          'HeroSection',
          'ClientLogos',
          'ServicesOverview',
          'FeaturedProjects',
          'TechStack',
          'Testimonials',
          'FAQSection',
          'CTASection'
        ]
      },
      {
        id: 'about',
        sections: [
          'AboutHero',
          'MissionVision',
          'WhyChooseUs',
          'Timeline',
          'TeamSection',
          'CTASection'
        ]
      },
      {
        id: 'services',
        sections: [
          'AboutHero', // Reuse for header
          'ServicesList',
          'CTASection'
        ]
      }
    ];

    const batch = adminDb.batch();

    for (const page of pages) {
      const sections: Section[] = page.sections.map((type, index) => {
        const def = SECTION_DEFINITIONS[type];
        return {
          id: `${type.toLowerCase()}-${Date.now()}-${index}`,
          type,
          content: JSON.parse(JSON.stringify(def?.defaultContent || {})),
          visible: true,
          order: index
        };
      });

      const ref = adminDb.collection('pageContent').doc(page.id);
      batch.set(ref, { sections, updatedAt: new Date().toISOString() });
    }

    await batch.commit();

    return NextResponse.json({ message: 'Database seeded successfully with professional content' });
  } catch (error: any) {
    console.error('Seed Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
