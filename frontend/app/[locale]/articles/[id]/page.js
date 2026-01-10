'use client';

import { useEffect, useState, use } from 'react';
import { useLocale } from 'next-intl';
import BlockRenderer from '@/components/BlockRenderer';
import { ChevronLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function ArticleDetail({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const locale = useLocale();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/articles/${params.id}`)
            .then(res => res.json())
            .then(data => {
                setArticle(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [params.id]);

    if (loading) return <div className="loading">Initializing System Data...</div>;
    if (!article) return <div className="error">Article not found.</div>;

    const title = locale === 'fr' ? article.titleFr : article.titleEn;
    const summary = locale === 'fr' ? article.contentFr : article.contentEn;

    return (
        <div className="article-page">
            <div className="content-container">
                <Link href="/articles" className="back-link">
                    <ChevronLeft size={20} /> Back to Archive
                </Link>

                {article.coverUrl && (
                    <div className="hero-image-container">
                        <img src={article.coverUrl} alt={title} className="hero-image" />
                    </div>
                )}

                <article>
                    <header className="article-header">
                        <span className="id-tag">[{new Date(article.publishedAt).toLocaleDateString()}]</span>
                        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{title}</h1>
                        {summary && <div className="summary-section">{summary}</div>}
                    </header>

                    <div className="blocks-wrapper">
                        <BlockRenderer blocks={article.contentBlocks} />
                    </div>
                </article>
            </div>
        </div>
    );
}
