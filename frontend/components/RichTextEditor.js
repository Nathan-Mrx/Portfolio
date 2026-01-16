'use client';

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'clean'],
    ],
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list',
    'link',
];

export default function RichTextEditor({ value, onChange, placeholder }) {
    const handleValueChange = (content) => {
        // Replace non-breaking spaces (\u00A0 and &nbsp;) with regular spaces
        // This fixes wrapping issues where Quill uses nbsps
        const cleaned = content.replace(/\u00A0/g, ' ').replace(/&nbsp;/g, ' ');
        if (onChange) {
            onChange(cleaned);
        }
    };

    return (
        <div className="rich-text-editor">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={handleValueChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
            />
            <style jsx global>{`
                .rich-text-editor .ql-container {
                    min-height: 150px;
                    font-family: 'Inter', sans-serif;
                    font-size: 1rem;
                    background: rgba(255, 255, 255, 0.03);
                    border-color: #333 !important;
                    color: #fff;
                    word-break: normal !important;
                    overflow-wrap: break-word !important;
                    hyphens: none !important;
                    white-space: pre-wrap !important;
                }
                .rich-text-editor .ql-editor {
                    word-break: normal !important;
                    overflow-wrap: break-word !important;
                    hyphens: none !important;
                    white-space: pre-wrap !important;
                }
                .rich-text-editor .ql-toolbar {
                    background: #1a1a1a;
                    border-color: #333 !important;
                }
                .rich-text-editor .ql-toolbar .ql-stroke {
                    stroke: #888;
                }
                .rich-text-editor .ql-toolbar .ql-fill {
                    fill: #888;
                }
                .rich-text-editor .ql-toolbar .ql-picker {
                    color: #888;
                }
                .rich-text-editor .ql-editor.ql-blank::before {
                    color: #555 !important;
                }
            `}</style>
        </div>
    );
}
