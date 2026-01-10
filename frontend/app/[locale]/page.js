import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import styles from "./page.module.css";

export default function Home() {
  const t = useTranslations('HomePage');

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1 className={styles.title}>
          {t('title')}
        </h1>
        <p className={styles.description}>
          {t('description')}
        </p>
        <div className={styles.ctas}>
          <Link href="/projects" className="btn btn-primary" style={{ background: 'var(--primary)', color: '#000', marginRight: '1rem' }}>
            {t('projects')}
          </Link>
          <Link href="/articles" className="btn btn-secondary" style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)' }}>
            {t('articles')}
          </Link>
        </div>
      </section>
    </main>
  );
}
