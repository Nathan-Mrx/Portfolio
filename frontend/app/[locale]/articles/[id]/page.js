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
            <Link href="/articles" className="back-link">
                <ChevronLeft size={20} /> Back to Archive
            </Link>

            {article.coverUrl && (
                <div className="cover-container">
                    <img src={article.coverUrl} alt={title} className="cover-image" />
                    <div className="cover-overlay"></div>
                </div>
            )}

            <article className="content-container">
                <header className="article-header">
                    <span className="date">[{new Date(article.publishedAt).toLocaleDateString()}]</span>
                    <h1>{title}</h1>
                    {summary && <p className="summary">{summary}</p>}
                </header>

                <div className="blocks-wrapper">
                    <BlockRenderer blocks={article.contentBlocks} />
                </div>
            </article>

            <style jsx>{`
                .article-page {
                    min-height: 100vh;
                    background: #000;
                    color: #fff;
                    padding-bottom: 5rem;
                }
                .loading, .error {
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: monospace;
                    color: var(--primary);
                }
                .back-link {
                    position: fixed;
                    top: 2rem;
                    left: 2rem;
                    z-index: 100;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #888;
                    font-size: 0.9rem;
                    text-decoration: none;
                    transition: color 0.2s;
                    background: rgba(0,0,0,0.5);
                    backdrop-filter: blur(10px);
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    border: 1px solid #222;
                }
                .back-link:hover {
                    color: var(--primary);
                }
                .cover-container {
                    width: 100%;
                    height: 60vh;
                    position: relative;
                    overflow: hidden;
                }
                .cover-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .cover-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to bottom, transparent, #000);
                }
                .content-container {
                    max-width: 800px;
                    margin: -5rem auto 0;
                    position: relative;
                    z-index: 10;
                    padding: 0 2rem;
                }
                .article-header {
                    margin-bottom: 4rem;
                }
                .date {
                    font-family: monospace;
                    color: var(--primary);
                    font-size: 0.9rem;
                    letter-spacing: 2px;
                }
                h1 {
                    font-size: 3.5rem;
                    margin: 1rem 0;
                    line-height: 1.1;
                }
                .summary {
                    font-size: 1.25rem;
                    color: #888;
                    line-height: 1.6;
                    border-left: 2px solid #333;
                    padding-left: 1.5rem;
                    margin-top: 2rem;
                }
                .blocks-wrapper {
                    margin-top: 4rem;
                }
            `}</style>
        </div>
    );
}
