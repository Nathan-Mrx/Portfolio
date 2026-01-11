'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Plus, Trash2, Briefcase, GraduationCap, Code, Search, Check, X, Gamepad2 } from 'lucide-react';
import ImageUpload from './ImageUpload';

export default function ProfileEditor({ data, onSave }) {
    const [formData, setFormData] = useState({
        aboutEn: '',
        aboutFr: '',
        resumeBioEn: '',
        resumeBioFr: '',
        email: '',
        phone: '',
        jobTitleEn: '',
        jobTitleFr: '',
        availabilityStatus: '',
        location: '',
        profileImageUrl: '',
        portfolioUrl: '',
        resumeData: {
            experience: [],
            education: [],
            skills: [],
            tools: [],
            programmingLanguages: [],
            languages: [],
            languages: [],
            featuredProjects: [] // Changed from featuredProjectIds to array of objects
        }
    });

    const [availableProjects, setAvailableProjects] = useState([]);
    const [projectSearch, setProjectSearch] = useState('');

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (data) {
            setFormData(prev => ({
                ...prev,
                ...data,
                resumeData: {
                    experience: data.resumeData?.experience || [],
                    education: data.resumeData?.education || [],
                    skills: data.resumeData?.skills || [],
                    tools: data.resumeData?.tools || [],
                    programmingLanguages: data.resumeData?.programmingLanguages || [],
                    languages: data.resumeData?.languages || [],
                    languages: data.resumeData?.languages || [],
                    // Migration/Init for featuredProjects
                    featuredProjects: data.resumeData?.featuredProjects ||
                        (data.resumeData?.featuredProjectIds || []).map(id => ({ id, highlightsEn: '', highlightsFr: '' }))
                }
            }));
        }

        // Fetch available projects
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '');
        fetch(`${apiUrl}/projects?pagination=false`)
            .then(res => res.json())
            .then(data => setAvailableProjects(data['hydra:member'] || data['member'] || []))
            .catch(err => console.error('Error fetching projects:', err));
    }, [data]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        await onSave(formData);
        setSaving(false);
    };

    // Experience Handlers ... (rest of old handlers)
    const addExperience = () => {
        const newResume = { ...formData.resumeData };
        newResume.experience = [...(newResume.experience || []), {
            companyEn: '', companyFr: '',
            roleEn: '', roleFr: '',
            periodEn: '', periodFr: '',
            descriptionEn: '', descriptionFr: ''
        }];
        setFormData({ ...formData, resumeData: newResume });
    };

    const updateExperience = (index, field, value) => {
        const newResume = { ...formData.resumeData };
        newResume.experience[index][field] = value;
        setFormData({ ...formData, resumeData: newResume });
    };

    const removeExperience = (index) => {
        const newResume = { ...formData.resumeData };
        newResume.experience = newResume.experience.filter((_, i) => i !== index);
        setFormData({ ...formData, resumeData: newResume });
    };

    // Education Handlers
    const addEducation = () => {
        const newResume = { ...formData.resumeData };
        newResume.education = [...(newResume.education || []), {
            schoolEn: '', schoolFr: '',
            degreeEn: '', degreeFr: '',
            yearEn: '', yearFr: ''
        }];
        setFormData({ ...formData, resumeData: newResume });
    };

    const updateEducation = (index, field, value) => {
        const newResume = { ...formData.resumeData };
        newResume.education[index][field] = value;
        setFormData({ ...formData, resumeData: newResume });
    };

    const removeEducation = (index) => {
        const newResume = { ...formData.resumeData };
        newResume.education = newResume.education.filter((_, i) => i !== index);
        setFormData({ ...formData, resumeData: newResume });
    };

    // Skills Handlers
    const addSkill = () => {
        const newResume = { ...formData.resumeData };
        newResume.skills = [...(newResume.skills || []), { name: '', level: 80 }];
        setFormData({ ...formData, resumeData: newResume });
    };

    const updateSkill = (index, field, value) => {
        const newResume = { ...formData.resumeData };
        newResume.skills[index][field] = value;
        setFormData({ ...formData, resumeData: newResume });
    };

    const removeSkill = (index) => {
        const newResume = { ...formData.resumeData };
        newResume.skills = newResume.skills.filter((_, i) => i !== index);
        setFormData({ ...formData, resumeData: newResume });
    };

    // Tools Handlers
    const addTool = () => {
        const newResume = { ...formData.resumeData };
        newResume.tools = [...(newResume.tools || []), { name: '', level: 60 }];
        setFormData({ ...formData, resumeData: newResume });
    };

    const updateTool = (index, field, value) => {
        const newResume = { ...formData.resumeData };
        newResume.tools[index][field] = value;
        setFormData({ ...formData, resumeData: newResume });
    };

    const removeTool = (index) => {
        const newResume = { ...formData.resumeData };
        newResume.tools = newResume.tools.filter((_, i) => i !== index);
        setFormData({ ...formData, resumeData: newResume });
    };

    // Programming Languages Handlers
    const addProgrammingLanguage = () => {
        const newResume = { ...formData.resumeData };
        newResume.programmingLanguages = [...(newResume.programmingLanguages || []), { name: '', level: 75 }];
        setFormData({ ...formData, resumeData: newResume });
    };

    const updateProgrammingLanguage = (index, field, value) => {
        const newResume = { ...formData.resumeData };
        newResume.programmingLanguages[index][field] = value;
        setFormData({ ...formData, resumeData: newResume });
    };

    const removeProgrammingLanguage = (index) => {
        const newResume = { ...formData.resumeData };
        newResume.programmingLanguages = newResume.programmingLanguages.filter((_, i) => i !== index);
        setFormData({ ...formData, resumeData: newResume });
    };

    const toggleProject = (project) => {
        const currentSelected = formData.resumeData.featuredProjects || [];
        const existingIndex = currentSelected.findIndex(p => p.id === project.id);

        let newSelected;
        if (existingIndex >= 0) {
            // Remove
            newSelected = currentSelected.filter((_, i) => i !== existingIndex);
        } else {
            // Add with default highlights from entity if available
            newSelected = [...currentSelected, {
                id: project.id,
                highlightsEn: project.resumeHighlightsEn || '',
                highlightsFr: project.resumeHighlightsFr || ''
            }];
        }

        setFormData({
            ...formData,
            resumeData: {
                ...formData.resumeData,
                featuredProjects: newSelected
            }
        });
    };

    const updateProjectHighlights = (id, field, value) => {
        const newSelected = (formData.resumeData.featuredProjects || []).map(p => {
            if (p.id === id) return { ...p, [field]: value };
            return p;
        });
        setFormData({
            ...formData,
            resumeData: {
                ...formData.resumeData,
                featuredProjects: newSelected
            }
        });
    };

    const addLanguage = () => {
        const newResume = { ...formData.resumeData };
        newResume.languages = [...(newResume.languages || []), {
            nameEn: '', nameFr: '',
            level: 5,
            statusEn: 'PROFESSIONAL', statusFr: 'PROFESSIONNEL'
        }];
        setFormData({ ...formData, resumeData: newResume });
    };

    const updateLanguage = (index, field, value) => {
        const newResume = { ...formData.resumeData };
        newResume.languages[index][field] = value;
        setFormData({ ...formData, resumeData: newResume });
    };

    const removeLanguage = (index) => {
        const newResume = { ...formData.resumeData };
        newResume.languages = newResume.languages.filter((_, i) => i !== index);
        setFormData({ ...formData, resumeData: newResume });
    };

    return (
        <form onSubmit={handleSubmit} className="profile-editor-form">
            <div className="editor-grid">
                {/* General Info */}
                <div className="editor-section hud-glass">
                    <h2 className="hud-title"><span className="caret">{'>'}</span> GENERAL_INFO</h2>
                    <div className="grid-cols-2">
                        <div className="field-group">
                            <label>Job Title (EN)</label>
                            <input
                                type="text"
                                className="admin-input"
                                value={formData.jobTitleEn}
                                onChange={(e) => setFormData({ ...formData, jobTitleEn: e.target.value })}
                            />
                        </div>
                        <div className="field-group">
                            <label>Job Title (FR)</label>
                            <input
                                type="text"
                                className="admin-input"
                                value={formData.jobTitleFr}
                                onChange={(e) => setFormData({ ...formData, jobTitleFr: e.target.value })}
                            />
                        </div>
                        <div className="field-group">
                            <label>Email</label>
                            <input
                                type="email"
                                className="admin-input"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="field-group">
                            <label>Phone</label>
                            <input
                                type="text"
                                className="admin-input"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div className="field-group">
                            <label>Location (City, Country/Prov)</label>
                            <input
                                type="text"
                                className="admin-input"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                        <div className="field-group">
                            <label>Availability Status (e.g. "Available for Freelance")</label>
                            <input
                                type="text"
                                className="admin-input"
                                value={formData.availabilityStatus}
                                onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value })}
                            />
                        </div>
                        <div className="field-group full">
                            <label>Portfolio Link (URL for QR Code)</label>
                            <input
                                type="text"
                                className="admin-input"
                                value={formData.portfolioUrl}
                                onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                                placeholder="https://nathan-mrx.com"
                            />
                        </div>
                    </div>
                </div>

                <div className="editor-section hud-glass">
                    <h2 className="hud-title"><span className="caret">{'>'}</span> PROFILE_MEDIA</h2>
                    <ImageUpload
                        label="Profile Image"
                        id="profile-image-upload"
                        value={formData.profileImageUrl}
                        onChange={(url) => setFormData({ ...formData, profileImageUrl: url })}
                        helpText="Square photo recommended"
                    />
                </div>

                <div className="editor-section hud-glass">
                    <h2 className="hud-title"><span className="caret">{'>'}</span> BIOGRAPHIES</h2>
                    <div className="bio-split">
                        <div className="field-group">
                            <label>About Me (EN)</label>
                            <textarea
                                className="admin-input"
                                rows="4"
                                value={formData.aboutEn}
                                onChange={(e) => setFormData({ ...formData, aboutEn: e.target.value })}
                            />
                        </div>
                        <div className="field-group">
                            <label>About Me (FR)</label>
                            <textarea
                                className="admin-input"
                                rows="4"
                                value={formData.aboutFr}
                                onChange={(e) => setFormData({ ...formData, aboutFr: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="bio-split">
                        <div className="field-group">
                            <label>Resume Bio (EN)</label>
                            <textarea
                                className="admin-input"
                                rows="4"
                                value={formData.resumeBioEn}
                                onChange={(e) => setFormData({ ...formData, resumeBioEn: e.target.value })}
                            />
                        </div>
                        <div className="field-group">
                            <label>Resume Bio (FR)</label>
                            <textarea
                                className="admin-input"
                                rows="4"
                                value={formData.resumeBioFr}
                                onChange={(e) => setFormData({ ...formData, resumeBioFr: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Resume Sections */}
                <div className="editor-section hud-glass">
                    <div className="section-header-btn">
                        <h2 className="hud-title"><span className="caret">{'>'}</span> FEATURED_PROJECTS (RESUME_SHOWCASE)</h2>
                        <div className="search-box">
                            <Search size={14} />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={projectSearch}
                                onChange={e => setProjectSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="project-picker">
                        <div className="project-grid-mini">
                            {availableProjects
                                .filter(p =>
                                    p.titleEn.toLowerCase().includes(projectSearch.toLowerCase()) ||
                                    p.titleFr.toLowerCase().includes(projectSearch.toLowerCase())
                                )
                                .map(project => {
                                    const isSelected = (formData.resumeData.featuredProjects || []).some(p => p.id === project.id);
                                    return (
                                        <div
                                            key={project.id}
                                            className={`picker-item ${isSelected ? 'selected' : ''}`}
                                            onClick={() => toggleProject(project)}
                                        >
                                            <div className="item-check">
                                                {isSelected ? <Check size={12} /> : <Plus size={12} />}
                                            </div>
                                            <span className="item-name">{project.titleEn}</span>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>

                    <div className="selected-projects-list" style={{ marginTop: '2rem' }}>
                        <h3 className="hud-title" style={{ fontSize: '0.7rem' }}>EDIT_PROJECT_HIGHLIGHTS</h3>
                        {(formData.resumeData.featuredProjects || []).map((fp, i) => {
                            const project = availableProjects.find(p => p.id === fp.id);
                            if (!project) return null;
                            return (
                                <div key={fp.id} className="resume-item hud-glass" style={{ marginBottom: '1rem' }}>
                                    <div className="item-row" style={{ justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span className="item-name" style={{ color: 'var(--primary)', fontWeight: '900' }}>{project.titleEn}</span>
                                        <button type="button" onClick={() => toggleProject(project)} className="del-btn-icon"><Trash2 size={14} /></button>
                                    </div>
                                    <div className="item-row">
                                        <div className="field-col">
                                            <label>Resume Highlights (EN)</label>
                                            <textarea
                                                className="bio-textarea"
                                                rows={3}
                                                placeholder="• Point 1..."
                                                value={fp.highlightsEn || ''}
                                                onChange={(e) => updateProjectHighlights(fp.id, 'highlightsEn', e.target.value)}
                                            />
                                        </div>
                                        <div className="field-col">
                                            <label>Resume Highlights (FR)</label>
                                            <textarea
                                                className="bio-textarea"
                                                rows={3}
                                                placeholder="• Point 1..."
                                                value={fp.highlightsFr || ''}
                                                onChange={(e) => updateProjectHighlights(fp.id, 'highlightsFr', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="selected-status">
                        <Gamepad2 size={14} />
                        <span>SELECTED: {(formData.resumeData.featuredProjects || []).length} / 6 RECOMMENDED</span>
                    </div>
                </div>

                <div className="editor-section hud-glass">
                    <div className="section-header-btn">
                        <h2 className="hud-title"><span className="caret">{'>'}</span> EDUCATION</h2>
                        <button type="button" onClick={addEducation} className="add-btn"><Plus size={14} /> ADD</button>
                    </div>
                    <div className="resume-list">
                        {(formData.resumeData.education || []).map((edu, i) => (
                            <div key={i} className="resume-item hud-glass">
                                <div className="item-row">
                                    <div className="field-col">
                                        <label>Degree (EN)</label>
                                        <input placeholder="Degree (EN)" value={edu.degreeEn || edu.degree || ''} onChange={e => updateEducation(i, 'degreeEn', e.target.value)} />
                                    </div>
                                    <div className="field-col">
                                        <label>Degree (FR)</label>
                                        <input placeholder="Diplôme (FR)" value={edu.degreeFr || edu.degree || ''} onChange={e => updateEducation(i, 'degreeFr', e.target.value)} />
                                    </div>
                                    <button type="button" onClick={() => removeEducation(i)} className="del-btn"><Trash2 size={14} /></button>
                                </div>
                                <div className="item-row">
                                    <div className="field-col">
                                        <label>School (EN)</label>
                                        <input placeholder="School (EN)" value={edu.schoolEn || edu.school || ''} onChange={e => updateEducation(i, 'schoolEn', e.target.value)} />
                                    </div>
                                    <div className="field-col">
                                        <label>School (FR)</label>
                                        <input placeholder="École (FR)" value={edu.schoolFr || edu.school || ''} onChange={e => updateEducation(i, 'schoolFr', e.target.value)} />
                                    </div>
                                </div>
                                <div className="item-row">
                                    <div className="field-col">
                                        <label>Year (EN)</label>
                                        <input placeholder="Year (EN)" value={edu.yearEn || edu.year || ''} onChange={e => updateEducation(i, 'yearEn', e.target.value)} />
                                    </div>
                                    <div className="field-col">
                                        <label>Year (FR)</label>
                                        <input placeholder="Année (FR)" value={edu.yearFr || edu.year || ''} onChange={e => updateEducation(i, 'yearFr', e.target.value)} />
                                    </div>
                                </div>
                                <div className="item-row">
                                    <div className="field-col">
                                        <label>Description (EN) - one point per line</label>
                                        <textarea
                                            placeholder="• Major in CS..."
                                            value={edu.descriptionEn || ''}
                                            onChange={e => updateEducation(i, 'descriptionEn', e.target.value)}
                                            rows={3}
                                            className="bio-textarea"
                                        />
                                    </div>
                                    <div className="field-col">
                                        <label>Description (FR) - one point per line</label>
                                        <textarea
                                            placeholder="• Majeure en informatique..."
                                            value={edu.descriptionFr || ''}
                                            onChange={e => updateEducation(i, 'descriptionFr', e.target.value)}
                                            rows={3}
                                            className="bio-textarea"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="editor-section hud-glass">
                    <div className="section-header-btn">
                        <h2 className="hud-title"><span className="caret">{'>'}</span> CORE_TECHNOLOGIES</h2>
                        <button type="button" onClick={addSkill} className="add-btn"><Plus size={14} /> ADD</button>
                    </div>
                    <div className="resume-list skills-grid">
                        {(formData.resumeData.skills || []).map((skill, i) => (
                            <div key={i} className="resume-item skill-item hud-glass">
                                <input placeholder="Technology Name" value={skill.name} onChange={e => updateSkill(i, 'name', e.target.value)} />
                                <div className="skill-ctrl">
                                    <input type="range" min="0" max="100" value={skill.level} onChange={e => updateSkill(i, 'level', parseInt(e.target.value))} />
                                    <span className="skill-val">{skill.level}%</span>
                                    <button type="button" onClick={() => removeSkill(i)} className="del-btn-icon"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="editor-section hud-glass">
                    <div className="section-header-btn">
                        <h2 className="hud-title"><span className="caret">{'>'}</span> TOOLS_NODE</h2>
                        <button type="button" onClick={addTool} className="add-btn"><Plus size={14} /> ADD</button>
                    </div>
                    <div className="resume-list skills-grid">
                        {(formData.resumeData.tools || []).map((tool, i) => (
                            <div key={i} className="resume-item skill-item hud-glass">
                                <input placeholder="Tool Name" value={tool.name} onChange={e => updateTool(i, 'name', e.target.value)} />
                                <div className="skill-ctrl">
                                    <input type="range" min="0" max="100" value={tool.level} onChange={e => updateTool(i, 'level', parseInt(e.target.value))} />
                                    <span className="skill-val">{tool.level}%</span>
                                    <button type="button" onClick={() => removeTool(i)} className="del-btn-icon"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="editor-section hud-glass">
                    <div className="section-header-btn">
                        <h2 className="hud-title"><span className="caret">{'>'}</span> LANGUAGES_DEV</h2>
                        <button type="button" onClick={addProgrammingLanguage} className="add-btn"><Plus size={14} /> ADD</button>
                    </div>
                    <div className="resume-list skills-grid">
                        {(formData.resumeData.programmingLanguages || []).map((lang, i) => (
                            <div key={i} className="resume-item skill-item hud-glass">
                                <input placeholder="Language (e.g. C++)" value={lang.name} onChange={e => updateProgrammingLanguage(i, 'name', e.target.value)} />
                                <div className="skill-ctrl">
                                    <input type="range" min="0" max="100" value={lang.level} onChange={e => updateProgrammingLanguage(i, 'level', parseInt(e.target.value))} />
                                    <span className="skill-val">{lang.level}%</span>
                                    <button type="button" onClick={() => removeProgrammingLanguage(i)} className="del-btn-icon"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="editor-section hud-glass">
                    <div className="section-header-btn">
                        <h2 className="hud-title"><span className="caret">{'>'}</span> LANGUAGES_NODE</h2>
                        <button type="button" onClick={addLanguage} className="add-btn"><Plus size={14} /> ADD</button>
                    </div>
                    <div className="resume-list">
                        {(formData.resumeData.languages || []).map((lang, i) => (
                            <div key={i} className="resume-item hud-glass">
                                <div className="item-row">
                                    <div className="field-col">
                                        <label>Language (EN)</label>
                                        <input placeholder="Language (e.g. FRENCH)" value={lang.nameEn || lang.name || ''} onChange={e => updateLanguage(i, 'nameEn', e.target.value)} />
                                    </div>
                                    <div className="field-col">
                                        <label>Langue (FR)</label>
                                        <input placeholder="Langue (ex. FRANÇAIS)" value={lang.nameFr || lang.name || ''} onChange={e => updateLanguage(i, 'nameFr', e.target.value)} />
                                    </div>
                                    <button type="button" onClick={() => removeLanguage(i)} className="del-btn"><Trash2 size={14} /></button>
                                </div>
                                <div className="item-row">
                                    <div className="field-col">
                                        <label>Status (EN)</label>
                                        <input placeholder="Status (e.g. NATIVE)" value={lang.statusEn || lang.status || ''} onChange={e => updateLanguage(i, 'statusEn', e.target.value)} />
                                    </div>
                                    <div className="field-col">
                                        <label>Statut (FR)</label>
                                        <input placeholder="Statut (ex. NATIF)" value={lang.statusFr || lang.status || ''} onChange={e => updateLanguage(i, 'statusFr', e.target.value)} />
                                    </div>
                                </div>
                                <div className="item-row">
                                    <div className="skill-ctrl">
                                        <label style={{ fontSize: '0.6rem', color: '#555' }}>LEVEL (1-5)</label>
                                        <input type="range" min="1" max="5" value={lang.level} onChange={e => updateLanguage(i, 'level', parseInt(e.target.value))} />
                                        <span className="skill-val">{lang.level}/5</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="editor-actions">
                <button type="submit" className="cyber-rect-btn primary" disabled={saving}>
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    <span>{saving ? 'UPLOADING_INTEL...' : 'COMMIT_PROFILE_CHANGES'}</span>
                </button>
            </div>

            <style jsx>{`
                .profile-editor-form {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }
                .editor-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 2rem;
                }
                .editor-section {
                    padding: 2rem;
                    position: relative;
                }
                .hud-title {
                    font-size: 0.8rem;
                    font-weight: 800;
                    color: #888;
                    margin-bottom: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .grid-cols-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }
                .field-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .field-group.full { grid-column: span 2; }
                .field-group label {
                    font-size: 0.6rem;
                    color: #555;
                    font-weight: 900;
                    text-transform: uppercase;
                }
                .admin-input {
                    background: #0a0a0a;
                    border: 1px solid #222;
                    color: #fff;
                    padding: 0.8rem;
                    font-family: inherit;
                    font-size: 0.9rem;
                    transition: border-color 0.2s;
                }
                .admin-input:focus {
                    outline: none;
                    border-color: var(--primary);
                }

                /* Resume Items */
                .section-header-btn {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }
                .add-btn {
                    background: rgba(0, 255, 102, 0.1);
                    color: var(--primary);
                    border: 1px solid var(--primary);
                    padding: 0.4rem 1rem;
                    font-size: 0.7rem;
                    font-weight: 800;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .resume-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .resume-item {
                    padding: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                .item-row {
                    display: flex;
                    gap: 0.75rem;
                }
                .resume-item input, .resume-item textarea {
                    background: #050505;
                    border: 1px solid #1a1a1a;
                    color: #ccc;
                    padding: 0.6rem;
                    font-size: 0.85rem;
                    font-family: inherit;
                    width: 100%;
                }
                .resume-item input:focus {
                    outline: none;
                    border-color: var(--primary);
                    color: #fff;
                }
                .del-btn {
                    padding: 0 1rem;
                    background: rgba(255, 0, 0, 0.1);
                    color: #ff4444;
                    border: 1px solid #ff4444;
                    cursor: pointer;
                }
                .del-btn-icon {
                    background: none;
                    border: none;
                    color: #444;
                    cursor: pointer;
                    transition: color 0.2s;
                }
                .del-btn-icon:hover { color: #ff4444; }

                .skills-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                 .skill-item {
                    flex-direction: row;
                    align-items: center;
                    gap: 2rem;
                }
                .skill-item input {
                    flex: 1;
                    width: auto;
                }
                .skill-ctrl {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    flex: 1;
                }
                .skill-val {
                    font-size: 0.9rem;
                    color: var(--primary);
                    font-weight: 900;
                    min-width: 45px;
                    font-family: 'JetBrains Mono', monospace;
                }
                input[type=range] {
                    flex: 1;
                    accent-color: var(--primary);
                    height: 12px;
                    cursor: pointer;
                }

                .bio-split {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                    margin-bottom: 1rem;
                }

                .field-col {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                    flex: 1;
                }

                .field-col label {
                    font-size: 0.6rem;
                    color: #555;
                    font-weight: 800;
                    text-transform: uppercase;
                }

                .editor-actions {
                    margin-top: 2rem;
                    display: flex;
                    justify-content: flex-end;
                }

                .search-box {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(255, 255, 255, 0.05);
                    padding: 0.2rem 0.6rem;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                }
                .search-box input {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 0.75rem;
                    outline: none;
                    width: 150px;
                }
                .project-picker {
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 4px;
                    padding: 1rem;
                    margin-bottom: 1rem;
                }
                .project-grid-mini {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 0.75rem;
                    max-height: 300px;
                    overflow-y: auto;
                    padding-right: 0.5rem;
                }
                .project-grid-mini::-webkit-scrollbar { width: 4px; }
                .project-grid-mini::-webkit-scrollbar-thumb { background: var(--primary); }

                .picker-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.6rem;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid transparent;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .picker-item:hover { background: rgba(0, 255, 157, 0.08); border-color: rgba(0, 255, 157, 0.2); }
                .picker-item.selected { background: rgba(0, 255, 157, 0.15); border-color: var(--primary); }
                .item-check {
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 2px;
                    color: var(--primary);
                }
                .item-name { font-size: 0.75rem; color: #888; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .picker-item.selected .item-name { color: #fff; }
                .selected-status { font-size: 0.65rem; font-weight: 950; color: #555; display: flex; align-items: center; gap: 0.5rem; }
            `}</style>
        </form>
    );
}
