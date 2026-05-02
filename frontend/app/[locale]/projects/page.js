'use client';

import { useEffect, useState, use } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';
import Pagination from '@/components/Pagination';
import styles from './projects.module.css';

export default function Projects({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const locale = useLocale();
    const t = useTranslations('Projects');

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 8;

    useEffect(() => {
        setLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/projects?page=${currentPage}`)
            .then(res => res.json())
            .then(data => {
                setProjects(data['hydra:member'] || data['member'] || []);
                setTotalItems(data['hydra:totalItems'] || data['totalItems'] || 0);
                setLoading(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            })
            .catch(err => {
                console.error('Failed to fetch projects:', err);
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
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.2, 0.8, 0.2, 1]
            }
        }
    };

    if (loading) {
        return (
            <div className={styles.projectsPage}>
                <div className="container">
                    <div style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>LOAD_PROJECTS_DATA...</div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.projectsPage}>
            <div className="container">
                <motion.h1
                    className={styles.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {t('title')}
                </motion.h1>

                <motion.div
                    className={styles.projectsGrid}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {projects.length === 0 ? (
                        <p>No projects found.</p>
                    ) : (
                        projects.map((project, index) => (
                            <motion.div key={project.id || index} variants={cardVariants}>
                                <Link
                                    href={`/projects/${project.id}`}
                                    className={styles.projectCard}
                                >
                                    <div className={styles.imageContainer}>
                                        <OptimizedImage
                                            src={project.thumbnailUrl || project.coverUrl}
                                            alt={locale === 'fr' ? project.titleFr : project.titleEn}
                                            preset="PROJECT_CARD"
                                        />
                                    </div>
                                    <div className={styles.cardContent}>
                                        <h2 className={styles.projectTitle}>
                                            {locale === 'fr' ? project.titleFr : project.titleEn}
                                        </h2>
                                        <p className={styles.projectDescription}>
                                            {locale === 'fr' ? project.descriptionFr : project.descriptionEn}
                                        </p>
                                        <span className={styles.viewDetails}>
                                            EXPLORE <ArrowRight size={16} />
                                        </span>
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

