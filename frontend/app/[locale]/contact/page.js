'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mail, MapPin, User, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';

export default function ContactPage({ params }) {
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        // Simulate network latency for the "cyber" transmission feel
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSending(false);
        setSent(true);
    };

    return (
        <main className="contact-page">
            <div className="container min-h-screen-center">
                <motion.div
                    className="contact-container"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="contact-header">
                        <span className="cyber-tag">TRANSCEIVER_ACTIVE</span>
                        <h1 className="main-title">INITIATE_<span className="neon-text">TRANSMISSION</span></h1>
                        <p className="subtitle">Secure communication channel for collaborators and recruiters.</p>
                    </div>

                    <div className="contact-grid">
                        {/* Form Side */}
                        <div className="form-wrapper hud-glass">
                            <AnimatePresence mode="wait">
                                {!sent ? (
                                    <motion.form
                                        key="form"
                                        onSubmit={handleSubmit}
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                    >
                                        <div className="input-group">
                                            <label><User size={12} /> NAME_IDENTIFIER</label>
                                            <input type="text" placeholder="GUEST_USER" required />
                                            <div className="input-glow"></div>
                                        </div>

                                        <div className="input-group">
                                            <label><Mail size={12} /> EMAIL_ENDPOINT</label>
                                            <input type="email" placeholder="USER@DOMAIN.COM" required />
                                            <div className="input-glow"></div>
                                        </div>

                                        <div className="input-group">
                                            <label><MessageSquare size={12} /> DATA_PAYLOAD</label>
                                            <textarea rows="6" placeholder="TYPE_YOUR_MESSAGE_HERE..." required></textarea>
                                            <div className="input-glow"></div>
                                        </div>

                                        <button type="submit" className="cyber-send-btn" disabled={sending}>
                                            {sending ? (
                                                <div className="btn-inside">
                                                    <Loader2 size={20} className="animate-spin" />
                                                    <span>UPLOADING...</span>
                                                </div>
                                            ) : (
                                                <div className="btn-inside">
                                                    <Send size={18} />
                                                    <span>SEND_INTERACTIVE</span>
                                                </div>
                                            )}
                                        </button>
                                    </motion.form>
                                ) : (
                                    <motion.div
                                        key="success"
                                        className="success-state"
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                    >
                                        <div className="success-icon-wrapper">
                                            <CheckCircle2 size={64} className="neon-text" />
                                            <div className="icon-pulse"></div>
                                        </div>
                                        <h2>TRANSMISSION_COMPLETE</h2>
                                        <p>Data successfully routed to Nathan's terminal. Expect a response shortly.</p>
                                        <button onClick={() => setSent(false)} className="cyber-rect-btn primary">NEW_RECEPTION</button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Info Side */}
                        <div className="contact-info">
                            <div className="info-card hud-glass">
                                <h3 className="hud-label">COORDS</h3>
                                <div className="info-list">
                                    <div className="info-item">
                                        <Mail className="neon-text" size={18} />
                                        <div>
                                            <label>DIRECT_INTEL</label>
                                            <p>contact@nathan-mrx.dev</p>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <MapPin className="neon-text" size={18} />
                                        <div>
                                            <label>GEO_LOC</label>
                                            <p>Montreal, Quebec, Canada</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="terminal-note hud-glass">
                                <div className="term-header">
                                    <div className="term-dots"><span></span><span></span><span></span></div>
                                    <span className="term-title">SYS_STATUS</span>
                                </div>
                                <div className="term-body">
                                    <p><span className="caret">{'>'}</span> Encrypted tunnel established...</p>
                                    <p><span className="caret">{'>'}</span> Latency: 24ms</p>
                                    <p><span className="caret">{'>'}</span> Buffer: CLEAR</p>
                                    <p className="blink-cursor"><span className="caret">{'>'}</span> _</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <style jsx>{`
                .contact-page {
                    padding: 8rem 0 4rem;
                }
                .min-h-screen-center {
                    min-height: calc(100vh - 12rem);
                    display: flex;
                    align-items: center;
                }
                .contact-container {
                    width: 100%;
                    max-width: 1100px;
                    margin: 0 auto;
                }
                .contact-header { margin-bottom: 4rem; text-align: center; }
                .cyber-tag {
                    font-size: 0.7rem; color: var(--primary); font-weight: 800;
                    background: rgba(0, 255, 102, 0.05); padding: 0.3rem 0.8rem;
                    border-left: 3px solid var(--primary);
                }
                .main-title { font-size: 3rem; font-weight: 900; margin: 1.5rem 0 0.5rem; letter-spacing: -1px; }
                .neon-text { color: var(--primary); text-shadow: 0 0 10px rgba(0, 255, 102, 0.4); }
                .subtitle { color: #666; font-size: 1.1rem; }

                .contact-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 3rem; align-items: stretch; }
                .hud-glass {
                    background: rgba(15, 15, 15, 0.7); backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.05); position: relative;
                }

                .form-wrapper { padding: 3rem; }
                .input-group { position: relative; margin-bottom: 2rem; }
                .input-group label {
                    display: flex; align-items: center; gap: 0.5rem;
                    font-size: 0.65rem; color: #555; font-weight: 900;
                    text-transform: uppercase; margin-bottom: 0.75rem; letter-spacing: 1px;
                }
                .input-group input, .input-group textarea {
                    width: 100%; background: #0a0a0a; border: 1px solid #1a1a1a;
                    color: #fff; padding: 1rem; font-family: inherit; font-size: 1rem;
                    transition: all 0.3s ease;
                }
                .input-group input:focus, .input-group textarea:focus {
                    outline: none; border-color: var(--primary); background: rgba(0, 255, 102, 0.02);
                }
                .input-glow {
                    position: absolute; bottom: 0; left: 0; width: 0; height: 1px;
                    background: var(--primary); box-shadow: 0 0 10px var(--primary);
                    transition: width 0.3s ease;
                }
                .input-group input:focus ~ .input-glow, .input-group textarea:focus ~ .input-glow {
                    width: 100%;
                }

                .cyber-send-btn {
                    width: 100%; background: #000; border: 2px solid var(--primary);
                    color: var(--primary); padding: 2px; cursor: pointer;
                    transition: all 0.3s; clip-path: polygon(0% 0%, 95% 0%, 100% 30%, 100% 100%, 5% 100%, 0% 70%);
                }
                .btn-inside {
                    padding: 1.25rem; display: flex; align-items: center; justify-content: center;
                    gap: 1rem; font-weight: 900; font-size: 1rem; letter-spacing: 2px;
                    background: #000; transition: all 0.3s;
                }
                .cyber-send-btn:hover:not(:disabled) .btn-inside {
                    background: var(--primary); color: #000;
                }
                .cyber-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

                .success-state {
                    height: 100%; display: flex; flex-direction: column;
                    align-items: center; justify-content: center; text-align: center; gap: 1.5rem;
                }
                .success-icon-wrapper { position: relative; margin-bottom: 1rem; }
                .icon-pulse {
                    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
                    border: 2px solid var(--primary); border-radius: 50%;
                    animation: circle-pulse 2s infinite;
                }
                @keyframes circle-pulse {
                    0% { transform: scale(1); opacity: 0.5; }
                    100% { transform: scale(2); opacity: 0; }
                }
                .success-state h2 { font-size: 1.5rem; font-weight: 900; color: var(--primary); }
                .success-state p { color: #888; max-width: 300px; line-height: 1.6; }

                .info-card { padding: 2.5rem; margin-bottom: 2rem; }
                .info-list { display: flex; flex-direction: column; gap: 2rem; }
                .info-item { display: flex; align-items: flex-start; gap: 1.5rem; }
                .info-item label { display: block; font-size: 0.6rem; color: #555; font-weight: 900; margin-bottom: 0.4rem; }
                .info-item p { color: #ccc; font-size: 1.1rem; }

                .terminal-note { padding: 0.5rem; flex: 1; display: flex; flex-direction: column; }
                .term-header {
                    padding: 0.5rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.05);
                    display: flex; align-items: center; justify-content: space-between;
                }
                .term-dots { display: flex; gap: 5px; }
                .term-dots span { width: 6px; height: 6px; background: #333; border-radius: 50%; }
                .term-title { font-size: 0.6rem; color: #444; font-weight: 900; }
                .term-body { padding: 1.5rem; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; flex: 1; }
                .term-body p { margin-bottom: 0.5rem; color: #666; }
                .caret { color: var(--primary); }
                .blink-cursor { animation: blink 1s step-end infinite; }
                @keyframes blink { 50% { opacity: 0; } }

                .cyber-rect-btn {
                    background: transparent; border: 1px solid var(--primary); color: var(--primary);
                    padding: 0.8rem 2rem; font-weight: 800; cursor: pointer; transition: all 0.3s;
                    clip-path: polygon(0% 0%, 90% 0%, 100% 30%, 100% 100%, 10% 100%, 0% 70%);
                }
                .cyber-rect-btn:hover { background: var(--primary); color: #000; }

                @media (max-width: 900px) {
                    .contact-grid { grid-template-columns: 1fr; }
                    .form-wrapper { padding: 2rem; }
                }
            `}</style>
        </main>
    );
}
