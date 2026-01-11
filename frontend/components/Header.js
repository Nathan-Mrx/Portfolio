'use client';

import { Link } from '@/i18n/routing';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, Terminal, Command } from 'lucide-react';

export default function Header({ locale }) {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path) => {
        if (path === '/') return pathname === `/${locale}` || pathname === '/';
        return pathname.includes(path);
    };

    const navItems = [
        { label: 'Home', path: '/' },
        { label: 'Projects', path: '/projects' },
        { label: 'Articles', path: '/articles' },
    ];

    return (
        <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
            <div className="container header-inner">
                <Link href="/" className="logo">
                    <Terminal size={24} className="logo-icon" />
                    <span className="logo-text">DEV_PORTFOLIO</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="desktop-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                        >
                            <span className="link-text">{item.label}</span>
                            <span className="link-glow"></span>
                        </Link>
                    ))}
                    <Link href="/admin" className="nav-link admin-link">
                        <Command size={16} />
                        <span>Admin</span>
                    </Link>
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    className="mobile-toggle"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Mobile Nav */}
                <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
                    <div className="mobile-nav-inner glass">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`mobile-link ${isActive(item.path) ? 'active' : ''}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <Link
                            href="/admin"
                            className="mobile-link admin-link"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Admin
                        </Link>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .site-header {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                    padding: 1.5rem 0;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border-bottom: 1px solid transparent;
                }

                .site-header.scrolled {
                    padding: 1rem 0;
                    background: rgba(5, 5, 5, 0.85);
                    backdrop-filter: blur(12px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }

                .header-inner {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .logo {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    color: #fff;
                    font-weight: 700;
                    font-size: 1.1rem;
                    letter-spacing: 1px;
                    transition: opacity 0.2s;
                    text-decoration: none;
                }

                .logo:hover {
                    opacity: 0.8;
                }

                .logo-icon {
                    color: var(--primary);
                }

                /* Desktop Navigation */
                .desktop-nav {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(255, 255, 255, 0.03);
                    padding: 0.5rem;
                    border-radius: 100px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .nav-link {
                    position: relative;
                    padding: 0.6rem 1.25rem;
                    color: #888;
                    font-size: 0.9rem;
                    font-weight: 500;
                    text-decoration: none;
                    transition: all 0.3s;
                    border-radius: 100px;
                }

                .nav-link:hover {
                    color: #fff;
                }

                .nav-link.active {
                    color: #000;
                    background: var(--primary);
                    font-weight: 600;
                    box-shadow: 0 0 20px rgba(0, 255, 102, 0.3);
                }
                
                .admin-link {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    border-left: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0;
                    padding-left: 1rem;
                    margin-left: 0.5rem;
                    border-radius: 4px;
                }
                
                .admin-link:hover {
                    color: var(--primary);
                    background: transparent;
                }
                
                .nav-link.active.admin-link {
                     background: transparent;
                     color: var(--primary);
                     box-shadow: none;
                }

                /* Mobile Navigation */
                .mobile-toggle {
                    display: none;
                    background: none;
                    border: none;
                    color: #fff;
                    cursor: pointer;
                    z-index: 1001;
                }

                .mobile-nav {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100vh;
                    pointer-events: none;
                    opacity: 0;
                    transition: opacity 0.3s;
                    z-index: 999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                }

                .mobile-nav.open {
                    pointer-events: auto;
                    opacity: 1;
                }

                .mobile-nav-inner {
                    width: 100%;
                    max-width: 320px;
                    display: flex;
                    flex-direction: column;
                    padding: 2rem;
                    gap: 1rem;
                    background: rgba(10, 10, 10, 0.95);
                    border-radius: 20px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    transform: translateY(20px);
                    transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
                }

                .mobile-nav.open .mobile-nav-inner {
                    transform: translateY(0);
                }

                .mobile-link {
                    padding: 1rem;
                    text-align: center;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 8px;
                    transition: background 0.2s;
                    font-size: 1.1rem;
                }

                .mobile-link:hover,
                .mobile-link.active {
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--primary);
                }

                @media (max-width: 768px) {
                    .desktop-nav {
                        display: none;
                    }
                    .mobile-toggle {
                        display: block;
                    }
                }
            `}</style>
        </header>
    );
}
