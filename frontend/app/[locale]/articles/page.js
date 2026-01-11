import { fetchAPI } from '@/lib/api';

export default async function Articles({ params }) {
    const { locale } = await params;
    let articles = [];

    try {
        const data = await fetchAPI('/articles');
        articles = data['hydra:member'] || data['member'] || [];
    } catch (error) {
        console.error('Failed to fetch articles:', error);
    }

    const { getTranslations } = await import('next-intl/server');
    const { Link } = await import('@/i18n/routing');
    const t = await getTranslations('Articles');

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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {articles.length === 0 ? (
                    <p>No articles found.</p>
                ) : (
                    articles.map((article, index) => (
                        <Link
                            key={article.id || index}
                            href={`/articles/${article.id}`}
                            className="glass article-card"
                            style={{
                                display: 'flex',
                                gap: '2rem',
                                padding: '1.5rem',
                                borderRadius: '16px',
                                textDecoration: 'none',
                                color: 'inherit',
                                border: '1px solid #222',
                                transition: 'all 0.3s'
                            }}
                        >
                            {article.thumbnailUrl && (
                                <div style={{ width: '200px', height: '140px', flexShrink: 0, overflow: 'hidden', borderRadius: '8px' }}>
                                    <img
                                        src={getFullUrl(article.thumbnailUrl)}
                                        alt=""
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            )}
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontFamily: 'monospace', marginBottom: '0.5rem' }}>
                                    {new Date(article.publishedAt).toLocaleDateString(locale)}
                                </div>
                                <h2 style={{ marginBottom: '0.75rem', fontSize: '1.5rem' }}>
                                    {locale === 'fr' ? article.titleFr : article.titleEn}
                                </h2>
                                <p style={{ color: '#888', lineHeight: '1.6', fontSize: '1rem' }}>
                                    {locale === 'fr' ? article.contentFr : article.contentEn}
                                </p>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
