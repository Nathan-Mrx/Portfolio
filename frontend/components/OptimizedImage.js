'use client';

import Image from 'next/image';
import { useState } from 'react';

/**
 * OptimizedImage Component
 * Wraps next/image with project-specific presets and error handling.
 * 
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text
 * @param {string} preset - One of 'COVER', 'THUMBNAIL', 'PROFILE', 'CONTENT'
 * @param {string} className - Additional CSS classes
 * @param {boolean} priority - Whether to prioritize loading (for LCP)
 */
export default function OptimizedImage({ src, alt, preset = 'CONTENT', className = '', priority = false, ...props }) {
    const [error, setError] = useState(false);

    // Fallback if no src
    if (!src && !error) {
        return <div className={`image-placeholder ${className} preset-${preset.toLowerCase()}`} />;
    }

    // Resolve API URL if relative
    const getFullUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const origin = apiBase.replace(/\/api$/, '');
        return `${origin}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const fullSrc = error ? '/og-image.png' : getFullUrl(src);
    const isLocal = fullSrc.includes('localhost') || fullSrc.includes('127.0.0.1');

    // Debug URL resolution
    if (typeof window !== 'undefined' && src && !error) {
        console.log(`[OptimizedImage] ${preset} -> ${fullSrc}`);
    }

    // Preset configurations
    const presets = {
        COVER: {
            aspectRatio: '16/9',
            sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px',
            width: 1200,
            height: 675,
        },
        THUMBNAIL: {
            aspectRatio: '1/1',
            sizes: '(max-width: 768px) 50vw, 400px',
            width: 400,
            height: 400,
        },
        PROJECT_CARD: {
            aspectRatio: '4/3',
            sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px',
            width: 800,
            height: 600,
        },
        PROFILE: {
            aspectRatio: '1/1',
            sizes: '100px',
            width: 200,
            height: 200,
        },
        CONTENT: {
            aspectRatio: '16/9',
            sizes: '(max-width: 1200px) 100vw, 1000px',
            width: 1000,
            height: 562,
        }
    };

    const config = presets[preset] || presets.CONTENT;

    return (
        <div className={`optimized-image-container preset-${preset.toLowerCase()} ${className}`} style={{ aspectRatio: config.aspectRatio }}>
            <Image
                src={fullSrc}
                alt={alt || 'Image'}
                fill
                className="object-cover"
                style={{
                    objectFit: preset === 'CONTENT' ? 'contain' : 'cover',
                    objectPosition: 'center'
                }}
                sizes={config.sizes}
                priority={priority}
                unoptimized={isLocal}
                onError={(e) => {
                    console.error(`[OptimizedImage] Failed to load: ${fullSrc}`, e);
                    setError(true);
                }}
                {...props}
            />

            <style jsx>{`
                .optimized-image-container {
                    position: relative;
                    width: 100%;
                    overflow: hidden;
                    background: rgba(255, 255, 255, 0.02);
                }
                .object-cover {
                    object-fit: cover;
                }
                .image-placeholder {
                    background: #111;
                    border: 1px dashed #333;
                    width: 100%;
                }
            `}</style>
        </div>
    );
}
