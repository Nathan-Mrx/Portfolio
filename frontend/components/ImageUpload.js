import { useState } from 'react';
import { Image, Upload, X } from 'lucide-react';

export default function ImageUpload({ label, value, onChange, id }) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(value || null);

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const headers = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/media_objects`, {
                method: 'POST',
                headers: headers,
                body: formData
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                const msg = errorData.message || errorData['hydra:description'] || 'Upload failed';
                throw new Error(`${msg} (Status: ${res.status})`);
            }

            const data = await res.json();
            setPreview(data.contentUrl);
            onChange(data.contentUrl);
        } catch (error) {
            if (error.message.includes('401')) {
                alert('Session expired. Please log in again.');
                window.location.href = '/login';
                return;
            }
            console.error('Upload error:', error);
            alert(`Failed to upload: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onChange(null);
    };

    const getFullUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        // Remove /api from the end of baseUrl if it exists, as the media path usually starts from root or /uploads
        const origin = baseUrl.replace(/\/api$/, '');
        return `${origin}${path}`;
    };

    return (
        <div className="image-upload">
            <label htmlFor={id}>{label}</label>
            {preview ? (
                <div className="image-preview">
                    <img src={getFullUrl(preview)} alt="Preview" />
                    <button type="button" onClick={handleRemove} className="remove-btn">
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <label htmlFor={id} className="upload-area">
                    {uploading ? (
                        <div className="uploading">Uploading...</div>
                    ) : (
                        <>
                            <Upload size={32} />
                            <span>Click to upload {label.toLowerCase()}</span>
                        </>
                    )}
                </label>
            )}
            <input
                id={id}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                disabled={uploading}
            />

            <style jsx>{`
                .image-upload {
                    margin-bottom: 1.5rem;
                }
                .image-upload label {
                    display: block;
                    font-size: 0.85rem;
                    color: #888;
                    margin-bottom: 0.5rem;
                }
                .upload-area {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    background: rgba(255, 255, 255, 0.03);
                    border: 2px dashed #333;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                    color: #888;
                    gap: 0.5rem;
                }
                .upload-area:hover {
                    border-color: var(--primary);
                    background: rgba(0, 255, 102, 0.05);
                }
                .uploading {
                    color: var(--primary);
                }
                .image-preview {
                    position: relative;
                    border-radius: 8px;
                    overflow: hidden;
                    border: 1px solid #333;
                }
                .image-preview img {
                    width: 100%;
                    height: auto;
                    display: block;
                }
                .remove-btn {
                    position: absolute;
                    top: 0.5rem;
                    right: 0.5rem;
                    background: rgba(0, 0, 0, 0.8);
                    border: 1px solid #ff4444;
                    color: #ff4444;
                    padding: 0.5rem;
                    border-radius: 4px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .remove-btn:hover {
                    background: #ff4444;
                    color: #fff;
                }
            `}</style>
        </div>
    );
}
