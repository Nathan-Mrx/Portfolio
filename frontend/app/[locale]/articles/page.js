import { fetchAPI } from '@/lib/api';

export default async function Articles({ params }) {
    const { locale } = await params;
    let articles = [];

    try {
        const data = await fetchAPI('/articles');
        articles = data['hydra:member'] || [];
    } catch (error) {
        console.error('Failed to fetch articles:', error);
    }

    const { getTranslations } = await import('next-intl/server');
    const t = await getTranslations('Articles');

    return (
        <div className="container" style={{ paddingTop: '4rem' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>{t('title')}</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {articles.length === 0 ? (
                    <p>No articles found.</p>
                ) : (
                    articles.map((article) => (
                        <article key={article.id} className="glass" style={{ padding: '2rem', borderRadius: '12px' }}>
                            <h2 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>
                                {locale === 'fr' ? article.titleFr : article.titleEn}
                            </h2>
                            <p style={{ color: '#ccc', marginBottom: '1rem', lineHeight: '1.6' }}>
                                {locale === 'fr' ? article.contentFr : article.contentEn}
                            </p>
                            <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                {new Date(article.publishedAt).toLocaleDateString(locale)}
                            </div>
                        </article>
                    ))
                )}
            </div>
        </div>
    );
}
