'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import styles from "./page.module.css";
import { motion } from "framer-motion";

export default function Home() {
  const t = useTranslations('HomePage');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.19, 1, 0.22, 1]
      }
    }
  };

  return (
    <main className={styles.main}>
      <motion.section
        className={styles.hero}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1 className={styles.title} variants={itemVariants}>
          {t('title').split(' ').map((word, i) => (
            <span key={i} className={word.includes('{') || word.includes('highlight') ? styles.highlight : ''}>
              {word.replace('{', '').replace('}', '')}{' '}
            </span>
          ))}
        </motion.h1>

        <motion.p className={styles.description} variants={itemVariants}>
          {t('description')}
        </motion.p>

        <motion.div className={styles.ctas} variants={itemVariants}>
          <Link href="/projects" className="btn btn-primary" style={{ background: 'var(--primary)', color: '#000', marginRight: '1rem' }}>
            {t('projects')}
          </Link>
          <Link href="/articles" className="btn btn-secondary" style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)' }}>
            {t('articles')}
          </Link>
        </motion.div>
      </motion.section>
    </main>
  );
}
