'use client';

import { useEffect, useState, use } from 'react';
import { useLocale } from 'next-intl';
import BlockRenderer from '@/components/BlockRenderer';
import { ChevronLeft, ExternalLink } from 'lucide-react';
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

    return (
        <div className="project-page">
            <div className="content-container">
                <Link href="/projects" className="back-link">
                    <ChevronLeft size={20} /> Back to Projects
                </Link>

                {project.coverUrl && (
                    <div className="hero-image-container">
                        <img src={project.coverUrl} alt={title} className="hero-image" />
                    </div>
                )}

                <main>
                    <header className="project-header" style={{ background: 'rgba(10, 10, 10, 0.8)', backdropFilter: 'blur(20px)', padding: '3rem', border: '1px solid #222', borderRadius: '16px' }}>
                        <span className="id-tag">PROJECT_ID_{project.id}</span>
                        <h1 style={{ fontSize: '4rem', margin: '1.5rem 0', lineHeight: '1', letterSpacing: '-2px' }}>{title}</h1>
                        <div className="summary-section" style={{ border: 'none', padding: '0', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {description && <p className="description">{description}</p>}
                            {project.link && (
                                <a href={project.link} target="_blank" rel="noopener noreferrer" className="live-link">
                                    Launch Execution <ExternalLink size={18} />
                                </a>
                            )}
                        </div>
                    </header>

                    <div className="blocks-wrapper">
                        <BlockRenderer blocks={project.contentBlocks} />
                    </div>
                </main>
            </div>
        </div>
    );
}
