'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

const itemVariants = {
    hidden:  { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.19, 1, 0.22, 1] } },
};

export default function ContactPage() {
    const t = useTranslations('Contact');
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState('idle');

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        try {
            const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '');
            const res = await fetch(`${apiUrl}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error();
            setStatus('success');
            setForm({ name: '', email: '', subject: '', message: '' });
        } catch {
            setStatus('error');
        }
    };

    return (
        <main className="page">
            <div className="container">
                <motion.div
                    className="grid"
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
                >
                    {/* ── Left: info ── */}
                    <motion.aside className="info" variants={itemVariants}>
                        <h1 className="title">{t('title')}</h1>
                        <p className="subtitle">{t('subtitle')}</p>
                    </motion.aside>

                    {/* ── Right: form ── */}
                    <motion.div className="form-side" variants={itemVariants}>
                        {status === 'success' && (
                            <motion.div
                                className="banner success"
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <CheckCircle size={16} />
                                <div>
                                    <strong>{t('success')}</strong>
                                    <span>{t('successDetail')}</span>
                                </div>
                            </motion.div>
                        )}

                        {status === 'error' && (
                            <motion.div
                                className="banner error"
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <AlertCircle size={16} />
                                <div>
                                    <strong>{t('error')}</strong>
                                    <span>{t('errorDetail')}</span>
                                </div>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="form">
                            <div className="row">
                                <div className="field">
                                    <label>{t('name')}</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        disabled={status === 'sending'}
                                        autoComplete="name"
                                    />
                                </div>
                                <div className="field">
                                    <label>{t('email')}</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                        disabled={status === 'sending'}
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <div className="field">
                                <label>{t('subject')}</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={form.subject}
                                    onChange={handleChange}
                                    required
                                    disabled={status === 'sending'}
                                />
                            </div>

                            <div className="field">
                                <label>{t('message')}</label>
                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    rows={6}
                                    required
                                    disabled={status === 'sending'}
                                />
                            </div>

                            <button type="submit" className="submit" disabled={status === 'sending'}>
                                {status === 'sending'
                                    ? <><span className="spinner" />{t('sending')}</>
                                    : <><Send size={14} />{t('send')}</>
                                }
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            </div>

            <style jsx>{`
                /* ── Page ── */
                .page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    padding: 7rem 0 4rem;
                }

                /* ── Two-column grid ── */
                .grid {
                    display: grid;
                    grid-template-columns: 260px 1fr;
                    gap: 4rem;
                    align-items: start;
                }

                /* ── Info column ── */
                .info {
                    position: sticky;
                    top: 7rem;
                }

                .title {
                    font-size: clamp(1.8rem, 3vw, 2.4rem);
                    font-weight: 900;
                    letter-spacing: -1px;
                    color: #fff;
                    line-height: 1.05;
                    margin-bottom: 1rem;
                }

                .subtitle {
                    font-size: 0.9rem;
                    color: #555;
                    line-height: 1.75;
                    margin-bottom: 2rem;
                }

                /* ── Form column ── */
                .form-side {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                /* ── Banners ── */
                .banner {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.75rem;
                    padding: 1rem 1.25rem;
                    border: 1px solid;
                    font-size: 0.85rem;
                }
                .banner.success {
                    border-color: rgba(0, 255, 157, 0.2);
                    background: rgba(0, 255, 157, 0.04);
                    color: var(--primary);
                }
                .banner.error {
                    border-color: rgba(255, 60, 60, 0.2);
                    background: rgba(255, 60, 60, 0.04);
                    color: #f55;
                }
                .banner strong { display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 2px; }
                .banner span   { color: #555; font-size: 0.82rem; }

                /* ── Form ── */
                .form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.75rem;
                }

                .row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.75rem;
                }

                .field {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                label {
                    font-size: 0.72rem;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                    color: #444;
                }

                /* Underline-style inputs */
                input, textarea {
                    background: transparent;
                    border: none;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    color: #e0e0e0;
                    padding: 0.55rem 0;
                    font-size: 0.95rem;
                    font-family: inherit;
                    outline: none;
                    width: 100%;
                    box-sizing: border-box;
                    transition: border-color 0.2s;
                    border-radius: 0;
                    -webkit-appearance: none;
                }

                input:focus, textarea:focus {
                    border-color: var(--primary);
                }

                input::placeholder, textarea::placeholder {
                    color: #2a2a2a;
                }

                input:disabled, textarea:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }

                textarea {
                    resize: none;
                    min-height: 130px;
                }

                /* ── Submit button ── */
                .submit {
                    align-self: flex-start;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.6rem;
                    padding: 0.8rem 2rem;
                    background: var(--primary);
                    color: #000;
                    border: none;
                    font-family: inherit;
                    font-size: 0.85rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: background 0.2s, box-shadow 0.2s;
                    margin-top: 0.25rem;
                }

                .submit:hover:not(:disabled) {
                    background: #fff;
                    box-shadow: 0 0 24px var(--primary-glow);
                }

                .submit:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                /* Spinner */
                .spinner {
                    display: inline-block;
                    width: 13px;
                    height: 13px;
                    border: 2px solid rgba(0, 0, 0, 0.2);
                    border-top-color: #000;
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                }

                @keyframes spin { to { transform: rotate(360deg); } }

                /* ── Mobile ── */
                @media (max-width: 768px) {
                    .page {
                        align-items: flex-start;
                        padding: 6rem 0 3rem;
                    }

                    .grid {
                        grid-template-columns: 1fr;
                        gap: 2rem;
                    }

                    .info {
                        position: static;
                    }

                    .row {
                        grid-template-columns: 1fr;
                        gap: 1.75rem;
                    }

                    .submit {
                        align-self: stretch;
                        justify-content: center;
                    }
                }
            `}</style>
        </main>
    );
}
