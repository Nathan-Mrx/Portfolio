'use client';

import { useState, use } from 'react';
import { useRouter } from '@/i18n/routing';
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

    const inputStyle = {
        width: '100%',
        padding: '0.8rem',
        background: '#1a1a1a',
        border: '1px solid #333',
        color: '#fff',
        borderRadius: '4px',
        marginBottom: '1rem',
        fontFamily: 'inherit' // Ensures input inherits proper font
    };

    return (
        <div style={{ maxWidth: '800px' }}>
            <h1 style={{ marginBottom: '2rem' }}>Initialize New Project</h1>

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
                        <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem', fontSize: '0.8rem' }}>DESCRIPTION (EN)</label>
                        <textarea
                            style={{ ...inputStyle, minHeight: '100px' }}
                            value={formData.descriptionEn}
                            onChange={e => setFormData({ ...formData, descriptionEn: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem', fontSize: '0.8rem' }}>DESCRIPTION (FR)</label>
                        <textarea
                            style={{ ...inputStyle, minHeight: '100px' }}
                            value={formData.descriptionFr}
                            onChange={e => setFormData({ ...formData, descriptionFr: e.target.value })}
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
                    />
                    <ImageUpload
                        label="Cover Image"
                        id="cover-upload"
                        value={formData.coverUrl}
                        onChange={(url) => setFormData({ ...formData, coverUrl: url })}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem', fontSize: '0.8rem' }}>LEGACY IMAGE URL (OPTIONAL)</label>
                    <input
                        style={inputStyle}
                        value={formData.imageUrl}
                        onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem', fontSize: '0.8rem' }}>EXTERNAL LINK</label>
                    <input
                        style={inputStyle}
                        value={formData.link}
                        onChange={e => setFormData({ ...formData, link: e.target.value })}
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
                    {loading ? 'DEPLOYING...' : 'DEPLOY PROJECT'}
                </button>
            </form>
        </div>
    );
}
