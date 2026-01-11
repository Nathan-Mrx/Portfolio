'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import BlockEditor from '@/components/BlockEditor';
import RelationSelector from '@/components/RelationSelector';
import ImageUpload from '@/components/ImageUpload';

export default function EditArticle({ params }) {
    const { id, locale } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        titleEn: '',
        titleFr: '',
        contentEn: '',
        contentFr: '',
        thumbnailUrl: null,
        coverUrl: null,
        contentBlocks: [],
        linkedProjects: [],
        relatedArticles: []
    });

    useEffect(() => {
        fetchArticle();
    }, [id]);

    const fetchArticle = async () => {
        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
            console.log(`[DEBUG] Fetching article ${id} from ${apiUrl}`);

            const res = await fetch(`${apiUrl}/articles/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) {
                console.error(`[DEBUG] Fetch failed with status: ${res.status}`);
                throw new Error(`Failed to fetch article (Status: ${res.status})`);
            }
            const data = await res.json();
            console.log('[DEBUG] Article data received:', data);

            setFormData({
                titleEn: data.titleEn || '',
                titleFr: data.titleFr || '',
                contentEn: data.contentEn || '',
                contentFr: data.contentFr || '',
                thumbnailUrl: data.thumbnailUrl || '',
                coverUrl: data.coverUrl || '',
                contentBlocks: data.contentBlocks || [],
                linkedProjects: data.linkedProjects || [],
                relatedArticles: data.relatedArticles || []
            });
        } catch (error) {
            console.error('Error fetching article:', error);
            if (error.message.includes('401')) {
                localStorage.removeItem('token');
                router.push('/login');
                return;
            }
            alert('Could not load article data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const token = localStorage.getItem('token');

            // Prepare payload - only send IDs for relationships
            const payload = {
                ...formData,
                linkedProjects: formData.linkedProjects?.filter(p => p.id).map(p => `/api/projects/${p.id}`) || [],
                relatedArticles: formData.relatedArticles?.filter(a => a.id).map(a => `/api/articles/${a.id}`) || []
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/merge-patch+json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                console.error('Update error:', errorData);
                const msg = errorData['hydra:description'] || errorData['detail'] || errorData['message'] || 'Update failed';
                throw new Error(`${msg} (Status: ${res.status})`);
            }

            router.push(`/${locale}/admin`);
            router.refresh();
        } catch (error) {
            if (error.message.includes('401')) {
                localStorage.removeItem('token');
                router.push('/login');
                return;
            }
            console.error('Error updating article:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-container loading-state">
                <Loader2 className="animate-spin" size={48} />
                <p>Loading article data...</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <header className="dashboard-header">
                <div>
                    <Link href={`/${locale}/admin`} className="cyber-icon-link" title="BACK">
                        <ChevronLeft size={20} />
                    </Link>
                </div>
                <h1>ADMIN_CMD : <span className="neon-text">EDIT_ARTICLE</span></h1>
                <div className="quick-actions">
                    <button
                        form="edit-article-form"
                        type="submit"
                        className="cyber-rect-btn primary"
                        disabled={saving}
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        <span>{saving ? 'SAVING...' : 'SAVE_CHANGES'}</span>
                    </button>
                </div>
            </header>

            <form id="edit-article-form" onSubmit={handleSubmit} className="admin-form">
                <div className="form-section hud-glass">
                    <h2 className="hud-title"><span className="caret">{'>'}</span> BASIC_INFO</h2>
                    <div className="bilingual-grid">
                        <div className="field-group">
                            <label>Title (EN)</label>
                            <input
                                type="text"
                                className="admin-input"
                                value={formData.titleEn}
                                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                                required
                            />
                        </div>
                        <div className="field-group">
                            <label>Title (FR)</label>
                            <input
                                type="text"
                                className="admin-input"
                                value={formData.titleFr}
                                onChange={(e) => setFormData({ ...formData, titleFr: e.target.value })}
                                required
                            />
                        </div>
                        <div className="field-group">
                            <label>Summary (EN)</label>
                            <textarea
                                className="admin-input"
                                rows="3"
                                value={formData.contentEn}
                                onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                                required
                            />
                        </div>
                        <div className="field-group">
                            <label>Summary (FR)</label>
                            <textarea
                                className="admin-input"
                                rows="3"
                                value={formData.contentFr}
                                onChange={(e) => setFormData({ ...formData, contentFr: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section hud-glass">
                    <h2 className="hud-title"><span className="caret">{'>'}</span> MEDIA_INFO</h2>
                    <div className="grid-cols-2">
                        <ImageUpload
                            label="Thumbnail Image"
                            id="edit-thumbnail-upload"
                            value={formData.thumbnailUrl}
                            onChange={(url) => setFormData({ ...formData, thumbnailUrl: url })}
                            helpText="Recommended: 600x600px (1:1 Ratio)"
                        />
                        <ImageUpload
                            label="Cover Image"
                            id="edit-cover-upload"
                            value={formData.coverUrl}
                            onChange={(url) => setFormData({ ...formData, coverUrl: url })}
                            helpText="Recommended: 1920x600px (Wide Banner)"
                        />
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
                        type="project"
                        label="Linked Projects"
                        value={formData.linkedProjects}
                        onChange={(val) => setFormData({ ...formData, linkedProjects: val })}
                    />
                    <RelationSelector
                        type="article"
                        label="Related Articles"
                        value={formData.relatedArticles}
                        onChange={(val) => setFormData({ ...formData, relatedArticles: val })}
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

                .loading-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    gap: 1rem;
                    color: var(--primary);
                    background: #080808;
                    font-family: 'JetBrains Mono', monospace;
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
