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
            <Link href="/projects" className="back-link">
                <ChevronLeft size={20} /> Back to Projects
            </Link>

            {project.coverUrl && (
                <div className="cover-container">
                    <img src={project.coverUrl} alt={title} className="cover-image" />
                    <div className="cover-overlay"></div>
                </div>
            )}

            <main className="content-container">
                <header className="project-header">
                    <span className="id-tag">PROJECT_ID_{project.id}</span>
                    <h1>{title}</h1>
                    <div className="summary-section">
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

            <style jsx>{`
                .project-page {
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
                    max-width: 900px;
                    margin: -8rem auto 0;
                    position: relative;
                    z-index: 10;
                    padding: 0 2rem;
                }
                .project-header {
                    margin-bottom: 5rem;
                    background: rgba(10, 10, 10, 0.8);
                    backdrop-filter: blur(20px);
                    padding: 3rem;
                    border: 1px solid #222;
                    border-radius: 16px;
                }
                .id-tag {
                    font-family: monospace;
                    color: var(--primary);
                    font-size: 0.8rem;
                    letter-spacing: 2px;
                }
                h1 {
                    font-size: 4rem;
                    margin: 1.5rem 0;
                    line-height: 1;
                    letter-spacing: -2px;
                }
                .summary-section {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    margin-top: 2rem;
                }
                .description {
                    font-size: 1.2rem;
                    color: #aaa;
                    line-height: 1.6;
                    max-width: 700px;
                }
                .live-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.75rem;
                    background: var(--primary);
                    color: #000;
                    text-decoration: none;
                    padding: 1rem 2rem;
                    border-radius: 8px;
                    font-weight: 700;
                    width: fit-content;
                    transition: transform 0.2s, background 0.2s;
                }
                .live-link:hover {
                    background: #00d152;
                    transform: translateY(-2px);
                }
                .blocks-wrapper {
                    margin-top: 4rem;
                }
            `}</style>
        </div>
    );
}
