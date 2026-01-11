'use client';

import { useState, use } from 'react';
import { useRouter } from '@/i18n/routing';
import BlockEditor from '@/components/BlockEditor';
import RelationSelector from '@/components/RelationSelector';
import ImageUpload from '@/components/ImageUpload';

export default function CreateArticle() {
    const router = useRouter();
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
    const [loading, setLoading] = useState(false);

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
                linkedProjects: formData.linkedProjects?.filter(p => p.id).map(p => `/api/projects/${p.id}`) || [],
                relatedArticles: formData.relatedArticles?.filter(a => a.id).map(a => `/api/articles/${a.id}`) || []
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/articles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/ld+json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                console.error('Submission error:', errorData);
                const msg = errorData['hydra:description'] || errorData['detail'] || errorData['message'] || 'Failed to create article';
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

    const inputStyle = {
        width: '100%',
        padding: '0.8rem',
        background: '#1a1a1a',
        border: '1px solid #333',
        color: '#fff',
        borderRadius: '4px',
        marginBottom: '1rem',
        fontFamily: 'inherit'
    };

    return (
        <div style={{ maxWidth: '800px' }}>
            <h1 style={{ marginBottom: '2rem' }}>Publish New Intelligence Report</h1>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem', fontSize: '0.8rem' }}>TITLE (EN)</label>
                        <input
                            style={inputStyle}
                            value={formData.titleEn}
                            onChange={e => setFormData({ ...formData, titleEn: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem', fontSize: '0.8rem' }}>TITLE (FR)</label>
                        <input
                            style={inputStyle}
                            value={formData.titleFr}
                            onChange={e => setFormData({ ...formData, titleFr: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem', fontSize: '0.8rem' }}>SUMMARY (EN)</label>
                        <textarea
                            style={{ ...inputStyle, minHeight: '80px' }}
                            value={formData.contentEn}
                            onChange={e => setFormData({ ...formData, contentEn: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem', fontSize: '0.8rem' }}>SUMMARY (FR)</label>
                        <textarea
                            style={{ ...inputStyle, minHeight: '80px' }}
                            value={formData.contentFr}
                            onChange={e => setFormData({ ...formData, contentFr: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        background: 'var(--primary)',
                        color: '#000',
                        border: 'none',
                        padding: '1rem',
                        fontWeight: 'bold',
                        cursor: loading ? 'wait' : 'pointer',
                        marginTop: '1rem'
                    }}
                >
                    {loading ? 'PUBLISHING...' : 'PUBLISH ARTICLE'}
                </button>
            </form>
        </div>
    );
}
