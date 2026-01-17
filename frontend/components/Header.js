'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, Terminal, Command, Github, Linkedin, Gamepad2 } from 'lucide-react';

export default function Header({ locale }) {
    const t = useTranslations('Navigation');
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
        { key: 'home', path: '/' },
        { key: 'projects', path: '/projects' },
        { key: 'articles', path: '/articles' },
        { key: 'resume', path: '/resume' },
        { key: 'about', path: '/about' },
    ];

    const socialLinks = [
        { icon: <Github size={20} />, url: 'https://github.com/Nathan-Mrx', label: 'GitHub', color: '#fff' },
        { icon: <Linkedin size={20} />, url: 'https://linkedin.com/in/nathan-merieux', label: 'LinkedIn', color: '#0077b5' },
        { icon: <Gamepad2 size={20} />, url: 'https://nathan-mrx.itch.io', label: 'itch.io', color: '#fa5c5c' },
    ];

    return (
        <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
            <div className="container header-inner">
                <Link href="/" className="logo">
                    <Terminal size={24} className="logo-icon" />
                    <span className="logo-text">NATHAN_MRX</span>
                </Link>

                {/* Desktop Nav */}
                <div className="nav-container">
                    <nav className="desktop-nav">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                            >
                                <span className="link-text">{t(item.key)}</span>
                                <span className="link-glow"></span>
                            </Link>
                        ))}
                    </nav>

                    <div className="social-links">
                        {socialLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-link"
                                aria-label={link.label}
                                style={{ '--hover-color': link.color }}
                            >
                                {link.icon}
                            </a>
                        ))}
                        <Link href="/admin" className="admin-icon-link" title="Admin">
                            <Command size={18} />
                        </Link>
                    </div>
                </div>

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
                                {t(item.key)}
                            </Link>
                        ))}

                        <div className="mobile-socials">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-link"
                                    style={{ '--hover-color': link.color }}
                                >
                                    {link.icon}
                                </a>
                            ))}
                        </div>

                        <Link
                            href="/admin"
                            className="mobile-link admin-link"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <Command size={18} style={{ marginRight: '8px' }} /> Admin Dashboard
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
                @media print {
                    .site-header { display: none !important; }
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

                .nav-container {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
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
                
                .social-links {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .social-link {
                    color: #888;
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .social-link:hover {
                    color: var(--hover-color);
                    transform: translateY(-2px);
                    filter: drop-shadow(0 0 8px var(--hover-color));
                }

                .admin-icon-link {
                    color: #444;
                    margin-left: 0.5rem;
                    padding-left: 1rem;
                    border-left: 1px solid rgba(255, 255, 255, 0.1);
                    transition: color 0.3s;
                }

                .admin-icon-link:hover {
                    color: var(--primary);
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
                    padding: 2.5rem 2rem;
                    gap: 1.5rem;
                    background: rgba(10, 10, 10, 0.95);
                    backdrop-filter: blur(20px);
                    border-radius: 24px;
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
                    border-radius: 12px;
                    transition: all 0.2s;
                    font-size: 1.1rem;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .mobile-link:hover,
                .mobile-link.active {
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--primary);
                    border-color: var(--primary);
                }

                .mobile-socials {
                    display: flex;
                    justify-content: center;
                    gap: 2rem;
                    padding: 1rem 0;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }

                .mobile-nav-inner .admin-link {
                    background: rgba(0, 255, 102, 0.05);
                    color: var(--primary);
                    border-color: rgba(0, 255, 102, 0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                @media (max-width: 900px) {
                    .nav-container {
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
