'use client';

import { useLocale } from 'next-intl';
import BlockRenderer from '@/components/BlockRenderer';
import OptimizedImage from '@/components/OptimizedImage';
import { ChevronLeft, Calendar, Clock } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import styles from './details.module.css';

export default function ArticleDetailView({ article }) {
    const locale = useLocale();

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
        <div className={styles.articlePage}>
            <div className={styles.detailContainer}>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link href="/articles" className={styles.backLink}>
                        <ChevronLeft size={20} /> Back to Archive
                    </Link>
                </motion.div>

                {article.coverUrl && (
                    <motion.div
                        className={styles.heroImageContainer}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                    >
                        <OptimizedImage
                            src={article.coverUrl}
                            alt={title}
                            preset="COVER"
                            priority
                        />
                    </motion.div>
                )}

                <motion.article
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <header className={styles.articleHeader}>
                        <div className={styles.meta}>
                            <span className={styles.idTag}>
                                <Calendar size={14} style={{ display: 'inline', marginRight: '5px' }} />
                                {new Date(article.publishedAt).toLocaleDateString()}
                            </span>
                            {article.updatedAt && (
                                <span className={styles.updateTag}>
                                    <Clock size={14} style={{ display: 'inline', marginRight: '5px' }} />
                                    Updated: {new Date(article.updatedAt).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                        <h1 className={styles.title}>{title}</h1>
                        {summary && <div className={styles.summary}>{summary}</div>}
                    </header>

                    <div className={styles.contentBody}>
                        <BlockRenderer blocks={article.contentBlocks} />
                    </div>

                    {article.linkedProjects && article.linkedProjects.length > 0 && (
                        <section className={styles.relatedSection}>
                            <h2 className={styles.relatedTitle}>Featured In Projects</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                {article.linkedProjects.map((project, index) => (
                                    <Link key={`${project.id}-${index}`} href={`/projects/${project.id}`}
                                        style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', textDecoration: 'none', color: 'inherit', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s' }}>
                                        {project.thumbnailUrl && (
                                            <div style={{ width: '80px', height: '80px', flexShrink: 0 }}>
                                                <OptimizedImage
                                                    src={project.thumbnailUrl}
                                                    alt=""
                                                    preset="THUMBNAIL"
                                                    className="rounded-mini"
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <h4 style={{ margin: '0' }}>{locale === 'fr' ? project.titleFr : project.titleEn}</h4>
                                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#888' }}>{locale === 'fr' ? project.descriptionFr : project.descriptionEn}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </motion.article>
            </div>
        </div>
    );
}
