'use client';

import { useLocale } from 'next-intl';
import OptimizedImage from '@/components/OptimizedImage';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ReactCompareSlider } from 'react-compare-slider';

export default function BlockRenderer({ blocks }) {
    const locale = useLocale();

    const getFullUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const origin = baseUrl.replace(/\/api$/, '');
        return `${origin}${path}`;
    };

    const getYoutubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : url;
    };

    if (!blocks || !Array.isArray(blocks)) return null;

    return (
        <div className="block-renderer">
            {blocks.map((block, index) => {
                if (block.type === 'text') {
                    const rawContent = locale === 'fr' ? block.contentFr : block.contentEn;
                    const content = rawContent ? rawContent.replace(/\u00A0/g, ' ').replace(/&nbsp;/g, ' ') : '';
                    return (
                        <div
                            key={index}
                            className="text-block"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    );
                }

                if (block.type === 'image') {
                    const title = locale === 'fr' ? block.titleFr : block.titleEn;
                    const source = locale === 'fr' ? block.sourceFr : block.sourceEn;
                    return (
                        <figure key={index} className="image-block" style={{ position: 'relative' }}>
                            <OptimizedImage
                                src={block.url}
                                alt={title}
                                preset="CONTENT"
                            />
                            {(title || source) && (
                                <figcaption className="image-caption">
                                    {title && <span className="image-title">{title}</span>}
                                    {source && <span className="image-source">Source: {source}</span>}
                                </figcaption>
                            )}
                        </figure>
                    );
                }

                if (block.type === 'code') {
                    const title = locale === 'fr' ? block.titleFr : block.titleEn;
                    return (
                        <div key={index} className="code-block-wrapper">
                            {title && <div className="code-caption">{title}</div>}
                            <div className="code-container glass">
                                <SyntaxHighlighter
                                    language={block.language || 'javascript'}
                                    style={vscDarkPlus}
                                    customStyle={{
                                        margin: 0,
                                        padding: '1.5rem',
                                        background: 'transparent',
                                        fontSize: '0.9rem',
                                        lineHeight: '1.5'
                                    }}
                                >
                                    {block.code}
                                </SyntaxHighlighter>
                            </div>
                        </div>
                    );
                }

                if (block.type === 'video') {
                    const videoId = getYoutubeId(block.url);
                    const title = locale === 'fr' ? block.titleFr : block.titleEn;
                    return (
                        <div key={index} className="video-block">
                            <div className="video-container glass">
                                <iframe
                                    src={`https://www.youtube.com/embed/${videoId}`}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title={title || "YouTube video"}
                                />
                            </div>
                            {title && <div className="video-caption">{title}</div>}
                        </div>
                    );
                }

                if (block.type === 'comparison') {
                    const labelLeft = locale === 'fr' ? block.labelLeftFr || block.labelBeforeFr : block.labelLeftEn || block.labelBeforeEn;
                    const labelRight = locale === 'fr' ? block.labelRightFr || block.labelAfterFr : block.labelRightEn || block.labelAfterEn;
                    return (
                        <div key={index} className="comparison-block">
                            <div className="comparison-container glass">
                                <ReactCompareSlider
                                    itemOne={
                                        <div style={{ position: 'relative', width: '100%' }}>
                                            <OptimizedImage src={block.urlBefore} alt="Before" preset="COVER" />
                                            {labelLeft && <div className="comparison-label before" style={{ zIndex: 10 }}>{labelLeft}</div>}
                                        </div>
                                    }
                                    itemTwo={
                                        <div style={{ position: 'relative', width: '100%' }}>
                                            <OptimizedImage src={block.urlAfter} alt="After" preset="COVER" />
                                            {labelRight && <div className="comparison-label after" style={{ zIndex: 10 }}>{labelRight}</div>}
                                        </div>
                                    }
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            </div>
                        </div>
                    );
                }

                return null;
            })}

            <style jsx>{`
                .block-renderer {
                    display: flex;
                    flex-direction: column;
                    gap: 3rem;
                    margin: 2rem 0;
                }
                :global(.text-block),
                :global(.text-block *) {
                    line-height: 1.8;
                    color: #ddd;
                    overflow-wrap: normal !important;
                    word-wrap: normal !important;
                    word-break: normal !important;
                    hyphens: none !important;
                    white-space: normal !important;
                }
                .image-block {
                    margin: 0;
                }
                .content-image {
                    width: 100%;
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .image-caption, .code-caption, .video-caption {
                    margin-top: 1rem;
                    font-size: 0.9rem;
                    color: #888;
                    text-align: center;
                    font-style: italic;
                }
                .code-block-wrapper {
                    margin: 1rem 0;
                }
                .code-container {
                    border-radius: 12px;
                    overflow: hidden;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    background: rgba(10, 10, 10, 0.4);
                }
                .video-container {
                    position: relative;
                    padding-bottom: 56.25%; /* 16:9 */
                    height: 0;
                    overflow: hidden;
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .video-container iframe {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }
                .comparison-container {
                    border-radius: 16px;
                    overflow: hidden;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                }
                .comparison-label {
                    position: absolute;
                    bottom: 1rem;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(4px);
                    color: #fff;
                    padding: 4px 12px;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    pointer-events: none;
                }
                .comparison-label.before { left: 1rem; border-left: 3px solid var(--primary); }
                .comparison-label.after { right: 1rem; border-right: 3px solid var(--primary); }
            `}</style>
        </div>
    );
}
