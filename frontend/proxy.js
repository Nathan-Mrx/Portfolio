import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request) {
    const { pathname } = request.nextUrl;

    // Strip locale prefix to get the actual path
    const pathWithoutLocale = pathname.replace(/^\/(en|fr)/, '') || '/';

    if (pathWithoutLocale.startsWith('/admin')) {
        const adminAuth = request.cookies.get('admin_auth');
        if (!adminAuth) {
            const locale = pathname.match(/^\/(en|fr)/)?.[1] || 'en';
            return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
        }
    }

    return intlMiddleware(request);
}

export const config = {
    matcher: ['/', '/(fr|en)/:path*']
};
