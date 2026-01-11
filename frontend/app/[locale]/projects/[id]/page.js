import ProjectDetailView from './ProjectDetailView';

async function getProject(id) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/projects/${id}`, {
        next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!res.ok) return null;
    return res.json();
}

export async function generateMetadata({ params: paramsPromise }) {
    const params = await paramsPromise;
    const project = await getProject(params.id);
    const locale = params.locale;

    if (!project) return { title: 'Project Not Found' };

    const title = locale === 'fr' ? project.titleFr : project.titleEn;
    const description = locale === 'fr' ? (project.descriptionFr || project.titleFr) : (project.descriptionEn || project.titleEn);

    // Use cover image for OG if available
    const getFullUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const origin = baseUrl.replace(/\/api$/, '');
        return `${origin}${path}`;
    };

    const ogImage = project.coverUrl ? getFullUrl(project.coverUrl) : '/og-image.png';

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            images: [ogImage],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: [ogImage],
        }
    };
}

export default async function ProjectPage({ params: paramsPromise }) {
    const params = await paramsPromise;
    const project = await getProject(params.id);

    if (!project) return <div className="error">Project not found.</div>;

    return <ProjectDetailView project={project} />;
}

