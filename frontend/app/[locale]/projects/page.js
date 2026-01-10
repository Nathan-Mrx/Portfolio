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
    const t = await getTranslations('Projects');

    return (
        <div className="container" style={{ paddingTop: '4rem' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>{t('title')}</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {projects.length === 0 ? (
                    <p>No projects found.</p>
                ) : (
                    projects.map((project) => (
                        <div key={project.id} className="glass" style={{ padding: '1.5rem', borderRadius: '12px' }}>
                            {project.imageUrl && (
                                <img
                                    src={project.imageUrl}
                                    alt={locale === 'fr' ? project.titleFr : project.titleEn}
                                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }}
                                />
                            )}
                            <h2 style={{ marginBottom: '0.5rem' }}>
                                {locale === 'fr' ? project.titleFr : project.titleEn}
                            </h2>
                            <p style={{ color: '#aaa', marginBottom: '1rem' }}>
                                {locale === 'fr' ? project.descriptionFr : project.descriptionEn}
                            </p>
                            {project.link && (
                                <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>
                                    {t('viewProject')} &rarr;
                                </a>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
