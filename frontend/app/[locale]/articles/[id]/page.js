import ArticleDetailView from './ArticleDetailView';

async function getArticle(id) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/articles/${id}`, {
        cache: 'no-store'
    });
    if (!res.ok) return null;
    return res.json();
}

export async function generateMetadata({ params: paramsPromise }) {
    const params = await paramsPromise;
    const article = await getArticle(params.id);
    const locale = params.locale;

    if (!article) return { title: 'Article Not Found' };

    const title = locale === 'fr' ? article.titleFr : article.titleEn;
    const description = locale === 'fr' ? (article.contentFr || article.titleFr) : (article.contentEn || article.titleEn);

    const getFullUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const origin = baseUrl.replace(/\/api$/, '');
        return `${origin}${path}`;
    };

    const ogImage = article.coverUrl ? getFullUrl(article.coverUrl) : '/og-image.png';

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            images: [ogImage],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: [ogImage],
        }
    };
}

export default async function ArticlePage({ params: paramsPromise }) {
    const params = await paramsPromise;
    const article = await getArticle(params.id);

    if (!article) return <div className="error">Article not found.</div>;

    return <ArticleDetailView article={article} />;
}
