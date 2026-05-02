'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { use, useEffect, useState } from 'react';
import styles from './page.module.css';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';

export default function Home({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const { locale } = params;
    const t = useTranslations('HomePage');
    const [featured, setFeatured] = useState(null);

    useEffect(() => {
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '');
        fetch(`${apiUrl}/projects?featured=true&itemsPerPage=1&pagination=true`)
            .then(r => r.json())
            .then(data => {
                const members = data['hydra:member'] || data['member'] || [];
                if (members.length > 0) setFeatured(members[0]);
            })
            .catch(() => {});
    }, []);

    const title = locale === 'fr'
        ? (featured?.titleFr || featured?.titleEn)
        : (featured?.titleEn || featured?.titleFr);
    const description = locale === 'fr'
        ? (featured?.descriptionFr || featured?.descriptionEn)
        : (featured?.descriptionEn || featured?.descriptionFr);

    return (
        <main className={`${styles.main} ${featured ? styles.withFeatured : ''}`}>
            {/* ── Hero ── */}
            <motion.section
                className={styles.hero}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.19, 1, 0.22, 1] }}
            >
                <h1 className={styles.title}>
                    {t('title').split(' ').map((word, i) => (
                        <span key={i} className={word.includes('{') ? styles.highlight : ''}>
                            {word.replace(/[{}]/g, '')}{' '}
                        </span>
                    ))}
                </h1>
                <p className={styles.description}>{t('description')}</p>
                <div className={styles.ctas}>
                    <Link href="/projects" className={styles.btnPrimary}>
                        {t('projects')}
                    </Link>
                    <Link href="/articles" className={styles.btnSecondary}>
                        {t('articles')}
                    </Link>
                </div>
            </motion.section>

            {/* ── Featured card — short delay so it lands just after the hero settles ── */}
            {featured && (
                <motion.section
                    className={styles.featuredSection}
                    initial={{ opacity: 0, y: 28, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.15, ease: [0.19, 1, 0.22, 1] }}
                >
                    <div className={styles.featuredLabel}>
                        <span className={styles.featuredDot} />
                        {t('featuredLabel')}
                    </div>

                    <Link href={`/projects/${featured.id}`} className={styles.featuredCard}>
                        {/* corner markers */}
                        <span className={`${styles.corner} ${styles.tl}`} />
                        <span className={`${styles.corner} ${styles.tr}`} />
                        <span className={`${styles.corner} ${styles.bl}`} />
                        <span className={`${styles.corner} ${styles.br}`} />

                        <div className={styles.cardImage}>
                            {featured.thumbnailUrl
                                ? <OptimizedImage src={featured.thumbnailUrl} alt={title} preset="THUMBNAIL" />
                                : <div className={styles.imageFallback} />
                            }
                            <div className={styles.scanOverlay} />
                            <div className={styles.scanLine} />
                        </div>

                        <div className={styles.cardContent}>
                            <h2 className={styles.cardTitle}>{title}</h2>
                            {description && (
                                <p className={styles.cardDesc}>
                                    {description.length > 160 ? description.slice(0, 160) + '…' : description}
                                </p>
                            )}
                            <span className={styles.cardCta}>
                                {t('viewProject')} <ArrowRight size={14} />
                            </span>
                        </div>
                    </Link>
                </motion.section>
            )}
        </main>
    );
}
