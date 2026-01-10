'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/routing';

export default function AuthGuard({ children }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        } else {
            setAuthorized(true);
        }
    }, [router]);

    if (!authorized) {
        return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Accessing Secure System...</div>;
    }

    return <>{children}</>;
}
