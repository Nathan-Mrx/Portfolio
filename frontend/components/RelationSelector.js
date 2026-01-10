'use client';

import { useState, useEffect } from 'react';
import { Search, X, Plus, Loader2 } from 'lucide-react';

export default function RelationSelector({ type, value, onChange, label }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const locale = 'en'; // Defaulting to EN for search

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm.trim().length > 1) {
                searchRelations();
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const searchRelations = async () => {
        setLoading(true);
        try {
            const endpoint = type === 'article' ? 'articles' : 'projects';

            // Search both English and French titles in parallel
            const [resEn, resFr] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}?titleEn=${searchTerm}`),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}?titleFr=${searchTerm}`)
            ]);

            const dataEn = await resEn.json();
            const dataFr = await resFr.json();

            // Extract members (handling both JSON-LD standard and possible variations)
            const membersEn = dataEn['member'] || dataEn['hydra:member'] || [];
            const membersFr = dataFr['member'] || dataFr['hydra:member'] || [];

            // Merge and deduplicate by ID
            const merged = [...membersEn, ...membersFr];
            const unique = Array.from(new Map(merged.map(item => [item.id, item])).values());

            // Filter out already selected items
            const filtered = unique.filter(item => !value.some(v => v.id === item.id));

            setResults(filtered);
            setShowDropdown(true);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const addItem = (item) => {
        onChange([...value, item]);
        setSearchTerm('');
        setShowDropdown(false);
    };

    const removeItem = (id) => {
        onChange(value.filter(item => item.id !== id));
    };

    return (
        <div className="relation-selector">
            <label className="field-label">{label}</label>

            <div className="selected-items">
                {value.map((item) => (
                    <div key={item.id} className="selected-item">
                        <span>{item.titleEn || item.titleFr}</span>
                        <button type="button" onClick={() => removeItem(item.id)} className="remove-btn">
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>

            <div className="search-container">
                <div className="search-input-wrapper">
                    <Search className="search-icon" size={18} />
                    <input
                        type="text"
                        placeholder={`Search for ${type}s...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => searchTerm.length > 1 && setShowDropdown(true)}
                        className="admin-input search-input"
                    />
                    {loading && <Loader2 className="loading-icon animate-spin" size={18} />}
                </div>

                {showDropdown && results.length > 0 && (
                    <div className="results-dropdown">
                        {results.map((item) => (
                            <div key={item.id} className="result-item" onClick={() => addItem(item)}>
                                <Plus size={14} />
                                <span>{item.titleEn || item.titleFr}</span>
                            </div>
                        ))}
                    </div>
                )}
                {showDropdown && searchTerm.length > 1 && results.length === 0 && !loading && (
                    <div className="results-dropdown empty">
                        No {type}s found.
                    </div>
                )}
            </div>

            <style jsx>{`
                .relation-selector {
                    margin-bottom: 2rem;
                }
                .field-label {
                    display: block;
                    font-size: 0.9rem;
                    color: #888;
                    margin-bottom: 0.75rem;
                }
                .selected-items {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin-bottom: 0.75rem;
                }
                .selected-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: #1a1a1a;
                    border: 1px solid #333;
                    padding: 4px 10px;
                    border-radius: 4px;
                    font-size: 0.85rem;
                }
                .remove-btn {
                    background: transparent;
                    border: none;
                    color: #888;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    padding: 2px;
                }
                .remove-btn:hover {
                    color: #f44;
                }
                .search-container {
                    position: relative;
                }
                .search-input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 8px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid #222;
                }
                .search-input-wrapper:focus-within {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: var(--primary);
                    box-shadow: 0 0 20px rgba(0, 255, 102, 0.1);
                }
                .search-icon {
                    position: absolute;
                    left: 1.25rem;
                    color: #666;
                    transition: color 0.3s;
                }
                .search-input-wrapper:focus-within .search-icon {
                    color: var(--primary);
                }
                .loading-icon {
                    position: absolute;
                    right: 1.25rem;
                    color: var(--primary);
                }
                .search-input {
                    padding: 1rem 1rem 1rem 3.5rem !important;
                    height: 56px;
                    background: transparent !important;
                    border: none !important;
                    color: #fff;
                    width: 100%;
                    font-size: 1rem;
                }
                .search-input:focus {
                    outline: none;
                }
                .results-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: #111;
                    border: 1px solid #333;
                    border-top: none;
                    border-radius: 0 0 4px 4px;
                    z-index: 10;
                    max-height: 200px;
                    overflow-y: auto;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.5);
                }
                .result-item {
                    padding: 0.75rem 1rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    transition: all 0.2s;
                    font-size: 0.9rem;
                }
                .result-item:hover {
                    background: #1a1a1a;
                    color: var(--primary);
                }
                .empty {
                    padding: 1rem;
                    color: #555;
                    font-size: 0.85rem;
                    text-align: center;
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
