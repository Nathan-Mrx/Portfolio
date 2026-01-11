'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Plus, Trash2, Briefcase, GraduationCap, Code } from 'lucide-react';
import ImageUpload from './ImageUpload';

export default function ProfileEditor({ data, onSave }) {
    const [formData, setFormData] = useState({
        aboutEn: '',
        aboutFr: '',
        email: '',
        phone: '',
        jobTitleEn: '',
        jobTitleFr: '',
        availabilityStatus: '',
        location: '',
        profileImageUrl: '',
        resumeData: {
            experience: [],
            education: [],
            skills: [],
            languages: []
        }
    });

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
                    languages: data.resumeData?.languages || []
                }
            }));
        }
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
        newResume.experience = [...(newResume.experience || []), { company: '', role: '', period: '', description: '' }];
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
        newResume.education = [...(newResume.education || []), { school: '', degree: '', year: '' }];
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

    // Language Handlers
    const addLanguage = () => {
        const newResume = { ...formData.resumeData };
        newResume.languages = [...(newResume.languages || []), { name: '', level: 5, status: 'PROFESSIONAL' }];
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

                {/* About Biographies */}
                <div className="editor-section hud-glass">
                    <h2 className="hud-title"><span className="caret">{'>'}</span> BIOGRAPHIES</h2>
                    <div className="field-group">
                        <label>About Me (EN)</label>
                        <textarea
                            className="admin-input"
                            rows="5"
                            value={formData.aboutEn}
                            onChange={(e) => setFormData({ ...formData, aboutEn: e.target.value })}
                        />
                    </div>
                    <div className="field-group">
                        <label>About Me (FR)</label>
                        <textarea
                            className="admin-input"
                            rows="5"
                            value={formData.aboutFr}
                            onChange={(e) => setFormData({ ...formData, aboutFr: e.target.value })}
                        />
                    </div>
                </div>

                {/* Resume Sections */}
                <div className="editor-section hud-glass">
                    <div className="section-header-btn">
                        <h2 className="hud-title"><span className="caret">{'>'}</span> EXPERIENCE</h2>
                        <button type="button" onClick={addExperience} className="add-btn"><Plus size={14} /> ADD</button>
                    </div>
                    <div className="resume-list">
                        {(formData.resumeData.experience || []).map((exp, i) => (
                            <div key={i} className="resume-item hud-glass">
                                <div className="item-row">
                                    <input placeholder="Company" value={exp.company} onChange={e => updateExperience(i, 'company', e.target.value)} />
                                    <input placeholder="Role" value={exp.role} onChange={e => updateExperience(i, 'role', e.target.value)} />
                                </div>
                                <div className="item-row">
                                    <input placeholder="Period (e.g. 2021 - Present)" value={exp.period} onChange={e => updateExperience(i, 'period', e.target.value)} />
                                    <button type="button" onClick={() => removeExperience(i)} className="del-btn"><Trash2 size={14} /></button>
                                </div>
                                <textarea placeholder="Description" rows="2" value={exp.description} onChange={e => updateExperience(i, 'description', e.target.value)} />
                            </div>
                        ))}
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
                                    <input placeholder="School" value={edu.school} onChange={e => updateEducation(i, 'school', e.target.value)} />
                                    <input placeholder="Degree" value={edu.degree} onChange={e => updateEducation(i, 'degree', e.target.value)} />
                                </div>
                                <div className="item-row">
                                    <input placeholder="Year" value={edu.year} onChange={e => updateEducation(i, 'year', e.target.value)} />
                                    <button type="button" onClick={() => removeEducation(i)} className="del-btn"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="editor-section hud-glass">
                    <div className="section-header-btn">
                        <h2 className="hud-title"><span className="caret">{'>'}</span> SKILLS_ENGINE</h2>
                        <button type="button" onClick={addSkill} className="add-btn"><Plus size={14} /> ADD</button>
                    </div>
                    <div className="resume-list skills-grid">
                        {(formData.resumeData.skills || []).map((skill, i) => (
                            <div key={i} className="resume-item skill-item hud-glass">
                                <input placeholder="Skill Name" value={skill.name} onChange={e => updateSkill(i, 'name', e.target.value)} />
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
                        <h2 className="hud-title"><span className="caret">{'>'}</span> LANGUAGES_NODE</h2>
                        <button type="button" onClick={addLanguage} className="add-btn"><Plus size={14} /> ADD</button>
                    </div>
                    <div className="resume-list">
                        {(formData.resumeData.languages || []).map((lang, i) => (
                            <div key={i} className="resume-item hud-glass">
                                <div className="item-row">
                                    <input placeholder="Language (e.g. FRENCH)" value={lang.name} onChange={e => updateLanguage(i, 'name', e.target.value)} />
                                    <input placeholder="Status (e.g. NATIVE)" value={lang.status} onChange={e => updateLanguage(i, 'status', e.target.value)} />
                                </div>
                                <div className="item-row">
                                    <div className="skill-ctrl">
                                        <label style={{ fontSize: '0.6rem', color: '#555' }}>LEVEL (1-5)</label>
                                        <input type="range" min="1" max="5" value={lang.level} onChange={e => updateLanguage(i, 'level', parseInt(e.target.value))} />
                                        <span className="skill-val">{lang.level}/5</span>
                                    </div>
                                    <button type="button" onClick={() => removeLanguage(i)} className="del-btn"><Trash2 size={14} /></button>
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
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 1rem;
                }
                .skill-item {
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                }
                .skill-ctrl {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    flex: 1;
                    margin-left: 1rem;
                }
                .skill-val {
                    font-size: 0.7rem;
                    color: var(--primary);
                    font-weight: 800;
                    min-width: 35px;
                }
                input[type=range] {
                    flex: 1;
                    accent-color: var(--primary);
                }

                .editor-actions {
                    margin-top: 2rem;
                    display: flex;
                    justify-content: flex-end;
                }

                @media (max-width: 768px) {
                    .grid-cols-2 { grid-template-columns: 1fr; }
                    .field-group.full { grid-column: span 1; }
                }
            `}</style>
        </form>
    );
}
