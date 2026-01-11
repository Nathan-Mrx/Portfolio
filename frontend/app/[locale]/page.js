'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import styles from "./page.module.css";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from 'react';

export default function Home() {
  const t = useTranslations('HomePage');

  // Mouse tracking for spotlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for spotlight
  const lightX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const lightY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Parallax for dots (subtle shift)
  const dotsX = useTransform(mouseX, [0, 1000], [10, -10]);
  const dotsY = useTransform(mouseY, [0, 1000], [10, -10]);

  useEffect(() => {
    // Set initial position to center
    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

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
      {/* Background Dots with Parallax */}
      <motion.div
        className={styles['background-dots']}
        style={{ x: dotsX, y: dotsY }}
      />

      {/* Interactive Spotlight */}
      <motion.div
        className={styles.spotlight}
        style={{
          '--x': useTransform(lightX, (val) => `${val}px`),
          '--y': useTransform(lightY, (val) => `${val}px`)
        }}
      />

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
