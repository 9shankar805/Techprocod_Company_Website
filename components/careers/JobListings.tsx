import Link from "next/link";
import { MapPin, Clock, ArrowRight } from "lucide-react";

const jobs = [
  {
    title: "Full Stack Developer", type: "Full-time", location: "Siraha / Remote", experience: "2+ years",
    skills: ["React", "Laravel", "MySQL", "REST APIs"],
    desc: "Build and maintain web applications for our clients. Strong knowledge of React and Laravel required.",
    isInternship: false,
  },
  {
    title: "React Native Developer", type: "Full-time", location: "Siraha / Remote", experience: "1+ years",
    skills: ["React Native", "JavaScript", "Firebase", "REST APIs"],
    desc: "Develop cross-platform mobile applications for Android and iOS using React Native.",
    isInternship: false,
  },
  {
    title: "UI/UX Designer", type: "Full-time", location: "Siraha / Remote", experience: "1+ years",
    skills: ["Figma", "Prototyping", "User Research", "Design Systems"],
    desc: "Design beautiful, user-centered interfaces for web and mobile applications.",
    isInternship: false,
  },
  {
    title: "SEO & Digital Marketing Specialist", type: "Full-time", location: "Siraha", experience: "1+ years",
    skills: ["SEO", "Google Analytics", "Content Marketing", "Social Media"],
    desc: "Drive organic growth and digital visibility for Tech Procod and our clients.",
    isInternship: false,
  },
  {
    title: "Web Development Intern", type: "Internship", location: "Siraha", experience: "Fresher",
    skills: ["HTML/CSS", "JavaScript", "Basic React or PHP"],
    desc: "3-month paid internship for students passionate about web development.",
    isInternship: true,
  },
  {
    title: "Graphic Design Intern", type: "Internship", location: "Siraha / Remote", experience: "Fresher",
    skills: ["Figma", "Adobe XD", "Canva"],
    desc: "3-month internship for design students. Work on real client projects.",
    isInternship: true,
  },
];

export default function JobListings() {
  const fullTime = jobs.filter((j) => !j.isInternship);
  const internships = jobs.filter((j) => j.isInternship);

  return (
    <section className="section">
      <div className="container">
        {/* Full-time */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 24 }}>Open Positions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {fullTime.map(({ title, type, location, experience, skills, desc }) => (
              <div key={title} className="card" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827" }}>{title}</h3>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#2563eb", background: "#eff6ff", padding: "2px 8px", borderRadius: 100 }}>{type}</span>
                  </div>
                  <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 10 }}>{desc}</p>
                  <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#9ca3af", marginBottom: 10 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={12} />{location}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} />{experience}</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {skills.map((s) => (
                      <span key={s} style={{ fontSize: 12, color: "#6b7280", background: "#f3f4f6", padding: "3px 10px", borderRadius: 100 }}>{s}</span>
                    ))}
                  </div>
                </div>
                <Link href="/contact" className="btn-outline" style={{ fontSize: 13, padding: "8px 16px", flexShrink: 0 }}>
                  Apply <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Internships */}
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 24 }}>Internship Opportunities</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {internships.map(({ title, type, location, experience, skills, desc }) => (
              <div key={title} className="card" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827" }}>{title}</h3>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#d97706", background: "#fffbeb", padding: "2px 8px", borderRadius: 100 }}>{type}</span>
                  </div>
                  <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 10 }}>{desc}</p>
                  <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#9ca3af", marginBottom: 10 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={12} />{location}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} />{experience}</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {skills.map((s) => (
                      <span key={s} style={{ fontSize: 12, color: "#6b7280", background: "#f3f4f6", padding: "3px 10px", borderRadius: 100 }}>{s}</span>
                    ))}
                  </div>
                </div>
                <Link href="/contact" className="btn-outline" style={{ fontSize: 13, padding: "8px 16px", flexShrink: 0 }}>
                  Apply <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
