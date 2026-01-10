'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';

export default function CreateProject() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        titleEn: '',
        titleFr: '',
        descriptionEn: '',
        descriptionFr: '',
        imageUrl: '',
        link: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/ld+json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to create project');

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

                <div>
                    <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem', fontSize: '0.8rem' }}>IMAGE URL</label>
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
