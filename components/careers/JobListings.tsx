"use client";
import { useState, useEffect } from "react";
import { MapPin, Clock, ArrowRight, X, Send } from "lucide-react";

type Job = { id: string; title: string; type: string; location: string; experience: string; skills: string; desc: string; status: string };

const typeColor: Record<string, { bg: string; color: string }> = {
  "Full-time": { bg: "#eff6ff", color: "#2563eb" },
  "Part-time": { bg: "#f0fdf4", color: "#059669" },
  Internship:  { bg: "#fffbeb", color: "#d97706" },
  Contract:    { bg: "#faf5ff", color: "#7c3aed" },
};

const FALLBACK: Job[] = [
  { id: "1", title: "Full Stack Developer", type: "Full-time", location: "Siraha / Remote", experience: "2+ years", skills: "React, Laravel, MySQL, REST APIs", desc: "Build and maintain web applications for our clients.", status: "Open" },
  { id: "2", title: "React Native Developer", type: "Full-time", location: "Siraha / Remote", experience: "1+ years", skills: "React Native, JavaScript, Firebase", desc: "Develop cross-platform mobile applications.", status: "Open" },
  { id: "3", title: "UI/UX Designer", type: "Full-time", location: "Siraha / Remote", experience: "1+ years", skills: "Figma, Prototyping, User Research", desc: "Design beautiful, user-centered interfaces.", status: "Open" },
  { id: "4", title: "Web Development Intern", type: "Internship", location: "Siraha", experience: "Fresher", skills: "HTML/CSS, JavaScript, Basic React", desc: "3-month paid internship for students.", status: "Open" },
];

interface JobListingsProps { content?: Record<string, unknown> }

export default function JobListings({ content: _content }: JobListingsProps = {}) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applyJob, setApplyJob] = useState<Job | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", experience: "", coverLetter: "", portfolio: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch("/api/admin/jobs").then(r => r.json()).then(d => {
      const open = Array.isArray(d) ? d.filter((j: Job) => j.status === "Open") : [];
      setJobs(open.length > 0 ? open : FALLBACK);
    }).catch(() => setJobs(FALLBACK));
  }, []);

  const openApply = (job: Job) => {
    setApplyJob(job);
    setForm({ name: "", email: "", phone: "", experience: "", coverLetter: "", portfolio: "" });
    setSubmitted(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyJob) return;
    setSubmitting(true);
    await fetch("/api/admin/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, jobTitle: applyJob.title, jobId: applyJob.id }),
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  const fullTime = jobs.filter(j => j.type !== "Internship");
  const internships = jobs.filter(j => j.type === "Internship");

  const JobCard = ({ job }: { job: Job }) => {
    const tc = typeColor[job.type] ?? { bg: "#f3f4f6", color: "#374151" };
    return (
      <div className="card" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827" }}>{job.title}</h3>
            <span style={{ fontSize: 11, fontWeight: 600, color: tc.color, background: tc.bg, padding: "2px 8px", borderRadius: 100 }}>{job.type}</span>
          </div>
          <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 10 }}>{job.desc}</p>
          <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#9ca3af", marginBottom: 10 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={12} />{job.location}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} />{job.experience}</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {job.skills.split(",").map(s => (
              <span key={s} style={{ fontSize: 12, color: "#6b7280", background: "#f3f4f6", padding: "3px 10px", borderRadius: 100 }}>{s.trim()}</span>
            ))}
          </div>
        </div>
        <button onClick={() => openApply(job)} className="btn-outline" style={{ fontSize: 13, padding: "8px 16px", flexShrink: 0 }}>
          Apply <ArrowRight size={13} />
        </button>
      </div>
    );
  };

  return (
    <section className="section">
      <div className="container">
        {fullTime.length > 0 && (
          <div style={{ marginBottom: 56 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 24 }}>Open Positions</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {fullTime.map(j => <JobCard key={j.id} job={j} />)}
            </div>
          </div>
        )}
        {internships.length > 0 && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 24 }}>Internship Opportunities</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {internships.map(j => <JobCard key={j.id} job={j} />)}
            </div>
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {applyJob && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 28, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>Apply for {applyJob.title}</h2>
                <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{applyJob.type} · {applyJob.location}</p>
              </div>
              <button onClick={() => setApplyJob(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={18} /></button>
            </div>

            {submitted ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>🎉</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Application Submitted!</h3>
                <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>We&apos;ll review your application and get back to you within 3-5 business days.</p>
                <button onClick={() => setApplyJob(null)} className="btn-primary" style={{ justifyContent: "center" }}>Close</button>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: "#6b7280", display: "block", marginBottom: 5 }}>Full Name *</label>
                    <input required placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: "#6b7280", display: "block", marginBottom: 5 }}>Email *</label>
                    <input required type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: "#6b7280", display: "block", marginBottom: 5 }}>Phone</label>
                    <input placeholder="+977-98XXXXXXXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: "#6b7280", display: "block", marginBottom: 5 }}>Experience</label>
                    <input placeholder="e.g. 2 years" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "#6b7280", display: "block", marginBottom: 5 }}>Portfolio / GitHub URL</label>
                  <input type="url" placeholder="https://github.com/..." value={form.portfolio} onChange={e => setForm({ ...form, portfolio: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "#6b7280", display: "block", marginBottom: 5 }}>Cover Letter</label>
                  <textarea rows={4} placeholder="Tell us why you're a great fit..." value={form.coverLetter} onChange={e => setForm({ ...form, coverLetter: e.target.value })} style={{ resize: "vertical" }} />
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  <button type="button" onClick={() => setApplyJob(null)} className="btn-outline" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>Cancel</button>
                  <button type="submit" disabled={submitting} className="btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>
                    <Send size={14} /> {submitting ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
