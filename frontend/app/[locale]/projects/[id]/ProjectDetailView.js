'use client';

import { useLocale } from 'next-intl';
import BlockRenderer from '@/components/BlockRenderer';
import OptimizedImage from '@/components/OptimizedImage';
import { ChevronLeft, ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import styles from './details.module.css';

export default function ProjectDetailView({ project }) {
    const locale = useLocale();

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
        <div className={styles.projectPage}>
            <div className={styles.detailContainer}>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link href="/projects" className={styles.backLink}>
                        <ChevronLeft size={20} /> Back to Projects
                    </Link>
                </motion.div>

                {project.coverUrl && (
                    <motion.div
                        className={styles.heroImageContainer}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                    >
                        <OptimizedImage
                            src={project.coverUrl}
                            alt={title}
                            preset="COVER"
                            priority
                        />
                    </motion.div>
                )}

                <main>
                    <motion.article
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <header className={styles.projectHeader}>
                            <div className={styles.meta}>
                                <span className={styles.idTag}>[{new Date(project.publishedAt || project.createdAt).toLocaleDateString()}]</span>
                                {project.updatedAt && (
                                    <span className={styles.updateTag}>Updated: {new Date(project.updatedAt).toLocaleDateString()}</span>
                                )}
                            </div>
                            <h1 className={styles.title}>{title}</h1>
                            {description && <div className={styles.summary}>{description}</div>}
                            {project.link && (
                                <a href={project.link} target="_blank" rel="noopener noreferrer" className={styles.externalLink}>
                                    View Live Project <ExternalLink size={18} />
                                </a>
                            )}
                        </header>

                        <div className={styles.contentBody}>
                            <BlockRenderer blocks={project.contentBlocks} />
                        </div>

                        {project.linkedArticles && project.linkedArticles.length > 0 && (
                            <section className={styles.relatedSection}>
                                <h2 className={styles.relatedTitle}>Related Technical Updates</h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {project.linkedArticles.map(article => (
                                        <Link key={article.id} href={`/articles/${article.id}`}
                                            style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', textDecoration: 'none', color: 'inherit', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div>
                                                <span style={{ color: 'var(--primary)', fontSize: '0.8rem', fontFamily: 'monospace' }}>[{new Date(article.publishedAt).toLocaleDateString()}]</span>
                                                <h4 style={{ margin: '0.25rem 0 0 0' }}>{locale === 'fr' ? article.titleFr : article.titleEn}</h4>
                                            </div>
                                            <ArrowRight size={18} />
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}
                    </motion.article>
                </main>
            </div>
        </div>
    );
}
