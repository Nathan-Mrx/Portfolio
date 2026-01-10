'use client';

import AuthGuard from '@/components/AuthGuard';
import { Link } from '@/i18n/routing';

export default function AdminLayout({ children }) {
    return (
        <AuthGuard>
            <div style={{ display: 'flex', minHeight: '100vh' }}>
                <aside style={{ width: '250px', background: '#080808', borderRight: '1px solid #333', padding: '2rem' }}>
                    <h2 style={{ color: 'var(--primary)', marginBottom: '2rem', letterSpacing: '1px' }}>COMMAND</h2>
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Link href="/admin" style={{ color: '#fff' }}>Dashboard</Link>
                        <Link href="/admin/projects/create" style={{ color: '#888' }}>+ New Project</Link>
                        <Link href="/admin/articles/create" style={{ color: '#888' }}>+ New Article</Link>
                        <button
                            onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}
                            style={{ marginTop: '2rem', background: 'transparent', border: '1px solid #333', color: '#666', padding: '0.5rem', cursor: 'pointer' }}
                        >
                            TERMINATE
                        </button>
                    </nav>
                </aside>
                <main style={{ flex: 1, padding: '3rem', background: '#0c0c0c' }}>
                    {children}
                </main>
            </div>
        </AuthGuard>
    );
}
