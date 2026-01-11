'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Cpu, Database, Globe, Mail, Phone, MapPin } from 'lucide-react';

export default function AboutPage({ params: paramsPromise }) {
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

    const aboutText = profile ? (locale === 'fr' ? profile.aboutFr : profile.aboutEn) : 'Loading bio...';
    const jobTitle = profile ? (locale === 'fr' ? profile.jobTitleFr : profile.jobTitleEn) : 'Developer';

    if (loading) return <div className="loading-bio">CONNECTING_TO_USER_DATA...</div>;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <main className="about-page">
            <div className="container">
                <motion.div
                    className="about-grid"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Visual Section */}
                    <motion.div className="about-visual" variants={itemVariants}>
                        <div className="profile-frame hud-glass">
                            <div className="frame-corners">
                                <span></span><span></span><span></span><span></span>
                            </div>
                            <div className="image-container">
                                {profile?.profileImageUrl ? (
                                    <img src={profile.profileImageUrl} alt="Nathan" className="profile-img" />
                                ) : (
                                    <div className="profile-placeholder">
                                        <Terminal size={64} />
                                    </div>
                                )}
                                <div className="scan-line"></div>
                            </div>
                            <div className="profile-info">
                                <h2 className="neon-text">{jobTitle}</h2>
                                <div className="status-badge">
                                    <div className="pulse-dot"></div>
                                    <span>{profile?.availabilityStatus || 'ONLINE'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="tech-stack hud-glass">
                            <h3 className="hud-label">KNOWN_PROTOCOLS</h3>
                            <div className="stack-icons">
                                <div className="stack-item" title="Frontend"><Globe size={24} /></div>
                                <div className="stack-item" title="Logic"><Cpu size={24} /></div>
                                <div className="stack-item" title="Data"><Database size={24} /></div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Content Section */}
                    <motion.div className="about-content" variants={itemVariants}>
                        <div className="content-header">
                            <span className="cyber-tag">BIOGRAPHY_V1.0.4</span>
                            <h1 className="main-title">WHO_IS_@<span className="neon-text">NATHAN_MRX</span>?</h1>
                        </div>

                        <div className="bio-card hud-glass">
                            <div className="bio-text">
                                {aboutText.split('\n').map((para, i) => (
                                    <p key={i}>{para}</p>
                                ))}
                            </div>
                        </div>

                        <div className="contact-quick-list">
                            <div className="contact-node hud-glass">
                                <Mail size={16} className="neon-text" />
                                <span>{profile?.email || 'nathan@example.com'}</span>
                            </div>
                            {profile?.phone && (
                                <div className="contact-node hud-glass">
                                    <Phone size={16} className="neon-text" />
                                    <span>{profile.phone}</span>
                                </div>
                            )}
                            <div className="contact-node hud-glass">
                                <MapPin size={16} className="neon-text" />
                                <span>Montreal, QC</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            <style jsx>{`
                .about-page {
                    padding: 8rem 0 4rem;
                    min-height: 100vh;
                }
                .about-grid {
                    display: grid;
                    grid-template-columns: 400px 1fr;
                    gap: 4rem;
                    align-items: start;
                }
                .hud-glass {
                    background: rgba(15, 15, 15, 0.7);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    position: relative;
                }
                .profile-frame {
                    padding: 1.5rem;
                    margin-bottom: 2rem;
                }
                .frame-corners span {
                    position: absolute;
                    width: 15px;
                    height: 15px;
                    border: 2px solid var(--primary);
                }
                .frame-corners span:nth-child(1) { top: -2px; left: -2px; border-right: none; border-bottom: none; }
                .frame-corners span:nth-child(2) { top: -2px; right: -2px; border-left: none; border-bottom: none; }
                .frame-corners span:nth-child(3) { bottom: -2px; left: -2px; border-right: none; border-top: none; }
                .frame-corners span:nth-child(4) { bottom: -2px; right: -2px; border-left: none; border-top: none; }

                .image-container {
                    position: relative;
                    aspect-ratio: 1;
                    overflow: hidden;
                    background: #000;
                    margin-bottom: 1.5rem;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .profile-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    filter: grayscale(0.5) contrast(1.1);
                }
                .profile-placeholder {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--primary);
                    opacity: 0.3;
                }
                .scan-line {
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 2px;
                    background: rgba(0, 255, 102, 0.3);
                    box-shadow: 0 0 10px var(--primary);
                    animation: scan 3s linear infinite;
                }
                @keyframes scan {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(400px); }
                }

                .profile-info {
                    text-align: center;
                }
                .profile-info h2 {
                    font-size: 0.9rem;
                    letter-spacing: 2px;
                    margin-bottom: 0.5rem;
                }
                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.7rem;
                    font-weight: 700;
                    background: rgba(0, 255, 102, 0.1);
                    padding: 0.2rem 0.6rem;
                    border-radius: 100px;
                    color: var(--primary);
                }
                .pulse-dot {
                    width: 6px;
                    height: 6px;
                    background: var(--primary);
                    border-radius: 100%;
                    animation: pulse 1.5s ease-in-out infinite;
                }
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 0.5; }
                    100% { transform: scale(1); opacity: 1; }
                }

                .tech-stack {
                    padding: 1.5rem;
                }
                .hud-label {
                    font-size: 0.6rem;
                    color: #555;
                    font-weight: 900;
                    letter-spacing: 2px;
                    margin-bottom: 1rem;
                    text-transform: uppercase;
                }
                .stack-icons {
                    display: flex;
                    gap: 1.5rem;
                    justify-content: center;
                }
                .stack-item {
                    color: #444;
                    transition: all 0.3s;
                }
                .stack-item:hover { color: var(--primary); transform: translateY(-3px); }

                .content-header {
                    margin-bottom: 2rem;
                }
                .cyber-tag {
                    font-size: 0.7rem;
                    color: var(--primary);
                    font-weight: 800;
                    background: rgba(0, 255, 102, 0.05);
                    padding: 0.3rem 0.8rem;
                    border-left: 3px solid var(--primary);
                }
                .main-title {
                    font-size: 2.5rem;
                    font-weight: 900;
                    margin-top: 1rem;
                    letter-spacing: -1px;
                }
                .neon-text {
                    color: var(--primary);
                    text-shadow: 0 0 10px rgba(0, 255, 102, 0.4);
                }

                .bio-card {
                    padding: 2.5rem;
                    margin-bottom: 2rem;
                }
                .bio-text {
                    color: #ccc;
                    line-height: 1.8;
                    font-size: 1.1rem;
                }
                .bio-text p { margin-bottom: 1.5rem; }

                .contact-quick-list {
                    display: flex;
                    gap: 1.5rem;
                    flex-wrap: wrap;
                }
                .contact-node {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1.25rem;
                    font-size: 0.9rem;
                    color: #888;
                }

                .loading-bio {
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--primary);
                    font-family: 'JetBrains Mono', monospace;
                }

                @media (max-width: 900px) {
                    .about-grid { grid-template-columns: 1fr; gap: 3rem; }
                    .about-visual { max-width: 400px; margin: 0 auto; }
                    .main-title { font-size: 2rem; }
                }
            `}</style>
        </main>
    );
}
