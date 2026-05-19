"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Globe, Code, Send, ExternalLink } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';

const defaultTeam = [
  { 
    name: "Founder / CEO", 
    role: "Full Stack Developer & Visionary", 
    initials: "TP", 
    bio: "Leading Tech Procod with a passion for building digital solutions that matter for Nepal.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
    socials: { linkedin: "#", twitter: "#", github: "#" }
  },
  { 
    name: "Co-Founder", 
    role: "Backend & API Architect", 
    initials: "LD", 
    bio: "Expert in Laravel, Node.js, and scalable system architecture.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop",
    socials: { linkedin: "#", twitter: "#", github: "#" }
  },
  { 
    name: "UI/UX Designer", 
    role: "Product Designer", 
    initials: "UX", 
    bio: "Crafting beautiful, intuitive interfaces that users love.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
    socials: { linkedin: "#", twitter: "#", github: "#" }
  },
  { 
    name: "Mobile Lead", 
    role: "React Native Specialist", 
    initials: "ML", 
    bio: "Building cross-platform mobile apps with native performance.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop",
    socials: { linkedin: "#", github: "#" }
  },
];

const defaults = {
  badge: "The Team",
  heading: "Meet the People",
  subheading: "Builders, designers, and strategists working together to create great products.",
};

interface TeamMember {
  name: string;
  role: string;
  initials: string;
  bio: string;
  image?: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
}

interface TeamSectionProps {
  badge?: string;
  heading?: string;
  subheading?: string;
  team?: TeamMember[];
}

export default function TeamSection({
  badge,
  heading,
  subheading,
  team: customTeam,
}: TeamSectionProps) {
  const data = {
    badge: badge ?? defaults.badge,
    heading: heading ?? defaults.heading,
    subheading: subheading ?? defaults.subheading,
  };

  const team =
    Array.isArray(customTeam) && customTeam.length > 0
      ? customTeam
      : defaultTeam;

  return (
    <section id="team" className="section" style={{ background: "#f8fafc", overflow: "hidden" }}>
      <div className="container">
        <div style={{ marginBottom: 48, textAlign: "center" }}>
          <span className="badge" style={{ margin: "0 auto 12px" }}>{data.badge}</span>
          <h2 className="section-title">{data.heading}</h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>{data.subheading}</p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          style={{ paddingBottom: 50 }}
        >
          {team.map(({ name, role, initials, bio, image, socials }) => (
            <SwiperSlide key={name}>
              <div className="card" style={{ textAlign: "center", padding: 32, height: "100%", display: "flex", flexDirection: "column" }}>
                <div style={{ position: "relative", width: 100, height: 100, margin: "0 auto 20px" }}>
                  {image ? (
                    <img 
                      src={image} 
                      alt={name} 
                      style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "4px solid #fff", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }} 
                    />
                  ) : (
                    <div style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      background: "#eff6ff",
                      color: "#2563eb",
                      fontWeight: 700,
                      fontSize: 24,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      {initials}
                    </div>
                  )}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>{name}</h3>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#2563eb", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>{role}</p>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, marginBottom: 20, flex: 1 }}>{bio}</p>
                
                {/* Social Handles */}
                <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: "auto" }}>
                  {socials?.linkedin && (
                    <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn" className="text-slate-400 hover:text-blue-600 transition-colors">
                      <ExternalLink size={18} />
                    </a>
                  )}
                  {socials?.twitter && (
                    <a href={socials.twitter} target="_blank" rel="noopener noreferrer" title="Twitter" className="text-slate-400 hover:text-blue-400 transition-colors">
                      <Send size={18} />
                    </a>
                  )}
                  {socials?.github && (
                    <a href={socials.github} target="_blank" rel="noopener noreferrer" title="GitHub" className="text-slate-400 hover:text-slate-900 transition-colors">
                      <Code size={18} />
                    </a>
                  )}
                  {socials?.website && (
                    <a href={socials.website} target="_blank" rel="noopener noreferrer" title="Website" className="text-slate-400 hover:text-blue-700 transition-colors">
                      <Globe size={18} />
                    </a>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .swiper-pagination-bullet-active {
          background: #2563eb !important;
        }
      `}</style>
    </section>
  );
}
