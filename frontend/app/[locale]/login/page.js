'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import styles from './page.module.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/login_check`;
            console.log('Attempting login to:', apiUrl);

            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: email, password }),
            });

            if (!res.ok) {
                throw new Error('Invalid credentials');
            }

            const data = await res.json();
            localStorage.setItem('token', data.token);
            document.cookie = 'admin_auth=1; path=/; SameSite=Strict';
            router.push('/admin');
        } catch (err) {
            console.error('Fetch error details:', err);
            setError(err.message);
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={`glass ${styles.form}`} suppressHydrationWarning>
                <h1 className={styles.title}>System Access</h1>

                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.group}>
                    <label className={styles.label}>Identifier</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.input}
                        required
                        suppressHydrationWarning
                    />
                </div>

                <div className={styles.group}>
                    <label className={styles.label}>Key</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.input}
                        required
                        suppressHydrationWarning
                    />
                </div>

                <button type="submit" className={styles.button}>
                    Initialize Session
                </button>
            </form>
        </div>
    );
}
