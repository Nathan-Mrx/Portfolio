'use client';

import { useEffect, useState, use } from 'react';
import { useLocale } from 'next-intl';
import BlockRenderer from '@/components/BlockRenderer';
import { ChevronLeft, Briefcase } from 'lucide-react';
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

    const getFullUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const origin = baseUrl.replace(/\/api$/, '');
        return `${origin}${path}`;
    };

    const title = locale === 'fr' ? article.titleFr : article.titleEn;
    const summary = locale === 'fr' ? article.contentFr : article.contentEn;

    return (
        <div className="article-page" style={{ paddingTop: '6rem' }}>
            <div className="content-container">
                <Link href="/articles" className="back-link">
                    <ChevronLeft size={20} /> Back to Archive
                </Link>

                {article.coverUrl && (
                    <div className="hero-image-container">
                        <img src={getFullUrl(article.coverUrl)} alt={title} className="hero-image" />
                    </div>
                )}

                <article>
                    <header className="article-header">
                        <div className="article-meta">
                            <span className="id-tag">[{new Date(article.publishedAt).toLocaleDateString()}]</span>
                            {article.updatedAt && (
                                <span className="update-tag">Updated: {new Date(article.updatedAt).toLocaleDateString()}</span>
                            )}
                        </div>
                        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{title}</h1>
                        {summary && <div className="summary-section">{summary}</div>}
                    </header>

                    <div className="blocks-wrapper">
                        <BlockRenderer blocks={article.contentBlocks} />
                    </div>

                    {article.linkedProjects && article.linkedProjects.length > 0 && (
                        <div className="related-content">
                            <h2 className="related-title">Related Projects</h2>
                            <div className="related-grid">
                                {article.linkedProjects.map((project, index) => (
                                    <Link key={`${project.id}-${index}`} href={`/projects/${project.id}`} className="related-card glass">
                                        <div className="related-card-img">
                                            {project.thumbnailUrl ? (
                                                <img src={getFullUrl(project.thumbnailUrl)} alt={project.titleEn} />
                                            ) : (
                                                <div className="placeholder-icon"><Briefcase size={24} /></div>
                                            )}
                                        </div>
                                        <div className="related-card-info">
                                            <h4>{locale === 'fr' ? project.titleFr : project.titleEn}</h4>
                                            <p>{locale === 'fr' ? project.descriptionFr : project.descriptionEn}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {article.relatedArticles && article.relatedArticles.length > 0 && (
                        <div className="related-content" style={{ marginTop: '2rem', borderTop: 'none' }}>
                            <h2 className="related-title">More Articles</h2>
                            <div className="related-grid list">
                                {article.relatedArticles.map(relArt => (
                                    <Link key={relArt.id} href={`/articles/${relArt.id}`} className="related-article-item glass">
                                        <div className="related-article-info">
                                            <span className="article-date">{new Date(relArt.publishedAt).toLocaleDateString()}</span>
                                            <h4>{locale === 'fr' ? relArt.titleFr : relArt.titleEn}</h4>
                                        </div>
                                        <Briefcase size={18} />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </article>
            </div>
        </div>
    );
}
