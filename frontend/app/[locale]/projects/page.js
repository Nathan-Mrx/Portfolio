import { useTranslations } from 'next-intl';
import { fetchAPI } from '@/lib/api';

export default async function Projects({ params }) {
    const { locale } = await params;
    let projects = [];

    try {
        const data = await fetchAPI('/projects');
        projects = data['hydra:member'] || data['member'] || [];
    } catch (error) {
        console.error('Failed to fetch projects:', error);
    }

    // We need to use translation hook in a component content, 
    // but since this is an async Server Component, we CAN use useTranslations 
    // if we set up the provider correctly, OR better: use getTranslations.
    // However, next-intl docs recommend useTranslations for Client Components mostly, 
    // but it works in Server Components too with await in new versions or just works.
    // Actually simplest is to just use getTranslations for server side.
    // But wait, my Layout uses NextIntlClientProvider, so useTranslations works in Client Components.
    // For Server Components we should use getTranslations.

    // Let's make this a Server Component that passes data to a Client Component or just render here?
    // next-intl supports `getTranslations` in async components.

    // Actually, I can just use `getTranslations` here.
    const { getTranslations } = await import('next-intl/server');
    const { Link } = await import('@/i18n/routing');
    const t = await getTranslations('Projects');

    const getFullUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const origin = baseUrl.replace(/\/api$/, '');
        return `${origin}${path}`;
    };

    return (
        <div className="container" style={{ paddingTop: '8rem' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>{t('title')}</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem' }}>
                {projects.length === 0 ? (
                    <p>No projects found.</p>
                ) : (
                    projects.map((project, index) => (
                        <Link
                            key={project.id || index}
                            href={`/projects/${project.id}`}
                            className="glass project-card"
                            style={{
                                display: 'block',
                                padding: '0',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                textDecoration: 'none',
                                color: 'inherit',
                                border: '1px solid #222',
                                transition: 'transform 0.3s, border-color 0.3s'
                            }}
                        >
                            <div style={{ height: '220px', width: '100%', overflow: 'hidden', background: '#111' }}>
                                {(project.thumbnailUrl || project.imageUrl) ? (
                                    <img
                                        src={getFullUrl(project.thumbnailUrl || project.imageUrl)}
                                        alt={locale === 'fr' ? project.titleFr : project.titleEn}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                                        className="card-image"
                                    />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333' }}>
                                        NO_IMAGE
                                    </div>
                                )}
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                <h2 style={{ marginBottom: '0.75rem', fontSize: '1.25rem' }}>
                                    {locale === 'fr' ? project.titleFr : project.titleEn}
                                </h2>
                                <p style={{ color: '#888', marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: '1.5', height: '2.8rem', overflow: 'hidden' }}>
                                    {locale === 'fr' ? project.descriptionFr : project.descriptionEn}
                                </p>
                                <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                    VIEW_DETAILS &rarr;
                                </span>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
