'use client';

import { useLocale } from 'next-intl';

export default function BlockRenderer({ blocks }) {
    const locale = useLocale();

    const getFullUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const origin = baseUrl.replace(/\/api$/, '');
        return `${origin}${path}`;
    };

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
                            <img src={getFullUrl(block.url)} alt={title} className="content-image" />
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

        </div>
    );
}
