'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Loader2, Info } from 'lucide-react';
import Link from 'next/link';
import ProfileEditor from '@/components/ProfileEditor';

export default function AdminProfile({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const { locale } = params;
    const router = useRouter();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
            const res = await fetch(`${apiUrl}/profiles`);
            if (!res.ok) throw new Error('Failed to fetch profile');

            const data = await res.json();
            const profiles = data['hydra:member'] || data['member'] || [];

            if (profiles.length > 0) {
                setProfile(profiles[0]);
            } else {
                // Return an empty template if none exist
                setProfile({
                    aboutEn: '',
                    aboutFr: '',
                    resumeData: { experience: [], education: [], skills: [] }
                });
            }
        } catch (err) {
            console.error(err);
            setError('Could not connect to the neural network.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (formData) => {
        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

            const method = profile.id ? 'PUT' : 'POST';
            const url = profile.id ? `${apiUrl}/profiles/${profile.id}` : `${apiUrl}/profiles`;

            const headers = {
                'Content-Type': 'application/ld+json',
                'Authorization': `Bearer ${token}`
            };

            const clean = (val) => (val === '' ? null : val);

            const payload = {
                aboutEn: clean(formData.aboutEn),
                aboutFr: clean(formData.aboutFr),
                email: clean(formData.email),
                phone: clean(formData.phone),
                jobTitleEn: clean(formData.jobTitleEn),
                jobTitleFr: clean(formData.jobTitleFr),
                availabilityStatus: clean(formData.availabilityStatus),
                profileImageUrl: clean(formData.profileImageUrl),
                resumeData: formData.resumeData
            };

            const res = await fetch(url, {
                method,
                headers,
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const text = await res.text();
                console.error('Save Error (Status):', res.status, res.statusText);
                console.error('Save Error (Body):', text);

                try {
                    const errData = JSON.parse(text);
                    const violation = errData.violations?.[0]?.message
                        || errData['hydra:description']
                        || `Error ${res.status}: ${res.statusText}`;
                    throw new Error(violation);
                } catch (e) {
                    throw new Error(`Server Error: ${res.status} ${res.statusText} (Look at console for details)`);
                }
            }

            const updated = await res.json();
            setProfile(updated);
            alert('PROFILE_UPDATED : SUCCESS');
        } catch (err) {
            console.error(err);
            alert(`UPDATE_ERROR : ${err.message}`);
        }
    };

    if (loading) {
        return (
            <div className="admin-container loading-state">
                <Loader2 className="animate-spin" size={48} />
                <p>Establishing secure connection to profile data...</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <header className="dashboard-header">
                <div>
                    <Link href={`/${locale}/admin`} className="cyber-icon-link" title="BACK">
                        <ChevronLeft size={20} />
                    </Link>
                </div>
                <h1>ADMIN_CMD : <span className="neon-text">SITE_PROFILE</span></h1>
                <div className="header-info-tag">
                    <Info size={14} />
                    <span>CENTRAL_SETTING_NODE</span>
                </div>
            </header>

            {error ? (
                <div className="error-card hud-glass">
                    <p className="neon-text">{error}</p>
                    <button onClick={fetchProfile} className="cyber-rect-btn primary">RETRY_CONNECTION</button>
                </div>
            ) : (
                <ProfileEditor data={profile} onSave={handleSave} />
            )}

            <style jsx>{`
                .admin-dashboard {
                    padding: 2rem;
                    max-width: 1000px;
                    margin: 0 auto;
                    color: #e0e0e0;
                    background: #080808;
                    font-family: 'JetBrains Mono', 'Courier New', monospace;
                    min-height: 100vh;
                }

                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 3rem;
                    padding-bottom: 1.5rem;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }

                .header-info-tag {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(0, 255, 102, 0.05);
                    color: var(--primary);
                    padding: 0.4rem 0.8rem;
                    font-size: 0.65rem;
                    font-weight: 800;
                    border: 1px solid rgba(0, 255, 102, 0.1);
                }

                .neon-text {
                    color: var(--primary);
                    text-shadow: 0 0 10px rgba(0, 255, 102, 0.5);
                }

                .cyber-icon-link {
                    color: #444;
                    padding: 0.5rem;
                    background: #111;
                    border: 1px solid #222;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .cyber-icon-link:hover {
                    color: var(--primary);
                    border-color: var(--primary);
                    box-shadow: 0 0 10px rgba(0, 255, 102, 0.2);
                }

                .loading-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    gap: 1rem;
                    color: var(--primary);
                    background: #080808;
                }

                .animate-spin {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .error-card {
                    padding: 3rem;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2rem;
                }
            `}</style>
        </div>
    );
}
