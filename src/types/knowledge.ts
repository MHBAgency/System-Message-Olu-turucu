export interface KnowledgeFile {
    id: string;
    name: string;
    type: 'excel' | 'word' | 'pdf' | 'text';
    size: number;
    content: string;
    uploadedAt: Date;
    preview: string; // First 200 chars for preview
}

export const FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB

export const SUPPORTED_FORMATS = {
    excel: ['.xlsx', '.xls', '.csv'],
    word: ['.docx'],
    pdf: ['.pdf'],
    text: ['.txt'],
};

export const getFileType = (filename: string): KnowledgeFile['type'] | null => {
    const ext = `.${filename.split('.').pop()?.toLowerCase()}`;

    if (SUPPORTED_FORMATS.excel.includes(ext)) return 'excel';
    if (SUPPORTED_FORMATS.word.includes(ext)) return 'word';
    if (SUPPORTED_FORMATS.pdf.includes(ext)) return 'pdf';
    if (SUPPORTED_FORMATS.text.includes(ext)) return 'text';

    return null;
};

export const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};
