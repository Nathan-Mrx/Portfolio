'use client';

import { useState, useEffect, use } from 'react';
import { Printer, Mail, Phone, ExternalLink, MapPin, Globe, Briefcase, GraduationCap, Code, Languages, Terminal, Box, ChevronRight, Info, Linkedin, Gamepad2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function ResumePage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const { locale } = params;
    const t = useTranslations('Resume');
    const [profile, setProfile] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '');

        Promise.all([
            fetch(`${apiUrl}/profiles`, { cache: 'no-store' }).then(res => res.json()),
            fetch(`${apiUrl}/projects?pagination=false`, { cache: 'no-store' }).then(res => res.json())
        ])
            .then(([profileData, projectsData]) => {
                const members = profileData['hydra:member'] || profileData['member'] || [];
                if (members.length > 0) setProfile(members[0]);

                setProjects(projectsData['hydra:member'] || projectsData['member'] || []);
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

    const resume = profile?.resumeData || { experience: [], education: [], skills: [], tools: [], programmingLanguages: [], languages: [], featuredProjectIds: [] };

    // Filter and sort projects based on selected IDs, or fallback to first 5
    const selectedIds = resume.featuredProjectIds || [];
    const displayedProjects = selectedIds.length > 0
        ? selectedIds.map(id => projects.find(p => String(p.id) === String(id))).filter(Boolean)
        : projects.slice(0, 5);

    const jobTitle = profile ? ((locale === 'fr' ? profile.jobTitleFr : profile.jobTitleEn) || 'DEVELOPER') : 'DEVELOPER';
    const location = profile?.location || 'CHICOUTIMI, QC';

    // Data structures from resumeData, with fallback to legacy filtering if new arrays are empty
    const techStack = (resume.skills && resume.skills.length > 0)
        ? resume.skills
        : (resume.skills || []).filter(s => (s.level || 0) >= 70);

    const tools = (resume.tools && resume.tools.length > 0)
        ? resume.tools
        : (resume.skills || []).filter(s => (s.level || 0) < 70 && (s.level || 0) >= 40);

    const programmingLanguages = resume.programmingLanguages || [];
    const languages = resume.languages || [];

    const handlePrint = () => {
        window.print();
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
                            <h2 className="title no-print">{jobTitle}</h2>
                        </header>

                        <div className="sidebar-section">
                            <h3 className="sidebar-title">{t('languages')}</h3>
                            <div className="language-nodes">
                                {languages.length > 0 ? languages.map((lang, i) => (
                                    <div key={i} className="lang-item">
                                        <span className="lang-label">{(locale === 'fr' ? lang.nameFr : lang.nameEn) || lang.name}</span>
                                        <div className="level-dots">
                                            {[...Array(5)].map((_, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`dot ${idx < lang.level ? 'active' : ''}`}
                                                ></div>
                                            ))}
                                        </div>
                                        <span className="lang-status">{(locale === 'fr' ? lang.statusFr : lang.statusEn) || lang.status}</span>
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
                                    <div key={i} className="skill-tag-container">
                                        <div className="skill-tag">
                                            <ChevronRight size={10} className="neon-text" />
                                            <span>{s.name}</span>
                                        </div>
                                        {s.level && (
                                            <div className="skill-mini-bar">
                                                <div className="fill" style={{ width: `${s.level}%` }}></div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="sidebar-section">
                            <h3 className="sidebar-title">{t('tools')}</h3>
                            <div className="skill-tags">
                                {tools.map((s, i) => (
                                    <div key={i} className="skill-tag-container">
                                        <div className="skill-tag">
                                            <ChevronRight size={10} className="neon-text" />
                                            <span>{s.name}</span>
                                        </div>
                                        {s.level && (
                                            <div className="skill-mini-bar">
                                                <div className="fill" style={{ width: `${s.level}%` }}></div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {programmingLanguages.length > 0 && (
                            <div className="sidebar-section">
                                <h3 className="sidebar-title">{t('programmingLanguages')}</h3>
                                <div className="skill-tags">
                                    {programmingLanguages.map((s, i) => (
                                        <div key={i} className="skill-tag-container">
                                            <div className="skill-tag">
                                                <ChevronRight size={10} className="neon-text" />
                                                <span>{s.name}</span>
                                            </div>
                                            {s.level && (
                                                <div className="skill-mini-bar">
                                                    <div className="fill" style={{ width: `${s.level}%` }}></div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="sidebar-section">
                            <h3 className="sidebar-title">{t('links')}</h3>
                            <table className="links-table">
                                <tbody>
                                    <tr>
                                        <td className="icon-cell"><Globe size={18} /></td>
                                        <td className="text-cell">
                                            <a href="https://nathan-mrx.com" className="link-text" target="_blank" rel="noopener noreferrer">
                                                nathan-mrx.com
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="icon-cell"><Mail size={18} /></td>
                                        <td className="text-cell">
                                            <a href={`mailto:${profile?.email || 'nathan.merieux@outlook.fr'}`} className="link-text">
                                                {profile?.email || 'nathan.merieux@outlook.fr'}
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="icon-cell"><Linkedin size={18} /></td>
                                        <td className="text-cell">
                                            <a href="https://linkedin.com/in/nathan-merieux" className="link-text" target="_blank" rel="noopener noreferrer">
                                                <span className="no-print">LinkedIn</span>
                                                <span className="only-print">linkedin.com/in/nathan-merieux</span>
                                            </a>
                                        </td>
                                    </tr>
                                    <tr className="only-print">
                                        <td className="icon-cell"><MapPin size={18} /></td>
                                        <td className="text-cell">
                                            <span className="link-text" style={{ color: 'black' }}>{location}</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </aside>

                    {/* Main Content / Right Column */}
                    <div className="resume-main">
                        <header className="resume-header no-mobile">
                            <div className="header-meta no-print">
                                <span className="sys-status">LOCAL_NODE: {location.toUpperCase()}</span>
                                <span className="sys-date">REF_ID: 2026_V1</span>
                            </div>
                            <h1 className="name no-print">NATHAN <span className="neon-text">MERIEUX</span></h1>
                            <h2 className="title" style={{ marginTop: '0' }}>{jobTitle}</h2>
                        </header>

                        <section className="main-section">
                            <h3 className="section-title"><Terminal size={16} /> {t('summary')}</h3>
                            <div className="section-content bio-text">
                                <p>{(locale === 'fr' ? (profile?.resumeBioFr || profile?.aboutFr) : (profile?.resumeBioEn || profile?.aboutEn)) || 'Initializing profile narrative...'}</p>
                            </div>
                        </section>

                        <section className="main-section">
                            <h3 className="section-title"><Gamepad2 size={16} /> {t('experience')}</h3>
                            <div className="timeline">
                                {displayedProjects.map((project, i) => (
                                    <div key={i} className="timeline-item">
                                        <div className="item-header">
                                            <div className="item-identity">
                                                <h4 className="item-role">{locale === 'fr' ? project.titleFr : project.titleEn}</h4>
                                                {project.link && <span className="item-company">{project.link.replace(/^https?:\/\//, '')}</span>}
                                            </div>
                                        </div>
                                        <div className="item-description">
                                            <p>{locale === 'fr' ? project.descriptionFr : project.descriptionEn}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="main-section">
                            <h3 className="section-title"><GraduationCap size={16} /> {t('education')}</h3>
                            <div className="timeline">
                                {(resume.education || []).map((edu, i) => {
                                    const description = (locale === 'fr' ? edu.descriptionFr : edu.descriptionEn);
                                    return (
                                        <div key={i} className="timeline-item small">
                                            <div className="item-header">
                                                <h4 className="item-role">{(locale === 'fr' ? edu.degreeFr : edu.degreeEn) || edu.degree}</h4>
                                                <span className="item-period">{(locale === 'fr' ? edu.yearFr : edu.yearEn) || edu.year}</span>
                                            </div>
                                            <span className="item-company">{(locale === 'fr' ? edu.schoolFr : edu.schoolEn) || edu.school}</span>
                                            {description && (
                                                <ul className="edu-bullets">
                                                    {description.split('\n').map((point, idx) => (
                                                        point.trim() && <li key={idx}>{point.replace(/^[•\-\*]\s*/, '')}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        <section className="main-section portfolio-qr-section">
                            <h3 className="section-title"><ExternalLink size={16} /> {t('portfolio')}</h3>
                            <div className="portfolio-qr-content">
                                <div className="portfolio-info">
                                    <p className="bio-text small-text">
                                        Interactive Portfolio & Source Code:
                                    </p>
                                    <div className="portfolio-link-big">{(profile?.portfolioUrl || 'nathan-mrx.com').replace(/^https?:\/\//, '')}</div>
                                </div>
                                <div className="qr-container only-print">
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(profile?.portfolioUrl || 'https://nathan-mrx.com')}&bgcolor=ffffff&color=000000&margin=0`}
                                        alt="QR Code Portfolio"
                                        className="qr-code"
                                    />
                                </div>
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
                .level-dots { display: flex; gap: 6px; margin: 0.2rem 0; }
                .dot { 
                    width: 7px; 
                    height: 7px; 
                    background: rgba(0, 0, 0, 0.5); 
                    border: 1px solid rgba(0, 255, 157, 0.3);
                    border-radius: 50%;
                    transition: all 0.3s ease;
                    flex-shrink: 0;
                }
                .dot.active { 
                    background: #00ff9d; 
                    box-shadow: 0 0 10px #00ff9d, 0 0 20px rgba(0, 255, 157, 0.4); 
                    border-color: #00ff9d;
                }
                .lang-status { font-size: 0.5rem; font-weight: 900; color: #444; text-transform: uppercase; letter-spacing: 1px; }

                .skill-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
                .skill-tag-container { display: flex; flex-direction: column; gap: 2px; }
                .skill-tag {
                    font-size: 0.7rem; font-weight: 700; color: #aaa;
                    background: rgba(255, 255, 255, 0.03);
                    padding: 0.3rem 0.6rem;
                    display: flex; align-items: center; gap: 0.4rem;
                }
                .skill-tag.dim { color: #666; }
                .skill-tag.workflow { color: #888; border-left: 2px solid #444; }
                .skill-mini-bar { 
                    width: 100%; 
                    height: 2px; 
                    background: rgba(255, 255, 255, 0.05); 
                    overflow: hidden; 
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .skill-mini-bar .fill { 
                    height: 100%; 
                    background: var(--primary); 
                    box-shadow: 0 0 5px var(--primary); 
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }

                .links-table { width: 100%; border-collapse: collapse; margin-top: 0.5rem; }
                .links-table td { vertical-align: middle; padding: 0.6rem 0; }
                .icon-cell { width: 20px; color: var(--primary); }
                .links-table .text-cell { padding-left: 0.75rem !important; }
                .link-text {
                    color: #888;
                    font-size: 0.8rem;
                    transition: all 0.2s;
                    text-decoration: none;
                    display: block;
                }
                .link-text:hover { color: var(--primary); transform: translateX(5px); }

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
                .small-text { font-size: 0.85rem; line-height: 1.5; color: #666; }

                .timeline { display: flex; flex-direction: column; gap: 2.5rem; }
                .timeline-item { position: relative; }
                .item-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; }
                .item-identity { display: flex; flex-direction: column; }
                .item-role { font-size: 1.1rem; font-weight: 800; color: #fff; margin: 0; }
                .item-company { font-size: 0.8rem; font-weight: 900; color: var(--primary); opacity: 0.7; }
                .item-period { font-size: 0.7rem; font-weight: 900; background: rgba(0, 255, 157, 0.08); padding: 0.2rem 0.6rem; color: var(--primary); }
                .item-description { font-size: 0.9rem; color: #777; line-height: 1.6; max-width: 600px; }
                
                .edu-bullets {
                    margin: 0.5rem 0 0 1rem;
                    padding: 0;
                    list-style-type: none;
                }
                .edu-bullets li {
                    position: relative;
                    font-size: 0.85rem;
                    color: #777;
                    line-height: 1.5;
                    padding-left: 1rem;
                }
                .edu-bullets li::before {
                    content: "•";
                    position: absolute;
                    left: 0;
                    color: var(--primary);
                }

                .portfolio-qr-section { margin-top: 0rem; padding-top: 0; }
                .portfolio-qr-content { display: flex; gap: 2rem; align-items: center; }
                .portfolio-info { flex: 1; }
                .portfolio-link-big { 
                    font-size: 1.2rem; 
                    font-weight: 900; 
                    color: var(--primary); 
                    margin-top: 0.5rem;
                    font-family: 'JetBrains Mono', monospace;
                }
                .qr-container { 
                    display: flex; 
                    flex-direction: column; 
                    align-items: center; 
                    gap: 0.5rem; 
                    background: white; 
                    padding: 0;
                    border-radius: 0;
                }
                .qr-code { width: 80px; height: 80px; }
                .qr-hint { font-size: 0.5rem; font-weight: 950; color: #000; letter-spacing: 1px; }

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
                    @page { 
                        size: letter;
                        margin: 0mm !important; /* Hides browser headers/footers */
                    }
                    * { transition: none !important; }
                    body { 
                        background: white !important; 
                        margin: 0 !important; 
                        padding: 0 !important; 
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .resume-page { 
                        padding: 0 !important; 
                        margin: 0 !important; 
                        min-height: auto; 
                    }
                    .resume-document {
                        display: grid;
                        grid-template-columns: 240px 1fr !important;
                        background: white !important;
                        border: none !important;
                        box-shadow: none !important;
                        color: black !important;
                        min-height: 100vh; 
                        height: auto;
                    }
                    .resume-sidebar { 
                        order: 1 !important;
                        background: #f8f8f8 !important;
                        border-right: 1pt solid #eee !important;
                        border-left: none !important;
                        padding: 0.5in 0.5in !important; /* Increased padding to act as margin */
                        display: flex !important;
                        flex-direction: column !important;
                        gap: 1.25rem !important;
                    }
                    .resume-main { 
                        order: 2 !important; 
                        padding: 0.5in 0.5in 0.5in 0.5in !important; /* Uniform 0.5in padding */
                        color: black !important; 
                        gap: 1.5rem !important;
                    }
                    .sidebar-section { margin-bottom: 0.4rem; }
                    .links-table { width: 100% !important; border-collapse: collapse !important; }
                    .links-table td { border: none !important; padding: 5pt 0 !important; vertical-align: middle !important; color: black !important; }
                    .icon-cell { width: 16pt !important; }
                    .links-table .text-cell { padding-left: 8pt !important; }
                    .links-table a { color: black !important; text-decoration: none !important; font-size: 8.5pt !important; }
                    .links-table svg { 
                        color: black !important; 
                        stroke: black !important;
                        stroke-width: 2px !important;
                        fill: none !important;
                        width: 13pt !important;
                        height: 13pt !important;
                        flex-shrink: 0 !important;
                    }
                    .resume-header-mobile { display: block !important; margin-bottom: 1.25rem; border-bottom: 1pt solid #eee; padding-bottom: 0.75rem; }
                    .resume-header-mobile .name { font-size: 1.3rem !important; margin-bottom: 0.35rem; }
                    .no-mobile { display: block !important; }
                    .resume-header { margin-bottom: 1.75rem !important; }
                    .resume-header .title { font-size: 1.1rem !important; color: black !important; opacity: 1 !important; border-bottom: 2pt solid black; padding-bottom: 0.35rem; margin-top: 0 !important; }
                    .neon-text { color: black !important; text-shadow: none !important; }
                    .no-print { display: none !important; }
                    .only-print { display: block !important; }
                    tr.only-print { display: table-row !important; }
                    span.only-print { display: inline !important; }
                    .sidebar-title { color: #666 !important; border-bottom: 0.5pt solid #eee; padding-bottom: 3pt; font-size: 0.65rem !important; margin-bottom: 0.6rem !important; }
                    .section-title { color: black !important; border-bottom: 1pt solid #000 !important; font-size: 0.75rem !important; padding-bottom: 0.35rem !important; margin-bottom: 0.75rem !important; }
                    .main-section { gap: 1rem !important; }
                    .timeline { gap: 1.25rem !important; }
                    .item-header { margin-bottom: 0.35rem !important; }
                    .item-role { color: black !important; font-weight: 900; font-size: 0.95rem !important; }
                    .timeline-item.small .item-role { font-size: 0.9rem !important; }
                    .item-company { color: #444 !important; font-size: 0.8rem !important; }
                    .item-period { background: none !important; color: #666 !important; border: 0.5pt solid #ddd; font-size: 0.7rem !important; padding: 0.15rem 0.5rem !important; }
                    .bio-text, .item-description { color: #333 !important; font-size: 0.85rem !important; line-height: 1.5 !important; }
                    .edu-bullets { margin: 0.25rem 0 0 0.5rem !important; }
                    .edu-bullets li { font-size: 0.8rem !important; color: #444 !important; padding-left: 0.75rem !important; }
                    .edu-bullets li::before { color: #000 !important; }
                    .portfolio-qr-section { margin-top: 0.75rem !important; }
                    .portfolio-qr-content { gap: 1.25rem !important; }
                    .portfolio-link-big { color: black !important; font-size: 1rem !important; margin-top: 0.35rem !important; }
                    .qr-container { border: none !important; }
                    .qr-code { width: 70px !important; height: 70px !important; }
                    .level-dots { 
                        display: flex !important; 
                        gap: 4px !important; 
                        margin: 3px 0 !important;
                    }
                    .dot { 
                        width: 7px !important; 
                        height: 7px !important; 
                        background-color: #e0e0e0 !important; 
                        border: 1px solid #ccc !important;
                        border-radius: 50% !important;
                        display: inline-block !important;
                        box-shadow: none !important;
                        filter: none !important;
                    }
                    .dot.active { 
                        background-color: #000 !important; 
                        border: 1px solid #000 !important;
                    }
                    .skill-tag { border: 0.5pt solid #eee; background: none !important; color: #444 !important; margin-bottom: 1.5pt; padding: 0.15rem 0.5rem !important; font-size: 0.65rem !important; }
                    .skill-mini-bar { 
                        border: none !important; 
                        background-color: #eee !important; 
                        height: 1.5pt !important; 
                        margin-top: 1.5pt !important;
                    }
                    .skill-mini-bar .fill { 
                        background-color: #000 !important; 
                    }
                }
            `}</style>
        </main>
    );
}
