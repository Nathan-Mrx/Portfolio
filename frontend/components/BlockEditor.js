'use client';

import { useState } from 'react';
import { Plus, Trash, MoveUp, MoveDown, Type, Image as ImageIcon, Upload, Loader2 } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

export default function BlockEditor({ blocks, onChange }) {
    const [uploadingIndex, setUploadingIndex] = useState(null);

    const addBlock = (type) => {
        const newBlock = type === 'text'
            ? { type: 'text', contentEn: '', contentFr: '' }
            : { type: 'image', url: '', titleEn: '', titleFr: '', sourceEn: '', sourceFr: '' };
        onChange([...blocks, newBlock]);
    };

    const removeBlock = (index) => {
        const newBlocks = blocks.filter((_, i) => i !== index);
        onChange(newBlocks);
    };

    const updateBlock = (index, data) => {
        const newBlocks = [...blocks];
        newBlocks[index] = { ...newBlocks[index], ...data };
        onChange(newBlocks);
    };

    const moveBlock = (index, direction) => {
        if ((direction === -1 && index === 0) || (direction === 1 && index === blocks.length - 1)) return;
        const newBlocks = [...blocks];
        const temp = newBlocks[index];
        newBlocks[index] = newBlocks[index + direction];
        newBlocks[index + direction] = temp;
        onChange(newBlocks);
    };

    const handleImageUpload = async (index, file) => {
        if (!file) return;

        setUploadingIndex(index);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media_objects`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                console.error('Upload error:', errorData);
                const msg = errorData.message || errorData['hydra:description'] || 'Upload failed';
                throw new Error(`${msg} (Status: ${res.status})`);
            }

            const data = await res.json();
            updateBlock(index, { url: data.contentUrl });
        } catch (error) {
            if (error.message.includes('401')) {
                alert('Session expired. Please log in again.');
                window.location.href = '/login';
                return;
            }
            console.error('File upload error:', error);
            alert(`Failed to upload image: ${error.message}`);
        } finally {
            setUploadingIndex(null);
        }
    };

    const getFullUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const origin = baseUrl.replace(/\/api$/, '');
        return `${origin}${path}`;
    };

    return (
        <div className="block-editor">
            <div className="blocks-container">
                {blocks.map((block, index) => (
                    <div key={index} className="block-item">
                        <div className="block-header">
                            <span className="block-badge">{block.type.toUpperCase()}</span>
                            <div className="block-actions">
                                <button onClick={() => moveBlock(index, -1)} disabled={index === 0}><MoveUp size={16} /></button>
                                <button onClick={() => moveBlock(index, 1)} disabled={index === blocks.length - 1}><MoveDown size={16} /></button>
                                <button onClick={() => removeBlock(index)} className="delete"><Trash size={16} /></button>
                            </div>
                        </div>

                        {block.type === 'text' ? (
                            <div className="bilingual-grid">
                                <div className="field-group">
                                    <label>English Content</label>
                                    <RichTextEditor
                                        value={block.contentEn}
                                        onChange={(val) => updateBlock(index, { contentEn: val })}
                                        placeholder="Write in English..."
                                    />
                                </div>
                                <div className="field-group">
                                    <label>French Content</label>
                                    <RichTextEditor
                                        value={block.contentFr}
                                        onChange={(val) => updateBlock(index, { contentFr: val })}
                                        placeholder="Écrire en Français..."
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="image-block-content">
                                <div className="upload-section">
                                    <div className="url-input-wrapper">
                                        <label>Image URL</label>
                                        <input
                                            type="text"
                                            className="admin-input"
                                            value={block.url}
                                            onChange={(e) => updateBlock(index, { url: e.target.value })}
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div className="upload-button-wrapper">
                                        <label>&nbsp;</label>
                                        <label className="upload-label">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(index, e.target.files[0])}
                                                style={{ display: 'none' }}
                                            />
                                            <div className="upload-trigger">
                                                {uploadingIndex === index ? (
                                                    <Loader2 className="animate-spin" size={20} />
                                                ) : (
                                                    <>
                                                        <Upload size={18} />
                                                        <span>Upload</span>
                                                    </>
                                                )}
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                {block.url && (
                                    <div className="image-preview">
                                        <img src={getFullUrl(block.url)} alt="Preview" />
                                    </div>
                                )}
                                <div className="bilingual-grid">
                                    <div className="field-group">
                                        <label>Title (EN)</label>
                                        <input
                                            type="text"
                                            className="admin-input"
                                            value={block.titleEn}
                                            onChange={(e) => updateBlock(index, { titleEn: e.target.value })}
                                        />
                                        <label className="mt-2">Source (EN)</label>
                                        <input
                                            type="text"
                                            className="admin-input"
                                            value={block.sourceEn}
                                            onChange={(e) => updateBlock(index, { sourceEn: e.target.value })}
                                        />
                                    </div>
                                    <div className="field-group">
                                        <label>Title (FR)</label>
                                        <input
                                            type="text"
                                            className="admin-input"
                                            value={block.titleFr}
                                            onChange={(e) => updateBlock(index, { titleFr: e.target.value })}
                                        />
                                        <label className="mt-2">Source (FR)</label>
                                        <input
                                            type="text"
                                            className="admin-input"
                                            value={block.sourceFr}
                                            onChange={(e) => updateBlock(index, { sourceFr: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="editor-controls">
                <button type="button" onClick={() => addBlock('text')} className="control-btn">
                    <Type size={18} /> Add Text Block
                </button>
                <button type="button" onClick={() => addBlock('image')} className="control-btn">
                    <ImageIcon size={18} /> Add Image Block
                </button>
            </div>

            <style jsx>{`
                .block-editor {
                    margin-top: 1rem;
                }
                .block-item {
                    background: #111;
                    border: 1px solid #333;
                    border-radius: 8px;
                    padding: 1.5rem;
                    margin-bottom: 2rem;
                }
                .block-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid #222;
                }
                .block-badge {
                    background: var(--primary);
                    color: #000;
                    padding: 2px 8px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    border-radius: 4px;
                }
                .block-actions {
                    display: flex;
                    gap: 0.5rem;
                }
                .block-actions button {
                    background: #1a1a1a;
                    border: 1px solid #333;
                    color: #888;
                    padding: 4px;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .block-actions button:hover:not(:disabled) {
                    background: #222;
                    color: #fff;
                }
                .block-actions button.delete:hover {
                    background: #300;
                    color: #f44;
                    border-color: #500;
                }
                .bilingual-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                }
                .upload-section {
                    display: flex;
                    gap: 1rem;
                    grid-column: span 2;
                    margin-bottom: 1rem;
                }
                .url-input-wrapper {
                    flex: 1;
                }
                .upload-button-wrapper {
                    flex-shrink: 0;
                }
                .upload-label {
                    cursor: pointer;
                }
                .upload-trigger {
                    height: 44px;
                    background: #1a1a1a;
                    border: 1px solid #333;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0 1rem;
                    color: #888;
                    transition: all 0.2s;
                    margin-top: 0;
                }
                .upload-trigger:hover {
                    background: #222;
                    border-color: var(--primary);
                    color: var(--primary);
                }
                .image-preview {
                    grid-column: span 2;
                    margin-bottom: 1.5rem;
                    border-radius: 4px;
                    overflow: hidden;
                    border: 1px solid #333;
                    max-height: 200px;
                    background: #000;
                }
                .image-preview img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .field-group label {
                    display: block;
                    font-size: 0.85rem;
                    color: #888;
                    margin-bottom: 0.5rem;
                }
                .mt-2 { margin-top: 1rem; }
                .admin-input {
                    width: 100%;
                    background: #000;
                    border: 1px solid #333;
                    color: #fff;
                    padding: 0.75rem;
                    border-radius: 4px;
                    font-size: 0.9rem;
                }
                .editor-controls {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1rem;
                }
                .control-btn {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    background: transparent;
                    border: 2px dashed #333;
                    color: #888;
                    padding: 1.5rem;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .control-btn:hover {
                    border-color: var(--primary);
                    color: var(--primary);
                    background: rgba(0, 255, 102, 0.02);
                }
            `}</style>
        </div>
    );
}
