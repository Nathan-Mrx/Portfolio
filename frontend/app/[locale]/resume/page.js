'use client';

import { useState, useEffect, use } from 'react';
import { Printer, Download, Mail, Phone, ExternalLink, MapPin, Globe, Briefcase, GraduationCap, Code } from 'lucide-react';

export default function ResumePage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const { locale } = params;
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/profiles`)
            .then(res => res.json())
            .then(data => {
                const members = data['hydra:member'] || data['member'] || [];
                if (members.length > 0) setProfile(members[0]);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="loading-state">DECRYPTING_RESUME_DATA...</div>;

    const resume = profile?.resumeData || { experience: [], education: [], skills: [] };
    const jobTitle = profile ? (locale === 'fr' ? profile.jobTitleFr : profile.jobTitleEn) : 'Game Developer';

    const handlePrint = () => {
        window.print();
    };

    return (
        <main className="resume-page">
            <div className="container resume-wrapper">
                {/* PDF/Print Controls (Hidden on Print) */}
                <div className="resume-controls no-print">
                    <button onClick={handlePrint} className="cyber-btn primary">
                        <Printer size={18} /> <span>PRINT_RESUME</span>
                    </button>
                    <div className="controls-hint">
                        <Info size={14} />
                        <span>Exports as professional white-background PDF</span>
                    </div>
                </div>

                <div className="resume-document hud-glass printable-area">
                    {/* Header Section */}
                    <header className="resume-header">
                        <div className="header-main">
                            <h1 className="name">NATHAN <span className="neon-text">MRX</span></h1>
                            <h2 className="title">{jobTitle}</h2>
                        </div>
                        <div className="contact-grid">
                            <div className="contact-item">
                                <Mail size={14} className="neon-text no-print" />
                                <span>{profile?.email || 'contact@nathan-mrx.dev'}</span>
                            </div>
                            <div className="contact-item">
                                <Globe size={14} className="neon-text no-print" />
                                <span>nathan-mrx.dev</span>
                            </div>
                            <div className="contact-item">
                                <MapPin size={14} className="neon-text no-print" />
                                <span>Montreal, QC</span>
                            </div>
                        </div>
                    </header>

                    <div className="resume-body">
                        {/* Summary / About */}
                        <section className="resume-section">
                            <h3 className="section-title"><span className="caret">{'>'}</span> PROFILE_SUMMARY</h3>
                            <p className="summary-text">
                                {locale === 'fr' ? profile?.aboutFr : profile?.aboutEn}
                            </p>
                        </section>

                        <div className="resume-main-grid">
                            {/* Experience Section */}
                            <div className="main-col">
                                <section className="resume-section">
                                    <h3 className="section-title"><span className="caret">{'>'}</span> EXPERIENCE</h3>
                                    <div className="timeline">
                                        {(resume.experience || []).map((exp, i) => (
                                            <div key={i} className="timeline-item">
                                                <div className="time-node no-print"></div>
                                                <div className="item-header">
                                                    <h4 className="item-title">{exp.role}</h4>
                                                    <span className="item-date">{exp.period}</span>
                                                </div>
                                                <div className="item-sub">{exp.company}</div>
                                                <p className="item-desc">{exp.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="resume-section">
                                    <h3 className="section-title"><span className="caret">{'>'}</span> EDUCATION</h3>
                                    <div className="timeline">
                                        {(resume.education || []).map((edu, i) => (
                                            <div key={i} className="timeline-item">
                                                <div className="time-node no-print"></div>
                                                <div className="item-header">
                                                    <h4 className="item-title">{edu.degree}</h4>
                                                    <span className="item-date">{edu.year}</span>
                                                </div>
                                                <div className="item-sub">{edu.school}</div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            {/* Skills Section */}
                            <aside className="side-col">
                                <section className="resume-section">
                                    <h3 className="section-title"><span className="caret">{'>'}</span> TECH_SKILLS</h3>
                                    <div className="skills-list">
                                        {(resume.skills || []).map((skill, i) => (
                                            <div key={i} className="skill-row">
                                                <div className="skill-info">
                                                    <span>{skill.name}</span>
                                                    <span className="no-print">{skill.level}%</span>
                                                </div>
                                                <div className="skill-bar">
                                                    <div className="bar-fill" style={{ width: `${skill.level}%` }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="resume-section no-print">
                                    <h3 className="section-title"><span className="caret">{'>'}</span> LINKS</h3>
                                    <div className="links-list">
                                        <div className="link-item"><Globe size={14} /> portfolio</div>
                                        <div className="link-item"><Briefcase size={14} /> linkedin</div>
                                        <div className="link-item"><Code size={14} /> github</div>
                                    </div>
                                </section>

                                <div className="resume-seal no-print">
                                    <div className="qr-box">
                                        {/* Simplified QR Mockup */}
                                        <div className="qr-grid">
                                            {[...Array(16)].map((_, i) => <span key={i} style={{ opacity: Math.random() }}></span>)}
                                        </div>
                                    </div>
                                    <span className="tiny-meta">SCAN_FOR_VIRTUAL_NODE</span>
                                </div>
                            </aside>
                        </div>
                    </div>

                    <footer className="resume-footer no-print">
                        <div className="footer-line"></div>
                        <span className="footer-meta">CORE_SYSTEM_EXPORT // NATHAN_MRX_OS_RESUME</span>
                    </footer>
                </div>
            </div>

            <style jsx>{`
                .resume-page {
                    padding: 8rem 0 4rem;
                    min-height: 100vh;
                    background: #080808;
                    color: #fff;
                }
                .resume-wrapper {
                    max-width: 900px;
                    margin: 0 auto;
                }
                .resume-controls {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                    margin-bottom: 2rem;
                    padding: 1rem;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .controls-hint {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.75rem;
                    color: #666;
                }
                
                .resume-document {
                    padding: 4rem;
                    min-height: 1120px; /* Standard A4ish ratio */
                    position: relative;
                }
                .hud-glass {
                    background: rgba(15, 15, 15, 0.8);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
                }

                .resume-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    border-bottom: 2px solid var(--primary);
                    padding-bottom: 2rem;
                    margin-bottom: 3rem;
                }
                .name { font-size: 3rem; font-weight: 900; letter-spacing: -1px; margin: 0; }
                .title { font-size: 0.9rem; letter-spacing: 4px; color: #888; margin-top: 0.5rem; text-transform: uppercase; }
                .contact-grid { text-align: right; display: flex; flex-direction: column; gap: 0.5rem; }
                .contact-item { display: flex; align-items: center; justify-content: flex-end; gap: 0.75rem; font-size: 0.85rem; color: #888; }

                .resume-section { margin-bottom: 3rem; }
                .section-title { font-size: 0.8rem; font-weight: 900; color: #555; margin-bottom: 1.5rem; letter-spacing: 2px; }
                .caret { color: var(--primary); }
                .summary-text { line-height: 1.8; color: #aaa; font-size: 1rem; }

                .resume-main-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 4rem; }
                
                .timeline { display: flex; flex-direction: column; gap: 2.5rem; border-left: 1px solid rgba(255, 255, 255, 0.05); padding-left: 2rem; position: relative; }
                .timeline-item { position: relative; }
                .time-node { position: absolute; left: -2.35rem; top: 0.4rem; width: 10px; height: 10px; background: var(--primary); box-shadow: 0 0 10px var(--primary); border-radius: 50%; }
                
                .item-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.25rem; }
                .item-title { font-size: 1.1rem; font-weight: 800; color: #fff; }
                .item-date { font-size: 0.75rem; font-weight: 900; color: var(--primary); background: rgba(0, 255, 102, 0.1); padding: 0.2rem 0.6rem; border-radius: 100px; }
                .item-sub { font-size: 0.85rem; color: #666; font-weight: 700; margin-bottom: 1rem; }
                .item-desc { font-size: 0.9rem; color: #888; line-height: 1.6; }

                .skills-list { display: flex; flex-direction: column; gap: 1.5rem; }
                .skill-row { }
                .skill-info { display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 800; color: #888; margin-bottom: 0.5rem; text-transform: uppercase; }
                .skill-bar { height: 4px; background: rgba(255, 255, 255, 0.05); }
                .bar-fill { height: 100%; background: var(--primary); box-shadow: 0 0 10px var(--primary); }

                .links-list { display: flex; flex-direction: column; gap: 1rem; }
                .link-item { display: flex; align-items: center; gap: 1rem; font-size: 0.8rem; color: #666; font-weight: 700; text-transform: uppercase; }

                .resume-seal { margin-top: 4rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; opacity: 0.3; }
                .qr-box { width: 60px; height: 60px; padding: 5px; border: 1px solid var(--primary); }
                .qr-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; height: 100%; }
                .qr-grid span { background: var(--primary); }
                .tiny-meta { font-size: 0.5rem; font-weight: 900; letter-spacing: 1px; color: var(--primary); }

                .resume-footer { margin-top: 4rem; text-align: center; }
                .footer-line { height: 1px; background: linear-gradient(90deg, transparent, var(--primary), transparent); margin-bottom: 1rem; opacity: 0.3; }
                .footer-meta { font-size: 0.6rem; color: #444; font-weight: 900; letter-spacing: 4px; }

                .neon-text { color: var(--primary); text-shadow: 0 0 10px rgba(0, 255, 102, 0.3); }

                .cyber-btn {
                    background: transparent; border: 1px solid var(--primary); color: var(--primary);
                    padding: 0.6rem 1.5rem; font-size: 0.8rem; font-weight: 800; cursor: pointer;
                    display: flex; align-items: center; gap: 0.75rem; 
                    transition: all 0.3s;
                    clip-path: polygon(0% 0%, 90% 0%, 100% 30%, 100% 100%, 10% 100%, 0% 70%);
                }
                .cyber-btn:hover { background: var(--primary); color: #000; box-shadow: 0 0 20px rgba(0, 255, 102, 0.3); }

                .loading-state { height: 100vh; display: flex; align-items: center; justify-content: center; color: var(--primary); font-family: 'JetBrains Mono', monospace; }

                /* PRINT LOGIC */
                @media print {
                    @page { margin: 0; }
                    body { background: white !important; color: black !important; }
                    .resume-page { padding: 0; background: white !important; }
                    .resume-wrapper { max-width: 100%; }
                    .hud-glass { background: white !important; border: none !important; box-shadow: none !important; }
                    .no-print { display: none !important; }
                    .printable-area { padding: 2cm !important; color: black !important; }
                    .name { color: black !important; }
                    .neon-text { color: black !important; text-shadow: none !important; }
                    .resume-header { border-bottom: 2pt solid black; }
                    .title, .summary-text, .item-desc, .item-sub, .contact-item { color: black !important; }
                    .item-title { color: black !important; font-weight: 900; }
                    .item-date { background: none !important; color: black !important; border: 1pt solid black; }
                    .section-title { color: #666 !important; border-bottom: 0.5pt solid #eee; padding-bottom: 0.5rem; }
                    .skill-bar { height: 6pt; background: #eee !important; border: 0.5pt solid #ddd; }
                    .bar-fill { background: #333 !important; box-shadow: none !important; }
                    .timeline { border-left: 1pt solid #ddd !important; }
                }

                @media (max-width: 768px) {
                    .resume-header { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
                    .contact-grid { text-align: left; align-items: flex-start; }
                    .resume-main-grid { grid-template-columns: 1fr; gap: 3rem; }
                    .resume-document { padding: 2rem; }
                }
            `}</style>
        </main>
    );
}

function Info({ size }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>;
}
