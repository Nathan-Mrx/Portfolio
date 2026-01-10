'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import BlockEditor from '@/components/BlockEditor';

export default function CreateArticle() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        titleEn: '',
        titleFr: '',
        contentEn: '',
        contentFr: '',
        thumbnailUrl: '',
        coverUrl: '',
        contentBlocks: []
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/articles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/ld+json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to create article');

            router.push('/admin');
        } catch (err) {
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
                    <div>
                        <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem', fontSize: '0.8rem' }}>THUMBNAIL URL</label>
                        <input
                            style={inputStyle}
                            value={formData.thumbnailUrl}
                            onChange={e => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                            placeholder="Small card image"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem', fontSize: '0.8rem' }}>COVER URL</label>
                        <input
                            style={inputStyle}
                            value={formData.coverUrl}
                            onChange={e => setFormData({ ...formData, coverUrl: e.target.value })}
                            placeholder="Full width header image"
                        />
                    </div>
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '0.9rem', letterSpacing: '2px' }}>MODULAR CONTENT BLOCKS</h3>
                    <BlockEditor
                        blocks={formData.contentBlocks}
                        onChange={blocks => setFormData({ ...formData, contentBlocks: blocks })}
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
