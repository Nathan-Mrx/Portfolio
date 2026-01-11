'use client';

import { useState, use } from 'react';
import { useRouter } from '@/i18n/routing';
import { ChevronLeft, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import BlockEditor from '@/components/BlockEditor';
import ImageUpload from '@/components/ImageUpload';
import RelationSelector from '@/components/RelationSelector';

export default function CreateProject({ params }) {
    const { locale } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        titleEn: '',
        titleFr: '',
        descriptionEn: '',
        descriptionFr: '',
        thumbnailUrl: null,
        coverUrl: null,
        link: '',
        contentBlocks: [],
        linkedArticles: [],
        relatedProjects: []
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Security token missing. Please log in again.');
            setLoading(false);
            return;
        }

        try {
            const payload = {
                ...formData,
                linkedArticles: formData.linkedArticles?.filter(a => a.id).map(a => `/api/articles/${a.id}`) || [],
                relatedProjects: formData.relatedProjects?.filter(p => p.id).map(p => `/api/projects/${p.id}`) || []
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/ld+json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                console.error('Submission error:', errorData);
                const msg = errorData['hydra:description'] || errorData['detail'] || errorData['message'] || 'Failed to create project';
                throw new Error(`${msg} (Status: ${res.status})`);
            }

            router.push('/admin');
        } catch (err) {
            if (err.message.includes('401')) {
                localStorage.removeItem('token');
                router.push('/login');
                return;
            }
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-dashboard">
            <header className="dashboard-header">
                <div>
                    <Link href={`/${locale}/admin`} className="cyber-icon-link" title="BACK">
                        <ChevronLeft size={20} />
                    </Link>
                </div>
                <h1>ADMIN_CMD : <span className="neon-text">INITIALIZE_PROJECT</span></h1>
                <div className="quick-actions">
                    <button
                        form="create-project-form"
                        type="submit"
                        className="cyber-rect-btn primary"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                        <span>{loading ? 'DEPLOYING...' : 'DEPLOY_PROJECT'}</span>
                    </button>
                </div>
            </header>

            <form id="create-project-form" onSubmit={handleSubmit} className="admin-form">
                <div className="form-section hud-glass">
                    <h2 className="hud-title"><span className="caret">{'>'}</span> BASIC_INFO</h2>
                    <div className="bilingual-grid">
                        <div className="field-group">
                            <label>TITLE (EN)</label>
                            <input
                                className="admin-input"
                                value={formData.titleEn}
                                onChange={e => setFormData({ ...formData, titleEn: e.target.value })}
                                required
                            />
                        </div>
                        <div className="field-group">
                            <label>TITLE (FR)</label>
                            <input
                                className="admin-input"
                                value={formData.titleFr}
                                onChange={e => setFormData({ ...formData, titleFr: e.target.value })}
                                required
                            />
                        </div>
                        <div className="field-group">
                            <label>DESCRIPTION (EN)</label>
                            <textarea
                                className="admin-input"
                                style={{ minHeight: '100px' }}
                                value={formData.descriptionEn}
                                onChange={e => setFormData({ ...formData, descriptionEn: e.target.value })}
                                required
                            />
                        </div>
                        <div className="field-group">
                            <label>DESCRIPTION (FR)</label>
                            <textarea
                                className="admin-input"
                                style={{ minHeight: '100px' }}
                                value={formData.descriptionFr}
                                onChange={e => setFormData({ ...formData, descriptionFr: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section hud-glass">
                    <h2 className="hud-title"><span className="caret">{'>'}</span> MEDIA_AND_LINKS</h2>
                    <div className="grid-cols-2">
                        <ImageUpload
                            label="Thumbnail Image"
                            id="thumbnail-upload"
                            value={formData.thumbnailUrl}
                            onChange={(url) => setFormData({ ...formData, thumbnailUrl: url })}
                            helpText="Recommended: 600x600px (1:1 Ratio)"
                        />
                        <ImageUpload
                            label="Cover Image"
                            id="cover-upload"
                            value={formData.coverUrl}
                            onChange={(url) => setFormData({ ...formData, coverUrl: url })}
                            helpText="Recommended: 1920x600px (Wide Banner)"
                        />
                        <div className="field-group full">
                            <label>LEGACY IMAGE URL (OPTIONAL)</label>
                            <input
                                className="admin-input"
                                value={formData.imageUrl}
                                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                            />
                        </div>
                        <div className="field-group full">
                            <label>EXTERNAL LINK</label>
                            <input
                                className="admin-input"
                                value={formData.link}
                                onChange={e => setFormData({ ...formData, link: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section hud-glass">
                    <h2 className="hud-title"><span className="caret">{'>'}</span> MODULAR_CONTENT</h2>
                    <BlockEditor
                        blocks={formData.contentBlocks}
                        onChange={(blocks) => setFormData({ ...formData, contentBlocks: blocks })}
                    />
                </div>

                <div className="form-section hud-glass">
                    <h2 className="hud-title"><span className="caret">{'>'}</span> RELATED_CONTENT</h2>
                    <RelationSelector
                        type="article"
                        label="Linked Articles"
                        value={formData.linkedArticles}
                        onChange={(val) => setFormData({ ...formData, linkedArticles: val })}
                    />
                    <RelationSelector
                        type="project"
                        label="Related Projects"
                        value={formData.relatedProjects}
                        onChange={(val) => setFormData({ ...formData, relatedProjects: val })}
                    />
                </div>
            </form>

            <style jsx>{`
                .admin-dashboard {
                    padding: 2rem;
                    max-width: 1000px;
                    margin: 0 auto;
                    color: #e0e0e0;
                    background: #080808;
                    font-family: 'JetBrains Mono', 'Courier New', monospace;
                    min-height: 100vh;
                }

                .neon-text {
                    color: var(--primary);
                    text-shadow: 0 0 10px rgba(0, 255, 102, 0.5);
                }

                .hud-glass {
                    background: rgba(15, 15, 15, 0.7);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
                    position: relative;
                }

                .hud-glass::before {
                    content: '';
                    position: absolute;
                    top: -1px; left: -1px; width: 10px; height: 10px;
                    border-top: 2px solid var(--primary);
                    border-left: 2px solid var(--primary);
                }

                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 3rem;
                    padding-bottom: 1.5rem;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }

                .dashboard-header h1 {
                    font-size: 1.25rem;
                    letter-spacing: 4px;
                    margin: 0;
                }

                .quick-actions {
                    display: flex;
                    gap: 1rem;
                }

                .cyber-rect-btn {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 0.8rem 2rem;
                    background: #000;
                    border: 1px solid var(--primary);
                    color: var(--primary);
                    font-weight: 800;
                    font-size: 0.85rem;
                    transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
                    clip-path: polygon(0% 0%, 90% 0%, 100% 30%, 100% 100%, 10% 100%, 0% 70%);
                    cursor: pointer;
                }

                .cyber-rect-btn:hover:not(:disabled) {
                    background: var(--primary);
                    color: #000;
                    box-shadow: 0 0 20px rgba(0, 255, 102, 0.4);
                }

                .cyber-rect-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .cyber-icon-link {
                    color: #444;
                    padding: 0.5rem;
                    background: #111;
                    border: 1px solid #222;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .cyber-icon-link:hover {
                    color: var(--primary);
                    border-color: var(--primary);
                    box-shadow: 0 0 10px rgba(0, 255, 102, 0.2);
                }

                .form-section {
                    padding: 2rem;
                    margin-bottom: 2rem;
                }

                .hud-title {
                    font-size: 0.9rem;
                    font-weight: 800;
                    color: #888;
                    margin: 0 0 2rem 0;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    padding-bottom: 0.5rem;
                }

                .caret { color: var(--primary); }

                .bilingual-grid, .grid-cols-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                }

                .field-group {
                    margin-bottom: 1rem;
                }

                .field-group.full {
                    grid-column: span 2;
                }

                .field-group label {
                    display: block;
                    font-size: 0.6rem;
                    color: #555;
                    font-weight: 900;
                    letter-spacing: 1px;
                    margin-bottom: 0.5rem;
                    text-transform: uppercase;
                }

                .admin-input {
                    width: 100%;
                    background: #0a0a0a;
                    border: 1px solid #222;
                    color: #fff;
                    padding: 0.75rem;
                    border-radius: 0;
                    font-size: 0.9rem;
                    font-family: inherit;
                    transition: all 0.2s;
                }

                .admin-input:focus {
                    outline: none;
                    border-color: var(--primary);
                    background: rgba(0, 255, 102, 0.02);
                }

                .animate-spin {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                @media (max-width: 768px) {
                    .bilingual-grid, .grid-cols-2 {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}
