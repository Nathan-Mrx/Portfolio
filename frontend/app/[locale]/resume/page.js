'use client';

import { useState, useEffect, use } from 'react';
import { Printer, Mail, Phone, ExternalLink, MapPin, Globe, Briefcase, GraduationCap, Code, Languages, Terminal, Box, ChevronRight, Info } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function ResumePage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const { locale } = params;
    const t = useTranslations('Resume');
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '');
        fetch(`${apiUrl}/profiles`, { cache: 'no-store' })
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

    if (loading) return (
        <div className="loading-overlay">
            <div className="loader-hud">
                <Terminal size={48} className="animate-pulse" />
                <span>DECRYPTING_RESUME_DATA...</span>
            </div>
        </div>
    );

    const resume = profile?.resumeData || { experience: [], education: [], skills: [], languages: [] };
    const jobTitle = profile ? ((locale === 'fr' ? profile.jobTitleFr : profile.jobTitleEn) || 'DEVELOPER') : 'DEVELOPER';
    const location = profile?.location || 'CHICOUTIMI, QC';

    // Grouping skills logic for Quebec scannability
    const techStack = (resume.skills || []).filter(s => (s.level || 0) >= 70);
    const tools = (resume.skills || []).filter(s => (s.level || 0) < 70 && (s.level || 0) >= 40);
    const languages = resume.languages || [];

    const handlePrint = () => {
        window.print();
    };

    const renderDots = (level) => {
        const dots = [];
        for (let i = 1; i <= 5; i++) {
            dots.push(<span key={i} className={i <= level ? 'active' : ''}></span>);
        }
        return dots;
    };

    return (
        <main className="resume-page">
            <div className="container">
                {/* HUD Controls */}
                <div className="resume-controls no-print">
                    <button onClick={handlePrint} className="cyber-btn primary">
                        <Printer size={18} /> <span>{t('print')}</span>
                    </button>
                    <div className="controls-hint">
                        <Info size={14} className="neon-text" />
                        <span>{t('printHint')}</span>
                    </div>
                </div>

                <div className="resume-document printable-area">
                    {/* Sidebar / Left Column (Screen) / Right or Left (Print) */}
                    <aside className="resume-sidebar">
                        <header className="resume-header-mobile only-mobile">
                            <h1 className="name">NATHAN <span className="neon-text">MERIEUX</span></h1>
                            <h2 className="title">{jobTitle}</h2>
                        </header>

                        <div className="sidebar-section">
                            <h3 className="sidebar-title">{t('languages')}</h3>
                            <div className="language-nodes">
                                {languages.length > 0 ? languages.map((lang, i) => (
                                    <div key={i} className="lang-item">
                                        <span className="lang-label">{lang.name}</span>
                                        <div className="lang-dots">{renderDots(lang.level)}</div>
                                        <span className="lang-status">{lang.status}</span>
                                    </div>
                                )) : (
                                    <p className="dim-text" style={{ fontSize: '0.6rem' }}>NO_LANGUAGES_DEFINED</p>
                                )}
                            </div>
                        </div>

                        <div className="sidebar-section">
                            <h3 className="sidebar-title">{t('techStack')}</h3>
                            <div className="skill-tags">
                                {techStack.map((s, i) => (
                                    <div key={i} className="skill-tag">
                                        <ChevronRight size={10} className="neon-text" />
                                        <span>{s.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="sidebar-section">
                            <h3 className="sidebar-title">{t('tools')}</h3>
                            <div className="skill-tags">
                                {tools.map((s, i) => (
                                    <div key={i} className="skill-tag dim">
                                        <span>{s.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="sidebar-section no-print">
                            <h3 className="sidebar-title">{t('links')}</h3>
                            <div className="link-nodes">
                                <a href="https://nathan-mrx.com" className="link-node"><Globe size={14} /> nathan-mrx.com</a>
                                <a href="mailto:nathan.merieux@outlook.fr" className="link-node"><Mail size={14} /> nathan.merieux@outlook.fr</a>
                                <a href="#" className="link-node"><ExternalLink size={14} /> LinkedIn</a>
                            </div>
                        </div>

                        <div className="print-footer only-print">
                            <p>Nathan Merieux // PORTFOLIO: nathan-mrx.com</p>
                            <p>{location} // nathan.merieux@outlook.fr</p>
                        </div>
                    </aside>

                    {/* Main Content / Right Column */}
                    <div className="resume-main">
                        <header className="resume-header no-mobile">
                            <div className="header-meta">
                                <span className="sys-status">LOCAL_NODE: {location.toUpperCase()}</span>
                                <span className="sys-date">REF_ID: 2026_V1</span>
                            </div>
                            <h1 className="name">NATHAN <span className="neon-text">MERIEUX</span></h1>
                            <h2 className="title">{jobTitle}</h2>
                        </header>

                        <section className="main-section">
                            <h3 className="section-title"><Terminal size={16} /> {t('summary')}</h3>
                            <div className="section-content bio-text">
                                <p>{(locale === 'fr' ? profile?.aboutFr : profile?.aboutEn) || 'Initializing profile narrative...'}</p>
                            </div>
                        </section>

                        <section className="main-section">
                            <h3 className="section-title"><Briefcase size={16} /> {t('experience')}</h3>
                            <div className="timeline">
                                {(resume.experience || []).map((exp, i) => (
                                    <div key={i} className="timeline-item">
                                        <div className="item-header">
                                            <div className="item-identity">
                                                <h4 className="item-role">{exp.role}</h4>
                                                <span className="item-company">@ {exp.company}</span>
                                            </div>
                                            <span className="item-period">{exp.period}</span>
                                        </div>
                                        <div className="item-description">
                                            <p>{exp.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="main-section">
                            <h3 className="section-title"><GraduationCap size={16} /> {t('education')}</h3>
                            <div className="timeline">
                                {(resume.education || []).map((edu, i) => (
                                    <div key={i} className="timeline-item small">
                                        <div className="item-header">
                                            <h4 className="item-role">{edu.degree}</h4>
                                            <span className="item-period">{edu.year}</span>
                                        </div>
                                        <span className="item-company">{edu.school}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .resume-page {
                    padding: 8rem 0 4rem;
                    min-height: 100vh;
                    position: relative;
                }

                .resume-controls {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                    padding: 0.75rem 1.5rem;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .controls-hint {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.7rem;
                    color: #666;
                    font-weight: 700;
                }

                /* Resume Document Layout */
                .resume-document {
                    display: grid;
                    grid-template-columns: 300px 1fr;
                    background: rgba(10, 10, 10, 0.9);
                    border: 1px solid rgba(0, 255, 157, 0.1);
                    min-height: 1000px;
                    box-shadow: 0 40px 100px rgba(0,0,0,0.8);
                    position: relative;
                }

                /* Sidebar Styles */
                .resume-sidebar {
                    background: rgba(0, 255, 157, 0.03);
                    border-right: 1px solid rgba(0, 255, 157, 0.1);
                    padding: 3rem 2rem;
                    display: flex;
                    flex-direction: column;
                    gap: 2.5rem;
                }

                .sidebar-title {
                    font-size: 0.65rem;
                    font-weight: 900;
                    color: var(--primary);
                    letter-spacing: 2px;
                    margin-bottom: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    text-transform: uppercase;
                }

                .language-nodes { display: flex; flex-direction: column; gap: 1rem; }
                .lang-item { display: flex; flex-direction: column; gap: 0.25rem; }
                .lang-label { font-size: 0.6rem; font-weight: 800; color: #555; text-transform: uppercase; }
                .lang-dots { display: flex; gap: 4px; }
                .lang-dots span { width: 4px; height: 4px; background: rgba(255, 255, 255, 0.1); }
                .lang-dots span.active { background: var(--primary); box-shadow: 0 0 5px var(--primary); }
                .lang-status { font-size: 0.5rem; font-weight: 900; color: #444; margin-top: 0.2rem; text-transform: uppercase; }

                .skill-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
                .skill-tag {
                    font-size: 0.7rem; font-weight: 700; color: #aaa;
                    background: rgba(255, 255, 255, 0.03);
                    padding: 0.3rem 0.6rem;
                    display: flex; align-items: center; gap: 0.4rem;
                }
                .skill-tag.dim { color: #666; }

                .link-nodes { display: flex; flex-direction: column; gap: 0.75rem; }
                .link-node {
                    display: flex; align-items: center; gap: 0.75rem;
                    font-size: 0.75rem; color: #666; font-weight: 700;
                    transition: color 0.3s;
                }
                .link-node:hover { color: var(--primary); }

                /* Main Content Styles */
                .resume-main { padding: 3rem 4rem; display: flex; flex-direction: column; gap: 3rem; }

                .header-meta { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
                .sys-status, .sys-date { font-size: 0.55rem; font-weight: 900; color: #333; letter-spacing: 1px; }

                .name { font-size: 2.5rem; font-weight: 900; letter-spacing: -1px; margin: 0; }
                .title { font-size: 0.8rem; letter-spacing: 5px; color: #555; font-weight: 800; text-transform: uppercase; margin-top: 0.5rem; }

                .main-section { display: flex; flex-direction: column; gap: 1.5rem; }
                .section-title {
                    font-size: 0.75rem; font-weight: 900; color: var(--primary);
                    display: flex; align-items: center; gap: 0.75rem;
                    letter-spacing: 2px; text-transform: uppercase;
                    border-bottom: 1px solid rgba(0, 255, 157, 0.1);
                    padding-bottom: 0.75rem;
                }

                .bio-text { color: #888; line-height: 1.8; font-size: 0.95rem; }

                .timeline { display: flex; flex-direction: column; gap: 2.5rem; }
                .timeline-item { position: relative; }
                .item-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; }
                .item-identity { display: flex; flex-direction: column; }
                .item-role { font-size: 1.1rem; font-weight: 800; color: #fff; margin: 0; }
                .item-company { font-size: 0.8rem; font-weight: 900; color: var(--primary); opacity: 0.7; }
                .item-period { font-size: 0.7rem; font-weight: 900; background: rgba(0, 255, 157, 0.08); padding: 0.2rem 0.6rem; color: var(--primary); }
                .item-description { font-size: 0.9rem; color: #777; line-height: 1.6; max-width: 600px; }

                .timeline-item.small .item-role { font-size: 0.95rem; }

                .neon-text { color: var(--primary); text-shadow: 0 0 10px rgba(0, 255, 157, 0.4); }

                .cyber-btn {
                    background: transparent; border: 1px solid var(--primary); color: var(--primary);
                    padding: 0.6rem 1.2rem; font-size: 0.75rem; font-weight: 900; cursor: pointer;
                    display: flex; align-items: center; gap: 0.75rem;
                    transition: all 0.3s;
                    text-transform: uppercase; letter-spacing: 2px;
                }
                .cyber-btn:hover { background: var(--primary); color: #000; box-shadow: 0 0 15px var(--primary); }

                /* Loading State */
                .loading-overlay { height: 100vh; display: flex; align-items: center; justify-content: center; background: #050505; color: var(--primary); }
                .loader-hud { display: flex; flex-direction: column; align-items: center; gap: 1rem; font-size: 0.8rem; font-weight: 900; }

                .only-mobile { display: none; }
                .only-print { display: none; }

                @media (max-width: 850px) {
                    .resume-document { grid-template-columns: 1fr; }
                    .resume-sidebar { order: 2; padding: 2rem; border-right: none; border-top: 1px solid rgba(0, 255, 157, 0.1); }
                    .no-mobile { display: none; }
                    .only-mobile { display: block; }
                    .resume-header-mobile { margin-bottom: 1rem; }
                    .resume-main { padding: 2rem; order: 1; }
                }

                @media print {
                    @page { margin: 1.5cm; }
                    * { transition: none !important; }
                    body { background: white !important; }
                    .resume-page { padding: 0; min-height: auto; }
                    .resume-document {
                        display: grid;
                        grid-template-columns: 1fr 200px !important;
                        background: white !important;
                        border: none !important;
                        box-shadow: none !important;
                        color: black !important;
                    }
                    .resume-sidebar {
                        order: 2;
                        background: #f8f8f8 !important;
                        border-right: none !important;
                        border-left: 1pt solid #eee !important;
                        padding: 1.5cm 0.75cm !important;
                    }
                    .resume-main { order: 1; padding: 1.5cm 1cm !important; color: black !important; }
                    .neon-text { color: black !important; text-shadow: none !important; }
                    .no-print { display: none !important; }
                    .only-print { display: block !important; }
                    .sidebar-title { color: #666 !important; border-bottom: 0.5pt solid #eee; padding-bottom: 4pt; }
                    .section-title { color: black !important; border-bottom: 1pt solid #000 !important; }
                    .item-role { color: black !important; font-weight: 900; }
                    .item-company { color: #444 !important; }
                    .item-period { background: none !important; color: #666 !important; border: 0.5pt solid #ddd; }
                    .bio-text, .item-description { color: #333 !important; }
                    .lang-label { color: black !important; }
                    .lang-dots span { border: 0.5pt solid #ddd; background: white !important; }
                    .lang-dots span.active { background: #333 !important; border-color: #333; }
                    .skill-tag { border: 0.5pt solid #eee; background: none !important; color: #444 !important; }
                    .print-footer { margin-top: auto; font-size: 8pt; color: #999; line-height: 1.4; }
                }
            `}</style>
        </main>
    );
}
