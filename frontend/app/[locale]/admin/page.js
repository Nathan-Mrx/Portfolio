'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit, FileText, Briefcase, Loader2, ExternalLink } from 'lucide-react';

export default function AdminDashboard({ params }) {
    const { locale } = use(params);
    const [projects, setProjects] = useState([]);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [projRes, artRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles`)
            ]);

            const projData = await projRes.json();
            const artData = await artRes.json();

            setProjects(projData['member'] || []);
            setArticles(artData['member'] || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-dashboard loading">
                <Loader2 className="animate-spin" size={48} />
                <p>Loading management console...</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <header className="dashboard-header">
                <h1>Dashboard</h1>
                <div className="quick-actions">
                    <Link href={`/${locale}/admin/projects/create`} className="action-btn">
                        <Plus size={18} /> New Project
                    </Link>
                    <Link href={`/${locale}/admin/articles/create`} className="action-btn">
                        <Plus size={18} /> New Article
                    </Link>
                </div>
            </header>

            <div className="stats-grid">
                <div className="stat-card glass">
                    <div className="stat-icon"><Briefcase size={24} /></div>
                    <div className="stat-info">
                        <h3>Projects</h3>
                        <p className="stat-value">{projects.length}</p>
                    </div>
                </div>
                <div className="stat-card glass">
                    <div className="stat-icon"><FileText size={24} /></div>
                    <div className="stat-info">
                        <h3>Articles</h3>
                        <p className="stat-value">{articles.length}</p>
                    </div>
                </div>
            </div>

            <div className="management-sections">
                <section className="dashboard-section">
                    <h2>Recent Projects</h2>
                    <div className="data-list">
                        {projects.map(project => (
                            <div key={project.id} className="data-item glass">
                                <div className="item-main">
                                    <span className="item-title">{project.titleEn}</span>
                                    <span className="item-meta">{project.titleFr}</span>
                                </div>
                                <div className="item-actions">
                                    <Link href={`/${locale}/admin/projects/${project.id}/edit`} className="edit-btn">
                                        <Edit size={16} /> Edit
                                    </Link>
                                    <a href={`/${locale}/projects/${project.id}`} target="_blank" className="view-btn">
                                        <ExternalLink size={16} />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="dashboard-section">
                    <h2>Recent Articles</h2>
                    <div className="data-list">
                        {articles.map(article => (
                            <div key={article.id} className="data-item glass">
                                <div className="item-main">
                                    <span className="item-title">{article.titleEn}</span>
                                    <span className="item-meta">{article.titleFr}</span>
                                </div>
                                <div className="item-actions">
                                    <Link href={`/${locale}/admin/articles/${article.id}/edit`} className="edit-btn">
                                        <Edit size={16} /> Edit
                                    </Link>
                                    <a href={`/${locale}/articles/${article.id}`} target="_blank" className="view-btn">
                                        <ExternalLink size={16} />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <style jsx>{`
                .admin-dashboard {
                    padding: 1rem;
                }
                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                .dashboard-header h1 {
                    font-size: 2rem;
                    margin: 0;
                }
                .quick-actions {
                    display: flex;
                    gap: 1rem;
                }
                .action-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: var(--primary);
                    color: #000;
                    padding: 0.6rem 1.2rem;
                    border-radius: 4px;
                    font-weight: 600;
                    font-size: 0.9rem;
                    transition: all 0.2s;
                }
                .action-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 255, 102, 0.2);
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 3rem;
                }
                .stat-card {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    padding: 1.5rem;
                }
                .stat-icon {
                    background: rgba(0, 255, 102, 0.1);
                    color: var(--primary);
                    padding: 1rem;
                    border-radius: 12px;
                }
                .stat-info h3 {
                    margin: 0;
                    font-size: 0.9rem;
                    color: #888;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .stat-value {
                    margin: 0;
                    font-size: 2rem;
                    font-weight: 700;
                    color: #fff;
                }

                .management-sections {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                }
                .dashboard-section h2 {
                    font-size: 1.25rem;
                    margin-bottom: 1.5rem;
                    color: #fff;
                }
                .data-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                .data-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 1.5rem;
                    transition: border-color 0.2s;
                }
                .data-item:hover {
                    border-color: rgba(0, 255, 102, 0.3);
                }
                .item-main {
                    display: flex;
                    flex-direction: column;
                }
                .item-title {
                    font-weight: 600;
                    color: #fff;
                }
                .item-meta {
                    font-size: 0.8rem;
                    color: #555;
                }
                .item-actions {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .edit-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    font-size: 0.85rem;
                    color: #888;
                    padding: 0.4rem 0.8rem;
                    border-radius: 4px;
                    border: 1px solid #333;
                    transition: all 0.2s;
                }
                .edit-btn:hover {
                    background: #1a1a1a;
                    color: #fff;
                    border-color: #555;
                }
                .view-btn {
                    color: #555;
                    transition: color 0.2s;
                }
                .view-btn:hover {
                    color: var(--primary);
                }

                .loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 50vh;
                    gap: 1rem;
                    color: #888;
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                @media (max-width: 900px) {
                    .management-sections {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}
