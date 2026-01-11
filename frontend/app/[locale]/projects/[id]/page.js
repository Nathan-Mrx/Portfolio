'use client';

import { useEffect, useState, use } from 'react';
import { useLocale } from 'next-intl';
import BlockRenderer from '@/components/BlockRenderer';
import { ChevronLeft, ExternalLink, FileText, ArrowRight, Briefcase } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function ProjectDetail({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const locale = useLocale();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/projects/${params.id}`)
            .then(res => res.json())
            .then(data => {
                setProject(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [params.id]);

    if (loading) return <div className="loading">Initializing Core Data...</div>;
    if (!project) return <div className="error">Project not found.</div>;

    const title = locale === 'fr' ? project.titleFr : project.titleEn;
    const description = locale === 'fr' ? project.descriptionFr : project.descriptionEn;

    const getFullUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const origin = baseUrl.replace(/\/api$/, '');
        return `${origin}${path}`;
    };

    return (
        <div className="project-page" style={{ paddingTop: '6rem' }}>
            <div className="content-container">
                <Link href="/projects" className="back-link">
                    <ChevronLeft size={20} /> Back to Projects
                </Link>

                {project.coverUrl && (
                    <div className="hero-image-container">
                        <img src={getFullUrl(project.coverUrl)} alt={title} className="hero-image" />
                    </div>
                )}

                <main>
                    <article>
                        <header className="project-header">
                            <div className="project-meta">
                                <span className="id-tag">[{new Date(project.publishedAt || project.createdAt).toLocaleDateString()}]</span>
                                {project.updatedAt && (
                                    <span className="update-tag">Updated: {new Date(project.updatedAt).toLocaleDateString()}</span>
                                )}
                            </div>
                            <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{title}</h1>
                            {description && <div className="summary-section">{description}</div>}
                            {project.link && (
                                <a href={project.link} target="_blank" rel="noopener noreferrer" className="external-link">
                                    View Project <ExternalLink size={18} />
                                </a>
                            )}
                        </header>
                        <div className="blocks-wrapper">
                            <BlockRenderer blocks={project.contentBlocks} />
                        </div>

                        {project.linkedArticles && project.linkedArticles.length > 0 && (
                            <div className="related-content">
                                <h2 className="related-title">Related Articles</h2>
                                <div className="related-grid list">
                                    {project.linkedArticles.map(article => (
                                        <Link key={article.id} href={`/articles/${article.id}`} className="related-article-item glass">
                                            <div className="related-article-info">
                                                <span className="article-date">{new Date(article.publishedAt).toLocaleDateString()}</span>
                                                <h4>{locale === 'fr' ? article.titleFr : article.titleEn}</h4>
                                            </div>
                                            <ArrowRight size={18} />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {project.relatedProjects && project.relatedProjects.length > 0 && (
                            <div className="related-content" style={{ marginTop: '2rem', borderTop: 'none' }}>
                                <h2 className="related-title">More Projects</h2>
                                <div className="related-grid">
                                    {project.relatedProjects.map(relProj => (
                                        <Link key={relProj.id} href={`/projects/${relProj.id}`} className="related-card glass">
                                            <div className="related-card-img">
                                                {relProj.thumbnailUrl ? (
                                                    <img src={getFullUrl(relProj.thumbnailUrl)} alt={relProj.titleEn} />
                                                ) : (
                                                    <div className="placeholder-icon"><Briefcase size={24} /></div>
                                                )}
                                            </div>
                                            <div className="related-card-info">
                                                <h4>{locale === 'fr' ? relProj.titleFr : relProj.titleEn}</h4>
                                                <p>{locale === 'fr' ? relProj.descriptionFr : relProj.descriptionEn}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </article>
                </main>
            </div>
        </div>
    );
}
