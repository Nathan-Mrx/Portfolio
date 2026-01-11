'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import OptimizedImage from '@/components/OptimizedImage';
import { Terminal, Cpu, Database, Globe, Mail, Phone, MapPin, Activity, Zap, Shield, ChevronRight, BarChart3, Binary, Languages } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AboutPage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const { locale } = params;
    const t = useTranslations('About');
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

    const aboutText = profile ? ((locale === 'fr' ? profile.aboutFr : profile.aboutEn) || '') : '';
    const jobTitle = profile ? ((locale === 'fr' ? profile.jobTitleFr : profile.jobTitleEn) || 'DEVELOPER') : 'DEVELOPER';

    if (loading) return (
        <div className="loading-overlay">
            <div className="loader-hud">
                <Binary size={48} className="animate-pulse" />
                <span>ESTABLISHING_NEURAL_LINK...</span>
            </div>
        </div>
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] }
        }
    };

    return (
        <main className="about-page">
            <div className="cyber-overlay"></div>
            <div className="container">
                <motion.div
                    className="neural-interface"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Header: Neural Link ID */}
                    <motion.header className="neural-header" variants={itemVariants}>
                        <div className="header-glitch-box">
                            <span className="system-tag">NEURAL_ID: {profile?.id || 'ALPHA-01'}</span>
                            <h1 className="neural-title">
                                <span className="prefix">IDENTITY_DATA // </span>
                                <span className="name neon-text">NATHAN_MRX</span>
                            </h1>
                        </div>
                        <div className="connection-status">
                            <div className="status-item">
                                <Activity size={12} className="neon-text animate-pulse" />
                                <span>LINK_STABLE</span>
                            </div>
                            <div className="status-item">
                                <Zap size={12} className="neon-text" />
                                <span>LATENCY: 12ms</span>
                            </div>
                        </div>
                    </motion.header>

                    <div className="interface-grid">
                        {/* Sidebar: Digital Dossier */}
                        <motion.aside className="interface-sidebar" variants={itemVariants}>
                            <div className="dossier-card hud-glass">
                                <div className="scanning-frame">
                                    <div className="corner-markers">
                                        <span></span><span></span><span></span><span></span>
                                    </div>
                                    <div className="image-wrapper">
                                        {profile?.profileImageUrl ? (
                                            <OptimizedImage
                                                src={profile.profileImageUrl}
                                                alt="Nathan"
                                                preset="PROFILE"
                                                priority
                                            />
                                        ) : (
                                            <div className="placeholder-avatar">
                                                <Binary size={80} />
                                            </div>
                                        )}
                                        <div className="scan-overlay"></div>
                                        <div className="glitch-line"></div>
                                    </div>
                                </div>
                                <div className="dossier-info">
                                    <div className="role-badge">
                                        <h2 className="neon-text">{jobTitle}</h2>
                                    </div>
                                    <div className="status-row">
                                        <div className="pulse-dot"></div>
                                        <span className="status-text">{profile?.availabilityStatus || 'OPERATIONAL'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="vitals-card hud-glass">
                                <h3 className="module-title"><BarChart3 size={14} /> SYSTEM_VITALS</h3>
                                <div className="vital-rows">
                                    <div className="vital-item">
                                        <div className="vital-label">
                                            <span>EXPERIENCE</span>
                                            <span>94%</span>
                                        </div>
                                        <div className="vital-bar">
                                            <motion.div
                                                className="bar-fill"
                                                initial={{ width: 0 }}
                                                animate={{ width: '94%' }}
                                                transition={{ duration: 1.5, delay: 0.5 }}
                                            ></motion.div>
                                        </div>
                                    </div>
                                    <div className="vital-item">
                                        <div className="vital-label">
                                            <span>CREATIVITY</span>
                                            <span>88%</span>
                                        </div>
                                        <div className="vital-bar">
                                            <motion.div
                                                className="bar-fill"
                                                initial={{ width: 0 }}
                                                animate={{ width: '88%' }}
                                                transition={{ duration: 1.5, delay: 0.7 }}
                                            ></motion.div>
                                        </div>
                                    </div>
                                    <div className="vital-item">
                                        <div className="vital-label">
                                            <span>STAMINA</span>
                                            <span>100%</span>
                                        </div>
                                        <div className="vital-bar">
                                            <motion.div
                                                className="bar-fill"
                                                initial={{ width: 0 }}
                                                animate={{ width: '100%' }}
                                                transition={{ duration: 1.5, delay: 0.9 }}
                                            ></motion.div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="vitals-card hud-glass">
                                <h3 className="module-title"><Languages size={14} /> LINGUISTIC_NODES</h3>
                                <div className="vital-rows">
                                    {(profile?.resumeData?.languages || []).map((lang, i) => (
                                        <div key={i} className="language-node-sidebar">
                                            <div className="vital-label">
                                                <span>{lang.name}</span>
                                                <span>{lang.status}</span>
                                            </div>
                                            <div className="level-dots">
                                                {[...Array(5)].map((_, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`dot ${idx < lang.level ? 'active' : ''}`}
                                                    ></div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.aside>

                        {/* Main: Core Narrative */}
                        <motion.section className="interface-main" variants={itemVariants}>
                            <div className="intel-module hud-glass">
                                <div className="module-header">
                                    <div className="tab active">
                                        <Terminal size={14} />
                                        <span>CORE_INTEL.txt</span>
                                    </div>
                                    <div className="module-controls">
                                        <span></span><span></span><span></span>
                                    </div>
                                </div>
                                <div className="intel-content">
                                    <div className="bio-container">
                                        {aboutText.split('\n').map((para, i) => (
                                            <p key={i} className="bio-para">
                                                <span className="line-prefix"> {'>'} </span>
                                                {para}
                                            </p>
                                        ))}
                                        <motion.span
                                            className="cursor"
                                            animate={{ opacity: [1, 0] }}
                                            transition={{ repeat: Infinity, duration: 0.8 }}
                                        >_</motion.span>
                                    </div>
                                </div>
                            </div>

                            <div className="connectivity-module hud-glass">
                                <h3 className="module-title"><Globe size={14} /> NODE_CONNECTIVITY</h3>
                                <div className="nodes-grid">
                                    <div className="node-item">
                                        <div className="node-icon"><Mail size={18} /></div>
                                        <div className="node-data">
                                            <span className="label">ENCRYPTED_MAIL</span>
                                            <span className="value">{profile?.email || 'nathan.merieux@outlook.fr'}</span>
                                        </div>
                                    </div>
                                    <div className="node-item">
                                        <div className="node-icon"><MapPin size={18} /></div>
                                        <div className="node-data">
                                            <span className="label">GEO_COORDINATES</span>
                                            <span className="value">{profile?.location || 'Chicoutimi, QC, CA'}</span>
                                        </div>
                                    </div>
                                    <div className="node-item">
                                        <div className="node-icon"><Shield size={18} /></div>
                                        <div className="node-data">
                                            <span className="label">ACCESS_LEVEL</span>
                                            <span className="value">ADMIN_ROOT [0]</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    </div>
                </motion.div>
            </div>

            <style jsx>{`
                .about-page {
                    padding: 8rem 0 4rem;
                    min-height: 100vh;
                    position: relative;
                    overflow: hidden;
                }

                .cyber-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.4) 100%);
                    pointer-events: none;
                    z-index: 1;
                }

                .container { position: relative; z-index: 2; }

                .neural-interface {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                /* Header Styling */
                .neural-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    border-bottom: 1px solid rgba(0, 255, 157, 0.2);
                    padding-bottom: 2rem;
                }
                .system-tag {
                    font-size: 0.6rem;
                    color: var(--primary);
                    font-weight: 900;
                    letter-spacing: 2px;
                    background: rgba(0, 255, 157, 0.1);
                    padding: 2px 8px;
                    margin-bottom: 0.5rem;
                    display: inline-block;
                }
                .neural-title {
                    font-size: 2rem;
                    font-weight: 900;
                    letter-spacing: -1px;
                    margin: 0;
                }
                .prefix { opacity: 0.3; }
                .connection-status {
                    display: flex;
                    gap: 1.5rem;
                }
                .status-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.65rem;
                    font-weight: 800;
                    color: #555;
                }

                /* Grid Layout */
                .interface-grid {
                    display: grid;
                    grid-template-columns: 350px 1fr;
                    gap: 2rem;
                    align-items: start;
                }

                /* Sidebar Styles */
                .interface-sidebar {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }
                .hud-glass {
                    background: rgba(10, 10, 10, 0.8);
                    border: 1px solid rgba(0, 255, 157, 0.1);
                    position: relative;
                    box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.8);
                }
                .hud-glass::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0, 255, 157, 0.02) 2px);
                    pointer-events: none;
                }

                .dossier-card { padding: 1.5rem; }
                .scanning-frame {
                    position: relative;
                    aspect-ratio: 1;
                    margin-bottom: 1.5rem;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    background: #000;
                }
                .corner-markers span {
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    border: 2px solid var(--primary);
                }
                .corner-markers span:nth-child(1) { top: -2px; left: -2px; border-right: none; border-bottom: none; }
                .corner-markers span:nth-child(2) { top: -2px; right: -2px; border-left: none; border-bottom: none; }
                .corner-markers span:nth-child(3) { bottom: -2px; left: -2px; border-right: none; border-top: none; }
                .corner-markers span:nth-child(4) { bottom: -2px; right: -2px; border-left: none; border-top: none; }

                .image-wrapper {
                    width: 100%; height: 100%;
                    position: relative;
                    overflow: hidden;
                }
                .scan-overlay {
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: linear-gradient(to bottom, transparent 50%, rgba(0, 255, 157, 0.05) 50%);
                    background-size: 100% 4px;
                    z-index: 2;
                }
                .glitch-line {
                    position: absolute;
                    top: -10%; left: 0; width: 100%; height: 2px;
                    background: var(--primary);
                    box-shadow: 0 0 15px var(--primary);
                    animation: scan 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                    z-index: 3;
                }
                @keyframes scan {
                    0% { top: -10%; }
                    100% { top: 110%; }
                }

                .dossier-info { text-align: center; }
                .role-badge h2 { font-size: 0.8rem; letter-spacing: 3px; font-weight: 800; margin-bottom: 0.5rem; }
                .status-row { display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
                .pulse-dot { width: 6px; height: 6px; background: var(--primary); border-radius: 50%; animation: pulse 1.5s infinite; }
                .status-text { font-size: 0.6rem; font-weight: 900; color: #555; letter-spacing: 1px; }
                @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.4; } 100% { transform: scale(1); opacity: 1; } }

                .vitals-card { padding: 1.5rem; }
                .module-title {
                    font-size: 0.7rem; font-weight: 900; color: var(--primary);
                    margin-bottom: 1.5rem; letter-spacing: 2px;
                    display: flex; align-items: center; gap: 0.5rem;
                }
                .vital-rows { display: flex; flex-direction: column; gap: 1rem; }
                .vital-label { display: flex; justify-content: space-between; font-size: 0.6rem; font-weight: 900; color: #555; margin-bottom: 0.4rem; }
                .vital-bar { height: 4px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); }
                .bar-fill { height: 100%; background: var(--primary); box-shadow: 0 0 10px var(--primary); }

                /* Main Content Styles */
                .interface-main { display: flex; flex-direction: column; gap: 2rem; }
                .intel-module { display: flex; flex-direction: column; min-height: 400px; }
                .module-header {
                    background: rgba(0, 255, 157, 0.05);
                    padding: 0.5rem 1rem;
                    display: flex; justify-content: space-between; align-items: center;
                    border-bottom: 1px solid rgba(0, 255, 157, 0.1);
                }
                .tab { display: flex; align-items: center; gap: 0.75rem; font-size: 0.65rem; font-weight: 900; color: var(--primary); }
                .module-controls { display: flex; gap: 0.5rem; }
                .module-controls span { width: 6px; height: 6px; border: 1px solid var(--primary); }

                .intel-content { padding: 2.5rem; color: #aaa; line-height: 1.8; font-size: 1.1rem; }
                .bio-container { position: relative; }
                .bio-para { margin-bottom: 1.5rem; position: relative; padding-left: 1.5rem; }
                .line-prefix { position: absolute; left: 0; color: var(--primary); font-weight: 900; opacity: 0.5; }
                .cursor { color: var(--primary); }

                .connectivity-module { padding: 2rem; }
                .nodes-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; }
                .node-item { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); }
                .node-icon { color: var(--primary); opacity: 0.6; }
                .node-data { display: flex; flex-direction: column; }
                .label { font-size: 0.55rem; font-weight: 900; color: #444; letter-spacing: 1px; }
                .value { font-size: 0.8rem; font-weight: 700; color: #888; }

                .language-node {
                    justify-content: space-between;
                }
                .level-dots {
                    display: flex;
                    gap: 6px;
                }
                .dot {
                    width: 7px;
                    height: 7px;
                    border: 1px solid rgba(0, 255, 157, 0.3);
                    border-radius: 50%;
                    transition: all 0.3s ease;
                    background: rgba(0, 0, 0, 0.5);
                }
                .dot.active {
                    background: #00ff9d;
                    box-shadow: 0 0 10px #00ff9d, 0 0 20px rgba(0, 255, 157, 0.4);
                    border-color: #00ff9d;
                }

                /* Loading State */
                .loading-overlay {
                    height: 100vh; display: flex; align-items: center; justify-content: center;
                    background: #050505; color: var(--primary); font-family: 'JetBrains Mono', monospace;
                }
                .loader-hud { display: flex; flex-direction: column; align-items: center; gap: 1rem; font-size: 0.8rem; font-weight: 900; letter-spacing: 2px; }

                .neon-text { color: var(--primary); text-shadow: 0 0 15px rgba(0, 255, 157, 0.4); }

                @media (max-width: 1000px) {
                    .interface-grid { grid-template-columns: 1fr; }
                    .interface-sidebar { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
                    .about-page { padding: 6rem 0 2rem; }
                }

                @media (max-width: 600px) {
                    .interface-sidebar { grid-template-columns: 1fr; }
                    .neural-title { font-size: 1.4rem; }
                    .connection-status { display: none; }
                }
            `}</style>
        </main>
    );
}
