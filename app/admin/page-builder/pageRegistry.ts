// Page Registry — single source of truth for section types, field schemas, and default content
import { SectionDefinition, Section, PageId } from './types';

export const SECTION_DEFINITIONS: Record<string, SectionDefinition> = {
  HeroSection: {
    type: 'HeroSection',
    label: 'Hero Section',
    fields: [
      { key: 'badge', label: 'Badge Text', type: 'text' },
      { key: 'heading', label: 'Heading', type: 'textarea' },
      { key: 'subheading', label: 'Subheading', type: 'textarea' },
      { key: 'primaryCtaLabel', label: 'Primary CTA Label', type: 'text' },
      { key: 'primaryCtaHref', label: 'Primary CTA URL', type: 'url' },
      { key: 'secondaryCtaLabel', label: 'Secondary CTA Label', type: 'text' },
      { key: 'secondaryCtaHref', label: 'Secondary CTA URL', type: 'url' },
      { key: 'image', label: 'Hero Image URL', type: 'url' },
      {
        key: 'stats', label: 'Stats', type: 'array',
        itemSchema: [
          { key: 'value', label: 'Value', type: 'text' },
          { key: 'label', label: 'Label', type: 'text' },
        ],
      },
    ],
    defaultContent: {
      badge: "Nepal's Leading Digital Agency",
      heading: 'Transforming Businesses with Modern Software',
      subheading:
        'We build high-performance web applications, native mobile apps, and custom enterprise software tailored for the Nepali market.',
      primaryCtaLabel: 'Start Your Journey',
      primaryCtaHref: '/contact',
      secondaryCtaLabel: 'View Portfolio',
      secondaryCtaHref: '/portfolio',
      image: '/assets/logo.jpg',
      stats: [
        { value: '75+', label: 'Projects Completed' },
        { value: '40+', label: 'Global Clients' },
        { value: '6+', label: 'Years Experience' },
        { value: '98%', label: 'Retention Rate' },
      ],
    },
  },

  ClientLogos: {
    type: 'ClientLogos',
    label: 'Client Logos',
    fields: [
      { key: 'tagline', label: 'Tagline', type: 'text' },
      {
        key: 'clients', label: 'Clients', type: 'array',
        itemSchema: [
          { key: 'name', label: 'Name', type: 'text' },
          { key: 'industry', label: 'Industry', type: 'text' },
        ],
      },
    ],
    defaultContent: {
      tagline: "Empowering visionary companies across Nepal",
      clients: [
        { name: 'StyleAura', industry: 'E-commerce' },
        { name: 'RideSewa', industry: 'Mobility' },
        { name: 'HotelSewa', industry: 'Hospitality' },
        { name: 'Siraha Bazaar', industry: 'Retail' },
        { name: 'SchoolPro', industry: 'EdTech' },
        { name: 'MediCare', industry: 'HealthTech' },
      ],
    },
  },

  ServicesOverview: {
    type: 'ServicesOverview',
    label: 'Services Overview',
    fields: [
      { key: 'badge', label: 'Badge Text', type: 'text' },
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'subheading', label: 'Subheading', type: 'textarea' },
      {
        key: 'services', label: 'Services', type: 'array',
        itemSchema: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'desc', label: 'Description', type: 'textarea' },
        ],
      },
      { key: 'ctaLabel', label: 'CTA Label', type: 'text' },
      { key: 'ctaHref', label: 'CTA URL', type: 'url' },
    ],
    defaultContent: {
      badge: 'Core Services',
      heading: 'Expertise Driven by Innovation',
      subheading: 'We deliver comprehensive digital solutions that solve complex business challenges.',
      services: [
        { title: 'Custom Web Apps', desc: 'Scalable, secure, and SEO-optimized web platforms built with Next.js and Laravel.' },
        { title: 'Mobile Solutions', desc: 'High-performance iOS and Android apps using React Native for seamless user experiences.' },
        { title: 'E-commerce Ecosystems', desc: 'End-to-end online stores with integrated local payment gateways like eSewa and Khalti.' },
        { title: 'UI/UX Design', desc: 'Data-driven, user-centric design that maximizes engagement and conversion rates.' },
        { title: 'Enterprise Software', desc: 'Robust internal systems, ERPs, and automation tools for large-scale operations.' },
        { title: 'Cloud & DevOps', desc: 'Reliable hosting, CI/CD pipelines, and infrastructure management for zero downtime.' },
      ],
      ctaLabel: 'Explore All Services',
      ctaHref: '/services',
    },
  },

  FeaturedProjects: {
    type: 'FeaturedProjects',
    label: 'Featured Projects',
    fields: [
      { key: 'badge', label: 'Badge Text', type: 'text' },
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'subheading', label: 'Subheading', type: 'textarea' },
      {
        key: 'projects', label: 'Projects', type: 'array',
        itemSchema: [
          { key: 'name', label: 'Name', type: 'text' },
          { key: 'category', label: 'Category', type: 'text' },
          { key: 'desc', label: 'Description', type: 'textarea' },
          { key: 'href', label: 'Link URL', type: 'url' },
          { key: 'image', label: 'Thumbnail URL', type: 'url' },
        ],
      },
      { key: 'ctaLabel', label: 'CTA Label', type: 'text' },
      { key: 'ctaHref', label: 'CTA URL', type: 'url' },
    ],
    defaultContent: {
      badge: 'Portfolio',
      heading: 'Delivering Impactful Products',
      subheading: "A selection of our finest work that defines our commitment to quality.",
      projects: [
        { 
          name: 'StyleAura', 
          category: 'Premium E-commerce', 
          desc: 'A luxury fashion marketplace featuring AI-driven style suggestions and multi-vendor logistics.', 
          href: '/portfolio',
          image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop'
        },
        { 
          name: 'RideSewa', 
          category: 'Smart Mobility', 
          desc: "Nepal's most reliable ride-sharing platform with real-time GPS and wallet integration.", 
          href: '/portfolio',
          image: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?q=80&w=2070&auto=format&fit=crop'
        },
        { 
          name: 'HotelSewa Pro', 
          category: 'Hospitality SaaS', 
          desc: 'Cloud-based hotel management with automated booking, inventory, and analytics.', 
          href: '/portfolio',
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop'
        },
        { 
          name: 'Siraha Connect', 
          category: 'Civic Tech', 
          desc: 'Hyperlocal digital infrastructure connecting citizens with local government services.', 
          href: '/portfolio',
          image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop'
        },
      ],
      ctaLabel: 'View Full Portfolio',
      ctaHref: '/portfolio',
    },
  },

  TechStack: {
    type: 'TechStack',
    label: 'Tech Stack',
    fields: [
      { key: 'badge', label: 'Badge Text', type: 'text' },
      { key: 'heading', label: 'Heading', type: 'text' },
      {
        key: 'techs', label: 'Technologies', type: 'array',
        itemSchema: [
          { key: 'name', label: 'Technology Name', type: 'text' },
        ],
      },
    ],
    defaultContent: {
      badge: 'Tech Stack',
      heading: 'Technologies We Use',
      techs: [
        { name: 'React' },
        { name: 'Next.js' },
        { name: 'Laravel' },
        { name: 'TypeScript' },
        { name: 'Tailwind CSS' },
        { name: 'MySQL' },
        { name: 'React Native' },
        { name: 'Node.js' },
        { name: 'Python' },
        { name: 'Docker' },
        { name: 'AWS' },
        { name: 'Figma' },
      ],
    },
  },

  Testimonials: {
    type: 'Testimonials',
    label: 'Testimonials',
    fields: [
      { key: 'badge', label: 'Badge Text', type: 'text' },
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'subheading', label: 'Subheading', type: 'textarea' },
      {
        key: 'testimonials', label: 'Testimonials', type: 'array',
        itemSchema: [
          { key: 'name', label: 'Name', type: 'text' },
          { key: 'role', label: 'Role', type: 'text' },
          { key: 'content', label: 'Content', type: 'textarea' },
          { key: 'rating', label: 'Rating (1-5)', type: 'number' },
          { key: 'image', label: 'Avatar URL', type: 'url' },
        ],
      },
    ],
    defaultContent: {
      badge: 'Client Stories',
      heading: 'Trust Built on Results',
      subheading: "Hear from the business leaders we've partnered with to drive digital growth.",
      testimonials: [
        { 
          name: 'Ramesh Sharma', 
          role: 'CEO, Siraha Retail', 
          content: 'Tech Procod built our entire marketplace from scratch. Their professional approach and technical depth are unmatched in Nepal.', 
          rating: 5,
          image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop'
        },
        { 
          name: 'Priya Thapa', 
          role: 'Founder, StyleAura', 
          content: 'The UI/UX design they provided was world-class. Our customers love the new experience, and our conversion rate has doubled.', 
          rating: 5,
          image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop'
        },
        { 
          name: 'Bikash Yadav', 
          role: 'Director, RideSewa', 
          content: 'Handling real-time tracking and payments was a challenge, but Tech Procod delivered a flawless solution that scales.', 
          rating: 5,
          image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop'
        },
      ],
    },
  },

  FAQSection: {
    type: 'FAQSection',
    label: 'FAQ Section',
    fields: [
      { key: 'badge', label: 'Badge Text', type: 'text' },
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'subheading', label: 'Subheading', type: 'textarea' },
      {
        key: 'faqs', label: 'FAQs', type: 'array',
        itemSchema: [
          { key: 'q', label: 'Question', type: 'text' },
          { key: 'a', label: 'Answer', type: 'textarea' },
        ],
      },
    ],
    defaultContent: {
      badge: 'FAQ',
      heading: 'Frequently Asked Questions',
      subheading: "Can't find your answer? Contact us and we'll get back to you within 24 hours.",
      faqs: [
        { q: 'How much does a website cost in Nepal?', a: 'A basic business website starts at NPR 30,000. E-commerce stores start at NPR 60,000. Complex web applications are priced based on requirements. We provide a detailed quote after a free consultation.' },
        { q: 'How long does it take to build a website?', a: 'A simple website takes 2-4 weeks. An e-commerce store takes 4-8 weeks. Complex web applications take 2-4 months. We provide a detailed timeline after understanding your requirements.' },
        { q: 'Do you support eSewa and Khalti payments?', a: 'Yes, we have extensive experience integrating eSewa, Khalti, ConnectIPS, and other Nepali payment gateways. We also support international gateways like Stripe and PayPal.' },
        { q: 'Can you build mobile apps for Android and iOS?', a: 'Yes, we build cross-platform mobile apps using React Native that work natively on both Android and iOS from a single codebase, reducing cost and development time.' },
        { q: 'Do you provide hosting and maintenance?', a: 'Yes, we offer managed hosting starting at NPR 3,000/month with 99.9% uptime, SSL, daily backups, and 24/7 monitoring. We also offer monthly maintenance packages.' },
        { q: 'Can you redesign my existing website?', a: 'Absolutely. We can redesign your existing website while preserving your SEO rankings and migrating all your content. We start with a UX audit to identify improvement areas.' },
        { q: 'Do you work with clients outside Siraha?', a: 'Yes, we work with clients across Nepal and internationally. Most of our communication happens via video calls, email, and WhatsApp, so location is not a barrier.' },
        { q: 'What happens after the project is delivered?', a: 'All projects include 1 month of free support after launch. We offer ongoing maintenance packages for bug fixes, updates, and feature additions beyond that period.' },
      ],
    },
  },

  CTASection: {
    type: 'CTASection',
    label: 'CTA Section',
    fields: [
      { key: 'heading', label: 'Heading', type: 'textarea' },
      { key: 'subheading', label: 'Subheading', type: 'textarea' },
      { key: 'primaryCta', label: 'Primary CTA Label', type: 'text' },
      { key: 'primaryHref', label: 'Primary CTA URL', type: 'url' },
      { key: 'secondaryCta', label: 'Secondary CTA Label', type: 'text' },
      { key: 'secondaryHref', label: 'Secondary CTA URL', type: 'url' },
    ],
    defaultContent: {
      heading: 'Ready to Build Something?',
      subheading: "Tell us about your project and we'll get back to you with a free estimate within 24 hours.",
      primaryCta: 'Get a Free Quote',
      primaryHref: '/contact',
      secondaryCta: 'Chat on WhatsApp',
      secondaryHref: 'https://wa.me/9779800000000',
    },
  },

  AboutHero: {
    type: 'AboutHero',
    label: 'About Hero',
    fields: [
      { key: 'badge', label: 'Badge Text', type: 'text' },
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'subheading', label: 'Subheading', type: 'textarea' },
      { key: 'body', label: 'Body Text', type: 'textarea' },
      { key: 'image', label: 'Hero Image URL', type: 'url' },
    ],
    defaultContent: {
      badge: 'Our Identity',
      heading: 'Crafting the Future of Digital Nepal',
      subheading:
        'Tech Procod is a collective of visionary developers and designers based in Siraha, dedicated to elevating the digital landscape of our nation.',
      body: 'We believe that technology should be a catalyst for growth. Our mission is to provide businesses with the tools they need to thrive in an increasingly digital world, combining global standards with local insights.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
    },
  },

  Stats: {
    type: 'Stats',
    label: 'Stats',
    fields: [
      {
        key: 'stats', label: 'Stats', type: 'array',
        itemSchema: [
          { key: 'value', label: 'Value', type: 'text' },
          { key: 'label', label: 'Label', type: 'text' },
        ],
      },
    ],
    defaultContent: {
      stats: [
        { value: '50+', label: 'Projects Delivered' },
        { value: '40+', label: 'Happy Clients' },
        { value: '15+', label: 'Team Members' },
        { value: '3+', label: 'Years Experience' },
      ],
    },
  },

  MissionVision: {
    type: 'MissionVision',
    label: 'Mission & Vision',
    fields: [
      {
        key: 'items', label: 'Items', type: 'array',
        itemSchema: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'desc', label: 'Description', type: 'textarea' },
        ],
      },
    ],
    defaultContent: {
      items: [
        { title: 'Our Mission', desc: "To empower Nepali businesses with cutting-edge digital solutions that are affordable, scalable, and built to last. We bridge the gap between global technology standards and local business needs." },
        { title: 'Our Vision', desc: "To become Nepal's most trusted technology company by 2030 — creating digital products that put Nepal on the global tech map and drive economic growth." },
        { title: 'Our Values', desc: "Quality over quantity. Transparency in every interaction. Innovation that solves real problems. And an unwavering commitment to our clients' success." },
      ],
    },
  },

  Values: {
    type: 'Values',
    label: 'Values',
    fields: [
      { key: 'badge', label: 'Badge Text', type: 'text' },
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'subheading', label: 'Subheading', type: 'textarea' },
      {
        key: 'values', label: 'Values', type: 'array',
        itemSchema: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'desc', label: 'Description', type: 'textarea' },
        ],
      },
    ],
    defaultContent: {
      badge: 'Our Values',
      heading: 'What We Stand For',
      subheading: 'The principles that guide every project and every decision we make.',
      values: [
        { title: 'Quality First', desc: 'We never compromise on code quality, design standards, or delivery timelines.' },
        { title: 'Client-Centric', desc: 'Every decision we make is guided by what delivers the most value to our clients.' },
        { title: 'Innovation', desc: "We stay ahead of technology trends to bring modern solutions to Nepali businesses." },
        { title: 'Transparency', desc: 'Honest communication, clear pricing, and no hidden surprises — ever.' },
        { title: 'Local Expertise', desc: "Deep understanding of Nepal's market, payment systems, and business culture." },
        { title: 'Long-term Partnership', desc: 'We build lasting relationships, not just one-time projects.' },
      ],
    },
  },

  Timeline: {
    type: 'Timeline',
    label: 'Timeline',
    fields: [
      { key: 'badge', label: 'Badge Text', type: 'text' },
      { key: 'heading', label: 'Heading', type: 'text' },
      {
        key: 'milestones', label: 'Milestones', type: 'array',
        itemSchema: [
          { key: 'year', label: 'Year', type: 'text' },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'desc', label: 'Description', type: 'textarea' },
        ],
      },
    ],
    defaultContent: {
      badge: 'Our Journey',
      heading: 'Company Timeline',
      milestones: [
        { year: '2019', title: 'Company Founded', desc: "Tech Procod was established in Siraha with a vision to digitize Nepal's businesses." },
        { year: '2020', title: 'First Major Project', desc: 'Delivered our first e-commerce platform, serving 500+ customers in Siraha district.' },
        { year: '2021', title: 'Team Expansion', desc: 'Grew to a team of 5 developers and launched our mobile app development service.' },
        { year: '2022', title: 'RideSewa Launch', desc: "Launched Nepal's smart ride-sharing platform, RideSewa, in Siraha." },
        { year: '2023', title: 'AI Integration', desc: 'Added AI-powered features to our service portfolio, including chatbots and recommendation engines.' },
        { year: '2024', title: '50+ Projects', desc: 'Crossed 50 successful project deliveries with clients across Nepal and internationally.' },
      ],
    },
  },

  TeamSection: {
    type: 'TeamSection',
    label: 'Team Section',
    fields: [
      { key: 'badge', label: 'Badge Text', type: 'text' },
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'subheading', label: 'Subheading', type: 'textarea' },
      {
        key: 'team', label: 'Team Members', type: 'array',
        itemSchema: [
          { key: 'name', label: 'Name', type: 'text' },
          { key: 'role', label: 'Role', type: 'text' },
          { key: 'bio', label: 'Bio', type: 'textarea' },
          { key: 'image', label: 'Avatar URL', type: 'url' },
          {
            key: 'socials', label: 'Social Links', type: 'object',
            fields: [
              { key: 'linkedin', label: 'LinkedIn URL', type: 'url' },
              { key: 'twitter', label: 'Twitter URL', type: 'url' },
              { key: 'website', label: 'Website URL', type: 'url' },
              { key: 'github', label: 'GitHub URL', type: 'url' },
            ],
          },
        ],
      },
    ],
    defaultContent: {
      badge: 'Expert Team',
      heading: 'The Minds Behind the Magic',
      subheading: 'A dedicated team of developers and designers committed to excellence.',
      team: [
        { 
          name: 'Founder / CEO', 
          role: 'Full Stack Visionary', 
          bio: 'Leading Tech Procod with a passion for building digital solutions that matter for Nepal.',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
          socials: { linkedin: '#', twitter: '#', github: '#' }
        },
        { 
          name: 'Co-Founder', 
          role: 'Backend Architect', 
          bio: 'Expert in Laravel, Node.js, and scalable system architecture.',
          image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop',
          socials: { linkedin: '#', twitter: '#', github: '#' }
        },
        { 
          name: 'UI/UX Designer', 
          role: 'Product Designer', 
          bio: 'Crafting beautiful, intuitive interfaces that users love.',
          image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop',
          socials: { linkedin: '#', twitter: '#', github: '#' }
        },
      ],
    },
  },

  ServicesHero: {
    type: 'ServicesHero',
    label: 'Services Hero',
    fields: [
      { key: 'badge', label: 'Badge Text', type: 'text' },
      { key: 'heading', label: 'Heading', type: 'textarea' },
      { key: 'subheading', label: 'Subheading', type: 'textarea' },
    ],
    defaultContent: {
      badge: 'Services',
      heading: 'What We Offer',
      subheading: 'From idea to launch — end-to-end digital services tailored for your business.',
    },
  },

  ServicesList: {
    type: 'ServicesList',
    label: 'Services List',
    fields: [
      {
        key: 'services', label: 'Services', type: 'array',
        itemSchema: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'desc', label: 'Description', type: 'textarea' },
          {
            key: 'features', label: 'Features', type: 'array',
            itemSchema: [{ key: 'name', label: 'Feature', type: 'text' }],
          },
        ],
      },
    ],
    defaultContent: {
      services: [
        { title: 'Web Development', desc: 'Fast, modern, and scalable web applications using React, Next.js, and Laravel. From landing pages to complex platforms.', features: [{ name: 'React / Next.js' }, { name: 'Laravel Backend' }, { name: 'REST & GraphQL APIs' }, { name: 'SEO Optimized' }, { name: 'Performance Tuned' }] },
        { title: 'Mobile App Development', desc: 'Cross-platform mobile apps built with React Native that feel native on both Android and iOS.', features: [{ name: 'React Native' }, { name: 'Android & iOS' }, { name: 'Push Notifications' }, { name: 'Offline Support' }, { name: 'App Store Deployment' }] },
        { title: 'E-commerce Solutions', desc: 'Complete online stores with product management, cart, checkout, and payment integration.', features: [{ name: 'Product Management' }, { name: 'eSewa / Khalti' }, { name: 'Order Tracking' }, { name: 'Inventory System' }, { name: 'Analytics Dashboard' }] },
        { title: 'UI/UX Design', desc: 'Beautiful, intuitive interfaces designed in Figma and brought to life with clean code.', features: [{ name: 'Figma Design' }, { name: 'Prototyping' }, { name: 'User Research' }, { name: 'Design Systems' }, { name: 'Responsive Layouts' }] },
        { title: 'AI Integration', desc: 'Add intelligence to your products with AI-powered chatbots, recommendations, and automation.', features: [{ name: 'AI Chatbots' }, { name: 'Recommendations' }, { name: 'Image Recognition' }, { name: 'Process Automation' }, { name: 'OpenAI Integration' }] },
        { title: 'Ride Sharing Systems', desc: 'Complete ride-hailing platforms with real-time GPS tracking, driver management, and digital payments.', features: [{ name: 'Real-time GPS' }, { name: 'Driver App' }, { name: 'Passenger App' }, { name: 'Fare Engine' }, { name: 'Payment Integration' }] },
        { title: 'Hotel Booking Systems', desc: 'Full-featured hotel management platforms with room booking, availability calendar, and revenue analytics.', features: [{ name: 'Room Management' }, { name: 'Online Booking' }, { name: 'Guest Portal' }, { name: 'Revenue Reports' }, { name: 'Channel Manager' }] },
        { title: 'Payment Gateway', desc: "Secure payment integration with Nepal's leading gateways and international processors.", features: [{ name: 'eSewa' }, { name: 'Khalti' }, { name: 'ConnectIPS' }, { name: 'Stripe' }, { name: 'PayPal' }] },
        { title: 'SEO & Digital Marketing', desc: 'Data-driven SEO strategies and digital marketing to grow your online presence.', features: [{ name: 'On-page SEO' }, { name: 'Technical SEO' }, { name: 'Content Strategy' }, { name: 'Social Media' }, { name: 'Google Ads' }] },
        { title: 'Hosting Services', desc: 'Reliable, fast, and secure hosting with 99.9% uptime SLA and 24/7 monitoring.', features: [{ name: 'VPS Hosting' }, { name: 'SSL Certificates' }, { name: 'Daily Backups' }, { name: 'CDN Setup' }, { name: '24/7 Monitoring' }] },
        { title: 'Custom Software', desc: 'Tailor-made software solutions built specifically for your unique business requirements.', features: [{ name: 'Requirements Analysis' }, { name: 'Custom Architecture' }, { name: 'API Development' }, { name: 'Integration' }, { name: 'Maintenance' }] },
        { title: 'Analytics & Reporting', desc: 'Custom dashboards and reporting tools that give you real-time insights into your business.', features: [{ name: 'Custom Dashboards' }, { name: 'Real-time Data' }, { name: 'Google Analytics' }, { name: 'Business Reports' }, { name: 'KPI Tracking' }] },
      ],
    },
  },

  ProcessSection: {
    type: 'ProcessSection',
    label: 'Process Section',
    fields: [
      { key: 'badge', label: 'Badge Text', type: 'text' },
      { key: 'heading', label: 'Heading', type: 'text' },
      {
        key: 'steps', label: 'Steps', type: 'array',
        itemSchema: [
          { key: 'step', label: 'Step Number', type: 'text' },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'desc', label: 'Description', type: 'textarea' },
        ],
      },
    ],
    defaultContent: {
      badge: 'How We Work',
      heading: 'Our Process',
      steps: [
        { step: '01', title: 'Discovery Call', desc: 'Free consultation to understand your goals, requirements, and vision.' },
        { step: '02', title: 'Proposal & Planning', desc: 'Detailed project proposal with timeline, tech stack, and cost breakdown.' },
        { step: '03', title: 'Design & Development', desc: 'We design and build your product with regular updates and demos.' },
        { step: '04', title: 'Testing & Launch', desc: 'Thorough QA testing followed by a smooth deployment to production.' },
        { step: '05', title: 'Support & Growth', desc: 'Ongoing maintenance, updates, and support to keep your product running.' },
      ],
    },
  },

  PortfolioHero: {
    type: 'PortfolioHero',
    label: 'Portfolio Hero',
    fields: [
      { key: 'badge', label: 'Badge Text', type: 'text' },
      { key: 'heading', label: 'Heading', type: 'textarea' },
      { key: 'subheading', label: 'Subheading', type: 'textarea' },
    ],
    defaultContent: {
      badge: 'Portfolio',
      heading: 'Our Work',
      subheading: 'Real products, real impact. Digital solutions we\'ve built for businesses across Nepal.',
    },
  },

  ProjectsGrid: {
    type: 'ProjectsGrid',
    label: 'Projects Grid',
    fields: [
      {
        key: 'categories', label: 'Filter Categories', type: 'array',
        itemSchema: [{ key: 'name', label: 'Category', type: 'text' }],
      },
      {
        key: 'projects', label: 'Projects', type: 'array',
        itemSchema: [
          { key: 'id', label: 'ID (slug)', type: 'text' },
          { key: 'name', label: 'Name', type: 'text' },
          { key: 'category', label: 'Category', type: 'text' },
          { key: 'desc', label: 'Description', type: 'textarea' },
        ],
      },
    ],
    defaultContent: {
      categories: [
        { name: 'All' },
        { name: 'Web App' },
        { name: 'Mobile App' },
        { name: 'E-commerce' },
        { name: 'Platform' },
      ],
      projects: [
        { id: 'styleaura', name: 'StyleAura', category: 'E-commerce', desc: 'Fashion e-commerce with AI style recommendations, virtual try-on, and seamless checkout.' },
        { id: 'ridesewa', name: 'RideSewa', category: 'Mobile App', desc: "Nepal's ride-hailing app with real-time GPS tracking, driver management, and digital payments." },
        { id: 'hotelsewa', name: 'HotelSewa', category: 'Web App', desc: 'Complete hotel management and booking platform with reservations, guest portal, and analytics.' },
        { id: 'sirahababazaar', name: 'Siraha Bazaar', category: 'E-commerce', desc: 'Hyperlocal marketplace connecting buyers and sellers in Siraha with delivery tracking.' },
        { id: 'schoolpro', name: 'SchoolPro', category: 'Web App', desc: 'School management system with student records, attendance, grades, and parent portal.' },
        { id: 'foodrun', name: 'FoodRun', category: 'Mobile App', desc: 'Food delivery platform connecting restaurants with customers, with real-time order tracking.' },
      ],
    },
  },

  ProductsHero: {
    type: 'ProductsHero',
    label: 'Products Hero',
    fields: [
      { key: 'badge', label: 'Badge Text', type: 'text' },
      { key: 'heading', label: 'Heading', type: 'textarea' },
      { key: 'subheading', label: 'Subheading', type: 'textarea' },
    ],
    defaultContent: {
      badge: 'Products',
      heading: 'Ready-Made Solutions',
      subheading: 'Battle-tested software products ready to deploy for your business. Get started fast.',
    },
  },

  ProductsList: {
    type: 'ProductsList',
    label: 'Products List',
    fields: [
      {
        key: 'products', label: 'Products', type: 'array',
        itemSchema: [
          { key: 'id', label: 'ID (slug)', type: 'text' },
          { key: 'name', label: 'Name', type: 'text' },
          { key: 'tagline', label: 'Tagline', type: 'text' },
          { key: 'desc', label: 'Description', type: 'textarea' },
          { key: 'starter', label: 'Starter Price', type: 'text' },
          { key: 'pro', label: 'Pro Price', type: 'text' },
          { key: 'badge', label: 'Badge (optional)', type: 'text' },
        ],
      },
    ],
    defaultContent: {
      products: [
        { id: 'pos', name: 'POS System', tagline: 'Smart Point of Sale', desc: 'Complete point-of-sale for retail shops and restaurants. Manage sales, inventory, and reports from one dashboard.', starter: 'NPR 5,000/mo', pro: 'NPR 10,000/mo', badge: 'Popular' },
        { id: 'hotel', name: 'Hotel Management System', tagline: 'Complete Hotel Operations', desc: 'Manage your hotel end-to-end — bookings, room management, housekeeping, billing, and guest analytics.', starter: 'NPR 8,000/mo', pro: 'NPR 15,000/mo', badge: 'Featured' },
        { id: 'delivery', name: 'Delivery Management System', tagline: 'End-to-End Delivery Platform', desc: 'Complete delivery management with order tracking, driver assignment, route optimization, and notifications.', starter: 'NPR 7,000/mo', pro: 'NPR 12,000/mo', badge: '' },
        { id: 'school', name: 'School Management System', tagline: 'Digital School Administration', desc: 'Comprehensive school management covering student records, attendance, grades, fee collection, and parent communication.', starter: 'NPR 6,000/mo', pro: 'NPR 11,000/mo', badge: '' },
        { id: 'ecommerce', name: 'E-commerce Platform', tagline: 'Launch Your Online Store', desc: 'Fully-featured e-commerce with product management, cart, checkout, payment integration, and seller dashboard.', starter: 'NPR 9,000/mo', pro: 'NPR 18,000/mo', badge: 'New' },
      ],
    },
  },

  BlogHero: {
    type: 'BlogHero',
    label: 'Blog Hero',
    fields: [
      { key: 'badge', label: 'Badge Text', type: 'text' },
      { key: 'heading', label: 'Heading', type: 'textarea' },
      { key: 'subheading', label: 'Subheading', type: 'textarea' },
    ],
    defaultContent: {
      badge: 'Blog',
      heading: 'Insights & Updates',
      subheading: 'Tech articles, tutorials, company news, and insights from the Tech Procod team.',
    },
  },

  BlogGrid: {
    type: 'BlogGrid',
    label: 'Blog Grid',
    fields: [
      {
        key: 'posts', label: 'Blog Posts', type: 'array',
        itemSchema: [
          { key: 'slug', label: 'Slug', type: 'text' },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'excerpt', label: 'Excerpt', type: 'textarea' },
          { key: 'category', label: 'Category', type: 'text' },
          { key: 'date', label: 'Date', type: 'text' },
          { key: 'readTime', label: 'Read Time', type: 'text' },
        ],
      },
    ],
    defaultContent: {
      posts: [
        { slug: 'building-ride-sharing-app-nepal', title: 'How We Built a Ride-Sharing App for Nepal', excerpt: 'A deep dive into the technical challenges and solutions we encountered while building RideSewa — Nepal\'s smart ride-hailing platform.', category: 'Case Study', date: 'Dec 15, 2024', readTime: '8 min read' },
        { slug: 'nextjs-vs-laravel-nepal', title: 'Next.js + Laravel: The Perfect Stack for Nepal', excerpt: 'Why we chose Next.js for the frontend and Laravel for the backend, and how this combination delivers the best results for our clients.', category: 'Tech', date: 'Dec 10, 2024', readTime: '6 min read' },
        { slug: 'ai-integration-nepali-business', title: 'AI Integration for Nepali Businesses in 2025', excerpt: 'How small and medium businesses in Nepal can leverage AI to automate processes, improve customer service, and drive growth.', category: 'AI', date: 'Dec 5, 2024', readTime: '5 min read' },
        { slug: 'esewa-khalti-integration-guide', title: 'Complete Guide to eSewa & Khalti Integration', excerpt: "Step-by-step guide to integrating Nepal's most popular payment gateways into your web or mobile application.", category: 'Tutorial', date: 'Nov 28, 2024', readTime: '10 min read' },
        { slug: 'mobile-first-design-nepal', title: 'Why Mobile-First Design Matters in Nepal', excerpt: "With 80%+ of Nepal's internet users on mobile, here's why mobile-first design is not optional — it's essential.", category: 'Design', date: 'Nov 20, 2024', readTime: '4 min read' },
        { slug: 'techprocod-2024-year-review', title: 'Tech Procod 2024: Year in Review', excerpt: "Looking back at our biggest milestones, projects, and lessons learned in 2024 — and what's coming in 2025.", category: 'Company', date: 'Nov 15, 2024', readTime: '7 min read' },
      ],
    },
  },

  CareersHero: {
    type: 'CareersHero',
    label: 'Careers Hero',
    fields: [
      { key: 'badge', label: 'Badge Text', type: 'text' },
      { key: 'heading', label: 'Heading', type: 'textarea' },
      { key: 'subheading', label: 'Subheading', type: 'textarea' },
    ],
    defaultContent: {
      badge: 'Careers',
      heading: 'Build the Future With Us',
      subheading: "We're always looking for talented developers, designers, and digital strategists passionate about building great products.",
    },
  },

  JobListings: {
    type: 'JobListings',
    label: 'Job Listings',
    fields: [
      {
        key: 'jobs', label: 'Jobs (fallback)', type: 'array',
        itemSchema: [
          { key: 'id', label: 'ID', type: 'text' },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'type', label: 'Type', type: 'text' },
          { key: 'location', label: 'Location', type: 'text' },
          { key: 'experience', label: 'Experience', type: 'text' },
          { key: 'skills', label: 'Skills (comma-separated)', type: 'text' },
          { key: 'desc', label: 'Description', type: 'textarea' },
        ],
      },
    ],
    defaultContent: {
      jobs: [
        { id: '1', title: 'Full Stack Developer', type: 'Full-time', location: 'Siraha / Remote', experience: '2+ years', skills: 'React, Laravel, MySQL, REST APIs', desc: 'Build and maintain web applications for our clients.' },
        { id: '2', title: 'React Native Developer', type: 'Full-time', location: 'Siraha / Remote', experience: '1+ years', skills: 'React Native, JavaScript, Firebase', desc: 'Develop cross-platform mobile applications.' },
        { id: '3', title: 'UI/UX Designer', type: 'Full-time', location: 'Siraha / Remote', experience: '1+ years', skills: 'Figma, Prototyping, User Research', desc: 'Design beautiful, user-centered interfaces.' },
        { id: '4', title: 'Web Development Intern', type: 'Internship', location: 'Siraha', experience: 'Fresher', skills: 'HTML/CSS, JavaScript, Basic React', desc: '3-month paid internship for students.' },
      ],
    },
  },
};

