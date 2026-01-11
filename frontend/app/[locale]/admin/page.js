'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit, FileText, Briefcase, Loader2, ExternalLink, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, User } from 'lucide-react';

export default function AdminDashboard({ params }) {
    const { locale } = use(params);

    // Project State
    const [projects, setProjects] = useState([]);
    const [projectSearch, setProjectSearch] = useState('');
    const [projectPage, setProjectPage] = useState(1);
    const [totalProjects, setTotalProjects] = useState(0);
    const [projectsLoading, setProjectsLoading] = useState(true);

    // Article State
    const [articles, setArticles] = useState([]);
    const [articleSearch, setArticleSearch] = useState('');
    const [articlePage, setArticlePage] = useState(1);
    const [totalArticles, setTotalArticles] = useState(0);
    const [articlesLoading, setArticlesLoading] = useState(true);

    // Initial Load & Updates
    useEffect(() => {
        fetchProjects();
    }, [projectPage, projectSearch]);

    useEffect(() => {
        fetchArticles();
    }, [articlePage, articleSearch]);

    const fetchProjects = async () => {
        setProjectsLoading(true);
        try {
            const query = new URLSearchParams({
                page: projectPage.toString(),
                itemsPerPage: '8',
                'order[createdAt]': 'desc'
            });

            if (projectSearch) {
                query.append('titleEn', projectSearch);
            }

            const url = `${process.env.NEXT_PUBLIC_API_URL}/projects?${query.toString()}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`API error: ${res.status}`);

            const data = await res.json();
            const members = data['hydra:member'] || data['member'] || [];
            const total = data['hydra:totalItems'] || data['totalItems'] || 0;

            setProjects(members);
            setTotalProjects(total);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setProjects([]);
            setTotalProjects(0);
        } finally {
            setProjectsLoading(false);
        }
    };

    const fetchArticles = async () => {
        setArticlesLoading(true);
        try {
            const query = new URLSearchParams({
                page: articlePage.toString(),
                itemsPerPage: '8',
                'order[publishedAt]': 'desc'
            });

            if (articleSearch) {
                query.append('titleEn', articleSearch);
            }

            const url = `${process.env.NEXT_PUBLIC_API_URL}/articles?${query.toString()}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`API error: ${res.status}`);

            const data = await res.json();
            const members = data['hydra:member'] || data['member'] || [];
            const total = data['hydra:totalItems'] || data['totalItems'] || 0;

            setArticles(members);
            setTotalArticles(total);
        } catch (error) {
            console.error('Error fetching articles:', error);
            setArticles([]);
            setTotalArticles(0);
        } finally {
            setArticlesLoading(false);
        }
    };

    const handleProjectSearch = (e) => {
        setProjectSearch(e.target.value);
        setProjectPage(1);
    };

    const handleArticleSearch = (e) => {
        setArticleSearch(e.target.value);
        setArticlePage(1);
    };

    const Pagination = ({ page, total, setPage, loading }) => {
        const totalPages = Math.ceil(total / 8);
        const [jumpValue, setJumpValue] = useState('');

        if (totalPages <= 1) return null;

        let start = Math.max(1, page - 2);
        let end = Math.min(totalPages, page + 2);

        if (end - start < 4) {
            if (start === 1) end = Math.min(totalPages, 5);
            else if (end === totalPages) start = Math.max(1, totalPages - 4);
        }

        const pages = [];
        for (let i = start; i <= end; i++) pages.push(i);

        const handleJump = (e) => {
            if (e.key === 'Enter') {
                const p = parseInt(jumpValue);
                if (p >= 1 && p <= totalPages) {
                    setPage(p);
                    setJumpValue('');
                }
            }
        };

        return (
            <div className="pagination">
                <div className="pagination-inner">
                    <div className="pg-controls">
                        <button onClick={() => setPage(1)} disabled={page === 1 || loading} className="cyber-btn icon-btn" title="FIRST">
                            <ChevronsLeft size={18} />
                        </button>
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || loading} className="cyber-btn icon-btn" title="PREV">
                            <ChevronLeft size={18} />
                        </button>

                        <div className="pg-numbers">
                            {pages.map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`cyber-btn num-btn ${p === page ? 'active' : ''}`}
                                    disabled={loading}
                                >
                                    {p.toString().padStart(2, '0')}
                                </button>
                            ))}
                        </div>

                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || loading} className="cyber-btn icon-btn" title="NEXT">
                            <ChevronRight size={18} />
                        </button>
                        <button onClick={() => setPage(totalPages)} disabled={page === totalPages || loading} className="cyber-btn icon-btn" title="LAST">
                            <ChevronsRight size={18} />
                        </button>
                    </div>

                    <div className="pg-jump-zone">
                        <div className="jump-status">
                            <span className="tiny-label">SYS_PRC:</span>
                            <span className="data-val">{page.toString().padStart(2, '0')}</span>
                            <span className="divider">/</span>
                            <span className="data-total">{totalPages.toString().padStart(2, '0')}</span>
                        </div>
                        <div className="jump-input-wrapper">
                            <span className="tiny-label">GOTO:</span>
                            <input
                                type="text"
                                placeholder="--"
                                value={jumpValue}
                                onChange={e => setJumpValue(e.target.value)}
                                onKeyDown={handleJump}
                                className="cyber-mini-input"
                            />
                        </div>
                    </div>
                </div>
                <div className="pg-decoration">
                    <div className="decor-line"></div>
                    <div className="decor-dots"><span></span><span></span><span></span></div>
                </div>
            </div>
        );
    };

    return (
        <div className="admin-dashboard">
            <header className="dashboard-header">
                <h1>ADMIN_CMD : <span className="neon-text">DASHBOARD</span></h1>
                <div className="quick-actions">
                    <Link href={`/${locale}/admin/profile`} className="cyber-rect-btn primary">
                        <User size={18} /> <span>SITE_PROFILE</span>
                    </Link>
                    <Link href={`/${locale}/admin/projects/create`} className="cyber-rect-btn primary">
                        <Plus size={18} /> <span>CRT_PROJECT</span>
                    </Link>
                    <Link href={`/${locale}/admin/articles/create`} className="cyber-rect-btn primary">
                        <Plus size={18} /> <span>CRT_ARTICLE</span>
                    </Link>
                </div>
            </header>

            <div className="stats-grid">
                <div className="stat-card hud-glass">
                    <div className="stat-header">
                        <Briefcase size={16} className="neon-text" />
                        <span className="hud-label">PRJ_TOTAL</span>
                    </div>
                    <div className="stat-body">
                        <div className="stat-value neon-text">{totalProjects.toString().padStart(3, '0')}</div>
                        <div className="stat-graph"><div className="bar" style={{ width: '70%' }}></div></div>
                    </div>
                </div>
                <div className="stat-card hud-glass">
                    <div className="stat-header">
                        <FileText size={16} className="neon-text" />
                        <span className="hud-label">ART_TOTAL</span>
                    </div>
                    <div className="stat-body">
                        <div className="stat-value neon-text">{totalArticles.toString().padStart(3, '0')}</div>
                        <div className="stat-graph"><div className="bar" style={{ width: '45%' }}></div></div>
                    </div>
                </div>
            </div>

            <div className="management-sections">
                <section className="dashboard-section hud-glass">
                    <div className="section-header">
                        <h2 className="hud-title"><span className="caret">{'>'}</span> DATABASE_PROJECTS</h2>
                        <div className="hud-search-wrapper">
                            <Search size={14} className="neon-text" />
                            <input
                                type="text"
                                placeholder="SRC_TITLE..."
                                value={projectSearch}
                                onChange={handleProjectSearch}
                                className="hud-input-field"
                            />
                        </div>
                    </div>

                    <div className="data-list">
                        {projectsLoading ? (
                            <div className="hud-loading"><Loader2 className="animate-spin neon-text" /></div>
                        ) : projects.length > 0 ? (
                            projects.map(project => (
                                <div key={project.id} className="data-item cyber-list-card">
                                    <div className="item-content">
                                        <div className="item-title">{project.titleEn}</div>
                                        <div className="item-sub">ID: #{project.id.toString().padStart(4, '0')} | DATE: {new Date(project.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <div className="item-actions">
                                        <Link href={`/${locale}/admin/projects/${project.id}/edit`} className="cyber-icon-link" title="EDIT">
                                            <Edit size={16} />
                                        </Link>
                                        <a href={`/${locale}/projects/${project.id}`} target="_blank" className="cyber-icon-link" title="VIEW">
                                            <ExternalLink size={16} />
                                        </a>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">NULL_DATA_SET</div>
                        )}
                    </div>

                    <Pagination page={projectPage} total={totalProjects} setPage={setProjectPage} loading={projectsLoading} />
                </section>

                <section className="dashboard-section hud-glass">
                    <div className="section-header">
                        <h2 className="hud-title"><span className="caret">{'>'}</span> DATABASE_ARTICLES</h2>
                        <div className="hud-search-wrapper">
                            <Search size={14} className="neon-text" />
                            <input
                                type="text"
                                placeholder="SRC_TITLE..."
                                value={articleSearch}
                                onChange={handleArticleSearch}
                                className="hud-input-field"
                            />
                        </div>
                    </div>

                    <div className="data-list">
                        {articlesLoading ? (
                            <div className="hud-loading"><Loader2 className="animate-spin neon-text" /></div>
                        ) : articles.length > 0 ? (
                            articles.map(article => (
                                <div key={article.id} className="data-item cyber-list-card">
                                    <div className="item-content">
                                        <div className="item-title">{article.titleEn}</div>
                                        <div className="item-sub">ID: #{article.id.toString().padStart(4, '0')} | STATUS: {article.publishedAt ? 'PUBLIC' : 'DRAFT'}</div>
                                    </div>
                                    <div className="item-actions">
                                        <Link href={`/${locale}/admin/articles/${article.id}/edit`} className="cyber-icon-link" title="EDIT">
                                            <Edit size={16} />
                                        </Link>
                                        <a href={`/${locale}/articles/${article.id}`} target="_blank" className="cyber-icon-link" title="VIEW">
                                            <ExternalLink size={16} />
                                        </a>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">NULL_DATA_SET</div>
                        )}
                    </div>

                    <Pagination page={articlePage} total={totalArticles} setPage={setArticlePage} loading={articlesLoading} />
                </section>
            </div>

            <style jsx>{`
                .admin-dashboard {
                    padding: 2rem;
                    max-width: 1600px;
                    margin: 0 auto;
                    color: #e0e0e0;
                    background: #080808;
                    font-family: 'JetBrains Mono', 'Courier New', monospace;
                }

                .neon-text {
                    color: var(--primary);
                    text-shadow: 0 0 10px rgba(0, 255, 102, 0.5);
                }

                .hud-glass {
                    background: rgba(15, 15, 15, 0.7);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
                    position: relative;
                }

                .hud-glass::before {
                    content: '';
                    position: absolute;
                    top: -1px; left: -1px; width: 10px; height: 10px;
                    border-top: 2px solid var(--primary);
                    border-left: 2px solid var(--primary);
                }

                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 3rem;
                    padding-bottom: 1.5rem;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }

                .dashboard-header h1 {
                    font-size: 1.25rem;
                    letter-spacing: 4px;
                    margin: 0;
                }

                .cyber-rect-btn {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 0.8rem 2rem;
                    background: #000;
                    border: 1px solid var(--primary);
                    color: var(--primary);
                    font-weight: 800;
                    font-size: 0.85rem;
                    transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
                    clip-path: polygon(0% 0%, 90% 0%, 100% 30%, 100% 100%, 10% 100%, 0% 70%);
                }

                .cyber-rect-btn:hover {
                    background: var(--primary);
                    color: #000;
                    box-shadow: 0 0 20px rgba(0, 255, 102, 0.4);
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 2rem;
                    margin-bottom: 3rem;
                }

                .stat-card {
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .stat-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .hud-label {
                    font-size: 0.7rem;
                    color: #555;
                    font-weight: 700;
                    letter-spacing: 1px;
                }

                .stat-value {
                    font-size: 2.5rem;
                    font-weight: 900;
                    line-height: 1;
                }

                .stat-graph {
                    height: 4px;
                    background: #1a1a1a;
                    width: 100%;
                    margin-top: 1rem;
                }

                .stat-graph .bar {
                    height: 100%;
                    background: var(--primary);
                    box-shadow: 0 0 10px var(--primary);
                }

                .management-sections {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                }

                .dashboard-section {
                    padding: 2rem;
                    min-height: 500px;
                    display: flex;
                    flex-direction: column;
                }

                .hud-title {
                    font-size: 0.9rem;
                    font-weight: 800;
                    color: #888;
                    margin: 0;
                }

                .caret { color: var(--primary); }

                .hud-search-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    background: #0a0a0a;
                    border: 1px solid #222;
                    padding: 0.5rem 1rem;
                }

                .hud-input-field {
                    background: transparent;
                    border: none;
                    color: #fff;
                    font-size: 0.8rem;
                    font-family: inherit;
                    width: 100%;
                }

                .hud-input-field:focus { outline: none; }

                .data-list {
                    flex: 1;
                    margin: 1.5rem 0;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .cyber-list-card {
                    padding: 1rem 1.5rem;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: all 0.2s;
                    border-left: 2px solid transparent;
                }

                .cyber-list-card:hover {
                    background: rgba(0, 255, 102, 0.03);
                    border-left-color: var(--primary);
                    transform: translateX(5px);
                }

                .item-title {
                    font-weight: 700;
                    font-size: 0.95rem;
                }

                .item-sub {
                    font-size: 0.65rem;
                    color: #555;
                    margin-top: 0.25rem;
                }

                .item-actions {
                    display: flex;
                    gap: 0.75rem;
                }

                .cyber-icon-link {
                    color: #444;
                    padding: 0.5rem;
                    background: #111;
                    border: 1px solid #222;
                    transition: all 0.2s;
                }

                .cyber-icon-link:hover {
                    color: var(--primary);
                    border-color: var(--primary);
                    box-shadow: 0 0 10px rgba(0, 255, 102, 0.2);
                }

                /* PAGINATION REDESIGN */
                .pagination {
                    margin-top: auto;
                    padding: 1.5rem 0 0 0;
                    border-top: 1px dashed rgba(255,255,255,0.1);
                }

                .pagination-inner {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 2rem;
                }

                .pg-controls {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                }

                .pg-numbers {
                    display: flex;
                    gap: 0.4rem;
                }

                .cyber-btn {
                    background: #0a0a0a;
                    border: 1px solid #333;
                    color: #666;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: inherit;
                    font-weight: 800;
                    position: relative;
                    transition: all 0.2s;
                }

                .icon-btn { width: 40px; height: 35px; }
                .num-btn { width: 40px; height: 35px; font-size: 0.8rem; }

                .cyber-btn:hover:not(:disabled) {
                    border-color: var(--primary);
                    color: var(--primary);
                    box-shadow: 0 0 15px rgba(0, 255, 102, 0.2);
                }

                .cyber-btn.active {
                    background: var(--primary);
                    color: #000;
                    border-color: var(--primary);
                    box-shadow: 0 0 20px rgba(0, 255, 102, 0.5);
                }

                .cyber-btn:disabled {
                    opacity: 0.2;
                    cursor: not-allowed;
                }

                .pg-jump-zone {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }

                .jump-status {
                    display: flex;
                    align-items: baseline;
                    gap: 0.4rem;
                }

                .tiny-label {
                    font-size: 0.6rem;
                    color: #444;
                    font-weight: 900;
                }

                .data-val { color: var(--primary); font-size: 1.1rem; }
                .data-total { color: #555; font-size: 0.8rem; }
                .divider { color: #222; }

                .jump-input-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    border: 1px solid #222;
                    padding: 0.2rem 0.6rem;
                    background: #000;
                }

                .cyber-mini-input {
                    width: 30px;
                    background: transparent;
                    border: none;
                    border-bottom: 1px solid #333;
                    color: var(--primary);
                    text-align: center;
                    font-size: 0.8rem;
                    font-family: inherit;
                }

                .cyber-mini-input:focus { outline: none; border-bottom-color: var(--primary); }

                .pg-decoration {
                    margin-top: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    opacity: 0.5;
                }

                .decor-line { height: 1px; flex: 1; background: linear-gradient(90deg, var(--primary), transparent); }
                .decor-dots { display: flex; gap: 4px; }
                .decor-dots span { width: 4px; height: 4px; border: 1px solid var(--primary); }

                .hud-loading { height: 100px; display: flex; center; align-items: center; justify-content: center; }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                @media (max-width: 1200px) {
                    .management-sections { grid-template-columns: 1fr; }
                    .pagination-inner { flex-direction: column; gap: 1rem; }
                }
            `}</style>
        </div>
    );
}
