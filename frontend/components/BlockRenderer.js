'use client';

import { useLocale } from 'next-intl';

export default function BlockRenderer({ blocks }) {
    const locale = useLocale();

    if (!blocks || !Array.isArray(blocks)) return null;

    return (
        <div className="block-renderer">
            {blocks.map((block, index) => {
                if (block.type === 'text') {
                    const content = locale === 'fr' ? block.contentFr : block.contentEn;
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
                        <figure key={index} className="image-block">
                            <img src={block.url} alt={title} className="content-image" />
                            {(title || source) && (
                                <figcaption className="image-caption">
                                    {title && <span className="image-title">{title}</span>}
                                    {source && <span className="image-source">Source: {source}</span>}
                                </figcaption>
                            )}
                        </figure>
                    );
                }

                return null;
            })}

            <style jsx>{`
                .block-renderer {
                    display: flex;
                    flex-direction: column;
                    gap: 2.5rem;
                }
                .text-block {
                    line-height: 1.8;
                    font-size: 1.1rem;
                    color: #ddd;
                }
                .text-block :global(h1) { color: #fff; margin-top: 2rem; }
                .text-block :global(h2) { color: #fff; margin-top: 1.8rem; font-size: 1.5rem; }
                .text-block :global(h3) { color: var(--primary); margin-top: 1.5rem; font-size: 1.2rem; }
                .text-block :global(p) { margin-bottom: 1.2rem; }
                .text-block :global(ul), .text-block :global(ol) { margin-bottom: 1.2rem; padding-left: 1.5rem; }
                .text-block :global(a) { color: var(--primary); text-decoration: underline; }
                
                .image-block {
                    margin: 0;
                    width: 100%;
                }
                .content-image {
                    width: 100%;
                    height: auto;
                    border-radius: 12px;
                    border: 1px solid #333;
                }
                .image-caption {
                    margin-top: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.2rem;
                    font-size: 0.9rem;
                    border-left: 2px solid var(--primary);
                    padding-left: 1rem;
                }
                .image-title {
                    color: #fff;
                    font-weight: 500;
                }
                .image-source {
                    color: #666;
                    font-style: italic;
                    font-size: 0.8rem;
                }
            `}</style>
        </div>
    );
}
