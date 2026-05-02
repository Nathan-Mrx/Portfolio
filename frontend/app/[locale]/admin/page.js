'use client';

import { useState, useEffect, use, useRef } from 'react';
import Link from 'next/link';
import {
    Plus, Edit, FileText, Briefcase, Loader2, ExternalLink,
    Search, User, Star, GripVertical, Check,
} from 'lucide-react';
import {
    DndContext, closestCenter,
    KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
    SortableContext, sortableKeyboardCoordinates,
    verticalListSortingStrategy, useSortable, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

function authHeaders(contentType = 'application/ld+json') {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    return { 'Content-Type': contentType, 'Authorization': `Bearer ${token}` };
}

/* ── Sortable row wrapper ── */
function SortableRow({ id, disabled, children }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id, disabled });

    return (
        <div
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition }}
            className={`list-row${isDragging ? ' dragging' : ''}`}
        >
            <div
                className={`grip${disabled ? ' grip-hidden' : ''}`}
                {...(disabled ? {} : { ...attributes, ...listeners })}
            >
                <GripVertical size={14} />
            </div>
            {children}
        </div>
    );
}

/* ── Autosave status badge ── */
function SaveStatus({ status }) {
    if (!status) return null;
    return (
        <span className={`save-status ${status}`}>
            {status === 'saving' && <Loader2 size={11} className="spin" />}
            {status === 'saved'  && <Check size={11} />}
            {status === 'saving' ? 'Saving…' : 'Saved'}
        </span>
    );
}

