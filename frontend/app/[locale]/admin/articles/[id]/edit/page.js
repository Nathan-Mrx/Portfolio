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
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error('Failed to fetch article');
            const data = await res.json();

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
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/ld+json',
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
        <div className="admin-container">
            <div className="admin-header">
                <div>
                    <Link href={`/${locale}/admin`} className="back-link">
                        <ChevronLeft size={20} /> Back to Dashboard
                    </Link>
                    <h1>Edit Article</h1>
                </div>
                <button
                    form="edit-article-form"
                    type="submit"
                    className="save-btn"
                    disabled={saving}
                >
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <form id="edit-article-form" onSubmit={handleSubmit} className="admin-form">
                <div className="form-section">
                    <h2>Basic Information</h2>
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

                <div className="form-section">
                    <h2>Media</h2>
                    <div className="grid-cols-2">
                        <ImageUpload
                            label="Thumbnail Image"
                            id="edit-thumbnail-upload"
                            value={formData.thumbnailUrl}
                            onChange={(url) => setFormData({ ...formData, thumbnailUrl: url })}
                        />
                        <ImageUpload
                            label="Cover Image"
                            id="edit-cover-upload"
                            value={formData.coverUrl}
                            onChange={(url) => setFormData({ ...formData, coverUrl: url })}
                        />
                    </div>
                </div>

                <div className="form-section">
                    <h2>Modular Content</h2>
                    <BlockEditor
                        blocks={formData.contentBlocks}
                        onChange={(blocks) => setFormData({ ...formData, contentBlocks: blocks })}
                    />
                </div>

                <div className="form-section">
                    <h2>Related Content</h2>
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
                .admin-container {
                    padding: 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .loading-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 50vh;
                    gap: 1rem;
                    color: #888;
                }
                .admin-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 3rem;
                }
                .back-link {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #888;
                    font-size: 0.9rem;
                    margin-bottom: 1rem;
                    transition: color 0.2s;
                }
                .back-link:hover {
                    color: var(--primary);
                }
                h1 { font-size: 2.5rem; margin: 0; }
                
                .save-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    background: var(--primary);
                    color: #000;
                    border: none;
                    padding: 0.8rem 2rem;
                    border-radius: 4px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .save-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0, 255, 102, 0.3);
                }
                .save-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    transform: none;
                }

                .form-section {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid #222;
                    border-radius: 8px;
                    padding: 2rem;
                    margin-bottom: 2rem;
                }
                .form-section h2 {
                    font-size: 1.25rem;
                    margin-bottom: 1.5rem;
                    color: var(--primary);
                    border-bottom: 1px solid #222;
                    padding-bottom: 0.5rem;
                }

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
                    font-size: 0.85rem;
                    color: #888;
                    margin-bottom: 0.5rem;
                }
                .admin-input {
                    width: 100%;
                    background: #000;
                    border: 1px solid #333;
                    color: #fff;
                    padding: 0.75rem;
                    border-radius: 4px;
                    font-size: 1rem;
                    transition: border-color 0.2s;
                }
                .admin-input:focus {
                    outline: none;
                    border-color: var(--primary);
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