// ---------------------------------------------------------------------------
// PAGE_SECTIONS — ordered section type arrays per page
// ---------------------------------------------------------------------------

export const PAGE_SECTIONS: Record<PageId, string[]> = {
  home:      ['HeroSection', 'ClientLogos', 'ServicesOverview', 'FeaturedProjects', 'TechStack', 'Testimonials', 'FAQSection', 'CTASection'],
  about:     ['AboutHero', 'Stats', 'MissionVision', 'Values', 'Timeline', 'TeamSection', 'CTASection'],
  services:  ['ServicesHero', 'ServicesList', 'ProcessSection', 'CTASection'],
  portfolio: ['PortfolioHero', 'ProjectsGrid', 'CTASection'],
  products:  ['ProductsHero', 'ProductsList', 'CTASection'],
  blog:      ['BlogHero', 'BlogGrid'],
  careers:   ['CareersHero', 'JobListings'],
};

// ---------------------------------------------------------------------------
// DEFAULT_SECTIONS — pre-built Section[] per page from the registry
// ---------------------------------------------------------------------------

export const DEFAULT_SECTIONS: Record<PageId, Section[]> = (
  Object.keys(PAGE_SECTIONS) as PageId[]
).reduce<Record<PageId, Section[]>>((acc, pageId) => {
  acc[pageId] = PAGE_SECTIONS[pageId].map((type, index) => ({
    id: `${pageId}-${type.toLowerCase()}-${index + 1}`,
    type,
    order: index,
    visible: true,
    content: { ...(SECTION_DEFINITIONS[type]?.defaultContent ?? {}) },
  }));
  return acc;
}, {} as Record<PageId, Section[]>);
