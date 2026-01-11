'use client';

import React from 'react';
import { Share2, Globe, Twitter, Linkedin } from 'lucide-react';

export default function SocialPreview({ title, description, image, type = 'project' }) {
    const getFullUrl = (path) => {
        if (!path) return '/og-image.png'; // Fallback to brand image
        if (path.startsWith('http')) return path;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const origin = baseUrl.replace(/\/api$/, '');
        return `${origin}${path}`;
    };

    const displayTitle = title || `New ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    const displayDesc = description || `Detailed summary of this ${type}...`;
    const imageUrl = getFullUrl(image);

    return (
        <div className="social-preview-container hud-glass">
            <h3 className="preview-title">
                <Share2 size={16} /> LIVE_SOCIAL_PREVIEW
            </h3>

            <div className="preview-grid">
                {/* LinkedIn / Discord Style */}
                <div className="preview-card linkedin">
                    <div className="card-platform">
                        <Linkedin size={14} /> <span>LinkedIn / Discord</span>
                    </div>
                    <div className="card-content">
                        <div className="card-image-wrapper">
                            <img src={imageUrl} alt="Preview" />
                        </div>
                        <div className="card-text">
                            <h4 className="card-title">{displayTitle}</h4>
                            <p className="card-desc">{displayDesc}</p>
                            <span className="card-domain">NATHAN-MRX.DEV</span>
                        </div>
                    </div>
                </div>

                {/* Twitter / X Style */}
                <div className="preview-card twitter">
                    <div className="card-platform">
                        <Twitter size={14} /> <span>Twitter / X</span>
                    </div>
                    <div className="card-content">
                        <div className="card-image-wrapper">
                            <img src={imageUrl} alt="Preview" />
                        </div>
                        <div className="card-text-overlay">
                            <h4 className="card-title">{displayTitle}</h4>
                            <p className="card-desc">{displayDesc}</p>
                            <div className="card-meta">
                                <Globe size={12} /> nathan-mrx.dev
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .social-preview-container {
                    padding: 1.5rem;
                    margin-top: 2rem;
                    border: 1px dashed rgba(255, 255, 255, 0.1);
                }
                .preview-title {
                    font-size: 0.75rem;
                    color: var(--primary);
                    letter-spacing: 2px;
                    margin-bottom: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .preview-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }
                .preview-card {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .card-platform {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    font-size: 0.65rem;
                    color: #666;
                    text-transform: uppercase;
                    font-weight: 700;
                }
                .card-content {
                    background: #1a1a1a;
                    border-radius: 8px;
                    overflow: hidden;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .card-image-wrapper {
                    aspect-ratio: 1.91 / 1;
                    overflow: hidden;
                    background: #000;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }
                .card-image-wrapper img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .card-text {
                    padding: 0.75rem;
                }
                .card-title {
                    margin: 0 0 0.25rem 0;
                    font-size: 0.9rem;
                    color: #fff;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .card-desc {
                    margin: 0 0 0.5rem 0;
                    font-size: 0.75rem;
                    color: #aaa;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    line-height: 1.4;
                }
                .card-domain {
                    font-size: 0.65rem;
                    color: #666;
                    text-transform: uppercase;
                }

                /* Twitter Specific */
                .twitter .card-content {
                    position: relative;
                }
                .twitter .card-text-overlay {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: linear-gradient(transparent, rgba(0,0,0,0.9));
                    padding: 1rem 0.75rem 0.75rem 0.75rem;
                }
                .twitter .card-title {
                    font-weight: 700;
                }
                .twitter .card-desc {
                    color: #ccc;
                    -webkit-line-clamp: 1;
                }
                .card-meta {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    font-size: 0.65rem;
                    color: #888;
                    margin-top: 0.25rem;
                }

                @media (max-width: 1000px) {
                    .preview-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}