export default function AdminDashboard({ params }) {
    const { locale } = use(params);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    /* ── Projects ── */
    const [allProjects, setAllProjects] = useState([]);
    const [projectSearch, setProjectSearch] = useState('');
    const [projectsLoading, setProjectsLoading] = useState(true);
    const [projectSaveStatus, setProjectSaveStatus] = useState('');
    const projectSaveTimer = useRef(null);

    /* ── Articles ── */
    const [allArticles, setAllArticles] = useState([]);
    const [articleSearch, setArticleSearch] = useState('');
    const [articlesLoading, setArticlesLoading] = useState(true);
    const [articleSaveStatus, setArticleSaveStatus] = useState('');
    const articleSaveTimer = useRef(null);

    useEffect(() => { fetchProjects(); fetchArticles(); }, []);

    const fetchProjects = async () => {
        setProjectsLoading(true);
        try {
            const res = await fetch(`${API_URL}/projects?pagination=false&itemsPerPage=999`);
            const data = await res.json();
            setAllProjects(data['hydra:member'] || data['member'] || []);
        } finally { setProjectsLoading(false); }
    };

    const fetchArticles = async () => {
        setArticlesLoading(true);
        try {
            const res = await fetch(`${API_URL}/articles?pagination=false&itemsPerPage=999`);
            const data = await res.json();
            setAllArticles(data['hydra:member'] || data['member'] || []);
        } finally { setArticlesLoading(false); }
    };

    /* ── Reorder helpers ── */
    const triggerSave = async (url, ids, setStatus, timerRef) => {
        clearTimeout(timerRef.current);
        setStatus('saving');
        try {
            await fetch(url, {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify({ ids }),
            });
            setStatus('saved');
        } catch {
            setStatus('');
        }
        timerRef.current = setTimeout(() => setStatus(''), 2000);
    };

    const handleProjectDragEnd = ({ active, over }) => {
        if (!over || active.id === over.id) return;
        setAllProjects(prev => {
            const next = arrayMove(
                prev,
                prev.findIndex(p => p.id === active.id),
                prev.findIndex(p => p.id === over.id),
            );
            triggerSave(`${API_URL}/projects/reorder`, next.map(p => p.id), setProjectSaveStatus, projectSaveTimer);
            return next;
        });
    };

    const handleArticleDragEnd = ({ active, over }) => {
        if (!over || active.id === over.id) return;
        setAllArticles(prev => {
            const next = arrayMove(
                prev,
                prev.findIndex(a => a.id === active.id),
                prev.findIndex(a => a.id === over.id),
            );
            triggerSave(`${API_URL}/articles/reorder`, next.map(a => a.id), setArticleSaveStatus, articleSaveTimer);
            return next;
        });
    };

    const toggleFeatured = async (project) => {
        const isNowFeatured = !project.featured;
        const previousFeatured = allProjects.find(p => p.featured && p.id !== project.id);

        // Optimistic update: at most one featured at a time
        setAllProjects(prev => prev.map(p => ({
            ...p,
            featured: p.id === project.id ? isNowFeatured : false,
        })));

        // Unfeature the previous one if switching to a new one
        if (isNowFeatured && previousFeatured) {
            await fetch(`${API_URL}/projects/${previousFeatured.id}`, {
                method: 'PATCH',
                headers: authHeaders('application/merge-patch+json'),
                body: JSON.stringify({ featured: false }),
            });
        }

        await fetch(`${API_URL}/projects/${project.id}`, {
            method: 'PATCH',
            headers: authHeaders('application/merge-patch+json'),
            body: JSON.stringify({ featured: isNowFeatured }),
        });
    };

    /* ── Filtered views (client-side search) ── */
    const filteredProjects = projectSearch
        ? allProjects.filter(p =>
            p.titleEn?.toLowerCase().includes(projectSearch.toLowerCase()) ||
            p.titleFr?.toLowerCase().includes(projectSearch.toLowerCase()))
        : allProjects;

    const filteredArticles = articleSearch
        ? allArticles.filter(a =>
            a.titleEn?.toLowerCase().includes(articleSearch.toLowerCase()) ||
            a.titleFr?.toLowerCase().includes(articleSearch.toLowerCase()))
        : allArticles;

    const isSearchingProjects = projectSearch.length > 0;
    const isSearchingArticles = articleSearch.length > 0;

    return (
        <div className="admin-dashboard">
            {/* ── Header ── */}
            <header className="dash-header">
                <h1>ADMIN_CMD : <span className="neon">DASHBOARD</span></h1>
                <div className="quick-actions">
                    <Link href={`/${locale}/admin/profile`} className="cta-btn"><User size={16} /> Profile</Link>
                    <Link href={`/${locale}/admin/projects/create`} className="cta-btn"><Plus size={16} /> New project</Link>
                    <Link href={`/${locale}/admin/articles/create`} className="cta-btn"><Plus size={16} /> New article</Link>
                </div>
            </header>

            {/* ── Stats ── */}
            <div className="stats-row">
                <div className="stat hud-glass">
                    <Briefcase size={14} className="neon" />
                    <span className="stat-val neon">{allProjects.length.toString().padStart(3, '0')}</span>
                    <span className="stat-lbl">Projects</span>
                </div>
                <div className="stat hud-glass">
                    <FileText size={14} className="neon" />
                    <span className="stat-val neon">{allArticles.length.toString().padStart(3, '0')}</span>
                    <span className="stat-lbl">Articles</span>
                </div>
            </div>

            {/* ── Sections ── */}
            <div className="sections">
                {/* Projects */}
                <section className="panel hud-glass">
                    <div className="panel-header">
                        <h2 className="panel-title"><span className="neon">›</span> Projects</h2>
                        <div className="panel-actions">
                            <SaveStatus status={projectSaveStatus} />
                            <div className="search-box">
                                <Search size={13} className="neon" />
                                <input
                                    placeholder="Search…"
                                    value={projectSearch}
                                    onChange={e => setProjectSearch(e.target.value)}
                                    className="search-input"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="list-wrap">
                        {projectsLoading ? (
                            <div className="loading"><Loader2 size={20} className="spin neon" /></div>
                        ) : filteredProjects.length === 0 ? (
                            <div className="empty">No projects found.</div>
                        ) : (
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleProjectDragEnd}>
                                <SortableContext items={filteredProjects.map(p => p.id)} strategy={verticalListSortingStrategy}>
                                    {filteredProjects.map(project => (
                                        <SortableRow key={project.id} id={project.id} disabled={isSearchingProjects}>
                                            <div className="row-content">
                                                <div className="row-title">{project.titleEn}</div>
                                                <div className="row-meta">#{project.id.toString().padStart(4,'0')} · {new Date(project.createdAt).toLocaleDateString()}</div>
                                            </div>
                                            <div className="row-actions">
                                                <button
                                                    className={`icon-btn${project.featured ? ' featured' : ''}`}
                                                    onClick={() => toggleFeatured(project)}
                                                    title={project.featured ? 'Remove from featured' : 'Set as featured'}
                                                >
                                                    <Star size={14} fill={project.featured ? 'currentColor' : 'none'} />
                                                </button>
                                                <Link href={`/${locale}/admin/projects/${project.id}/edit`} className="icon-btn" title="Edit"><Edit size={14} /></Link>
                                                <a href={`/${locale}/projects/${project.id}`} target="_blank" className="icon-btn" title="View"><ExternalLink size={14} /></a>
                                            </div>
                                        </SortableRow>
                                    ))}
                                </SortableContext>
                            </DndContext>
                        )}
                    </div>
                </section>

                {/* Articles */}
                <section className="panel hud-glass">
                    <div className="panel-header">
                        <h2 className="panel-title"><span className="neon">›</span> Articles</h2>
                        <div className="panel-actions">
                            <SaveStatus status={articleSaveStatus} />
                            <div className="search-box">
                                <Search size={13} className="neon" />
                                <input
                                    placeholder="Search…"
                                    value={articleSearch}
                                    onChange={e => setArticleSearch(e.target.value)}
                                    className="search-input"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="list-wrap">
                        {articlesLoading ? (
                            <div className="loading"><Loader2 size={20} className="spin neon" /></div>
                        ) : filteredArticles.length === 0 ? (
                            <div className="empty">No articles found.</div>
                        ) : (
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleArticleDragEnd}>
                                <SortableContext items={filteredArticles.map(a => a.id)} strategy={verticalListSortingStrategy}>
                                    {filteredArticles.map(article => (
                                        <SortableRow key={article.id} id={article.id} disabled={isSearchingArticles}>
                                            <div className="row-content">
                                                <div className="row-title">{article.titleEn}</div>
                                                <div className="row-meta">#{article.id.toString().padStart(4,'0')} · {article.publishedAt ? 'Published' : 'Draft'}</div>
                                            </div>
                                            <div className="row-actions">
                                                <Link href={`/${locale}/admin/articles/${article.id}/edit`} className="icon-btn" title="Edit"><Edit size={14} /></Link>
                                                <a href={`/${locale}/articles/${article.id}`} target="_blank" className="icon-btn" title="View"><ExternalLink size={14} /></a>
                                            </div>
                                        </SortableRow>
                                    ))}
                                </SortableContext>
                            </DndContext>
                        )}
                    </div>
                </section>
            </div>

            <style jsx>{`
                .admin-dashboard {
                    padding: 2rem;
                    max-width: 1400px;
                    margin: 0 auto;
                    color: #e0e0e0;
                    font-family: 'JetBrains Mono', monospace;
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .neon { color: var(--primary); }

                .hud-glass {
                    background: rgba(12,12,12,0.8);
                    border: 1px solid rgba(255,255,255,0.06);
                    position: relative;
                }
                .hud-glass::before {
                    content: '';
                    position: absolute;
                    top: -1px; left: -1px;
                    width: 10px; height: 10px;
                    border-top: 2px solid var(--primary);
                    border-left: 2px solid var(--primary);
                }

                /* Header */
                .dash-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 1rem;
                    padding-bottom: 1.5rem;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }
                .dash-header h1 { font-size: 1.1rem; letter-spacing: 3px; margin: 0; }
                .quick-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
                .cta-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.6rem 1.25rem;
                    background: transparent;
                    border: 1px solid rgba(0,255,157,0.3);
                    color: var(--primary);
                    font-size: 0.78rem;
                    font-weight: 700;
                    font-family: inherit;
                    cursor: pointer;
                    transition: background 0.2s, border-color 0.2s;
                    text-decoration: none;
                }
                .cta-btn:hover { background: rgba(0,255,157,0.08); border-color: var(--primary); color: var(--primary); }

                /* Stats */
                .stats-row { display: flex; gap: 1rem; }
                .stat {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem 1.5rem;
                    flex: 1;
                    max-width: 220px;
                }
                .stat-val { font-size: 1.6rem; font-weight: 900; line-height: 1; }
                .stat-lbl { font-size: 0.65rem; color: #444; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }

                /* Sections grid */
                .sections { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }

                /* Panel */
                .panel { display: flex; flex-direction: column; }
                .panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.25rem 1.5rem;
                    border-bottom: 1px solid rgba(255,255,255,0.04);
                    gap: 1rem;
                }
                .panel-title { font-size: 0.85rem; font-weight: 800; color: #888; margin: 0; letter-spacing: 1px; }
                .panel-actions { display: flex; align-items: center; gap: 0.75rem; }

                .search-box {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(0,0,0,0.3);
                    border: 1px solid rgba(255,255,255,0.06);
                    padding: 0.4rem 0.75rem;
                }
                .search-input {
                    background: transparent;
                    border: none;
                    color: #ccc;
                    font-size: 0.78rem;
                    font-family: inherit;
                    width: 140px;
                    outline: none;
                }

                /* Save status */
                .save-status {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.35rem;
                    font-size: 0.65rem;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                    white-space: nowrap;
                }
                .save-status.saving { color: #888; }
                .save-status.saved  { color: var(--primary); }

                /* List */
                .list-wrap {
                    overflow-y: auto;
                    max-height: 480px;
                    padding: 0.5rem 0;
                    scrollbar-width: thin;
                    scrollbar-color: rgba(0,255,157,0.15) transparent;
                }

                /* Row */
                :global(.list-row) {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.5rem;
                    border-left: 2px solid transparent;
                    transition: background 0.15s, border-color 0.15s;
                }
                :global(.list-row:hover) {
                    background: rgba(0,255,102,0.03);
                    border-left-color: rgba(0,255,157,0.4);
                }
                :global(.list-row.dragging) {
                    background: rgba(0,255,102,0.07);
                    border-left-color: var(--primary);
                    box-shadow: 0 4px 24px rgba(0,0,0,0.6);
                    z-index: 10;
                }

                /* Grip */
                :global(.grip) {
                    color: #2a2a2a;
                    cursor: grab;
                    display: flex;
                    align-items: center;
                    flex-shrink: 0;
                    transition: color 0.15s;
                    touch-action: none;
                }
                :global(.grip:active) { cursor: grabbing; }
                :global(.list-row:hover .grip) { color: #444; }
                :global(.list-row.dragging .grip) { color: var(--primary); }
                :global(.grip.grip-hidden) { opacity: 0; pointer-events: none; }

                .row-content { flex: 1; min-width: 0; }
                .row-title { font-size: 0.88rem; font-weight: 600; color: #ddd; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .row-meta { font-size: 0.6rem; color: #444; margin-top: 0.15rem; }

                .row-actions { display: flex; gap: 0.4rem; flex-shrink: 0; }
                .icon-btn {
                    color: #333;
                    padding: 0.35rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: transparent;
                    border: 1px solid transparent;
                    cursor: pointer;
                    transition: color 0.15s, border-color 0.15s;
                    text-decoration: none;
                }
                .icon-btn:hover { color: var(--primary); border-color: rgba(0,255,157,0.2); }
                .icon-btn.featured { color: #ffd700; }
                .icon-btn.featured:hover { color: #ffd700; border-color: rgba(255,215,0,0.3); }

                .loading { height: 120px; display: flex; align-items: center; justify-content: center; }
                .empty { padding: 2rem; text-align: center; color: #2a2a2a; font-size: 0.8rem; }

                :global(.spin) { animation: spin 0.9s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }

                @media (max-width: 1100px) {
                    .sections { grid-template-columns: 1fr; }
                }
                @media (max-width: 700px) {
                    .admin-dashboard { padding: 1rem; }
                    .dash-header { flex-direction: column; align-items: flex-start; }
                    .stats-row { flex-wrap: wrap; }
                }
            `}</style>
        </div>
    );
}
