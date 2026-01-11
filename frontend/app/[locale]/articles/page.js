'use client';

import { useEffect, useState, use } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';
import Pagination from '@/components/Pagination';
import styles from './articles.module.css';

export default function Articles({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const locale = useLocale();
    const t = useTranslations('Articles');

    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 8;

    useEffect(() => {
        setLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/articles?page=${currentPage}&order[publishedAt]=desc`)
            .then(res => res.json())
            .then(data => {
                setArticles(data['hydra:member'] || data['member'] || []);
                setTotalItems(data['hydra:totalItems'] || data['totalItems'] || 0);
                setLoading(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            })
            .catch(err => {
                console.error('Failed to fetch articles:', err);
                setLoading(false);
            });
    }, [currentPage]);

    const getFullUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const origin = baseUrl.replace(/\/api$/, '');
        return `${origin}${path}`;
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
                ease: [0.2, 0.8, 0.2, 1]
            }
        }
    };

    if (loading) {
        return (
            <div className={styles.articlesPage}>
                <div className="container">
                    <div style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>RESYNCING_ARCHIVES...</div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.articlesPage}>
            <div className="container">
                <motion.h1
                    className={styles.title}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {t('title')}
                </motion.h1>

                <motion.div
                    className={styles.articlesList}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {articles.length === 0 ? (
                        <p>No articles found.</p>
                    ) : (
                        articles.map((article, index) => (
                            <motion.div key={article.id || index} variants={cardVariants}>
                                <Link
                                    href={`/articles/${article.id}`}
                                    className={styles.articleCard}
                                >
                                    {article.thumbnailUrl && (
                                        <div className={styles.imageContainer}>
                                            <OptimizedImage
                                                src={article.thumbnailUrl}
                                                alt={locale === 'fr' ? article.titleFr : article.titleEn}
                                                preset="THUMBNAIL"
                                            />
                                        </div>
                                    )}
                                    <div className={styles.content}>
                                        <div className={styles.meta}>
                                            <Calendar size={14} />
                                            {new Date(article.publishedAt).toLocaleDateString(locale, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                        <h2 className={styles.articleTitle}>
                                            {locale === 'fr' ? article.titleFr : article.titleEn}
                                        </h2>
                                        <p className={styles.articleSummary}>
                                            {locale === 'fr' ? article.contentFr : article.contentEn}
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    )}
                </motion.div>

                <Pagination
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
}

