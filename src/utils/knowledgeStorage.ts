import { KnowledgeFile } from '../types/knowledge';

const STORAGE_KEY = 'system-prompt-dev-knowledge-base';

// Save knowledge files to localStorage
export const saveKnowledgeFiles = (files: KnowledgeFile[]): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
    } catch (error) {
        console.error('Error saving knowledge files:', error);
        // If storage is full, try to save without content (just metadata)
        try {
            const lightFiles = files.map(f => ({
                ...f,
                content: f.content.substring(0, 1000), // Keep only first 1000 chars
            }));
            localStorage.setItem(STORAGE_KEY, JSON.stringify(lightFiles));
        } catch (e) {
            console.error('Failed to save even light version:', e);
        }
    }
};

// Load knowledge files from localStorage
export const loadKnowledgeFiles = (): KnowledgeFile[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];

        const files = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        return files.map((f: any) => ({
            ...f,
            uploadedAt: new Date(f.uploadedAt),
        }));
    } catch (error) {
        console.error('Error loading knowledge files:', error);
        return [];
    }
};

// Clear all knowledge files
export const clearKnowledgeFiles = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Error clearing knowledge files:', error);
    }
};

// Get combined knowledge as single string for AI context
export const getCombinedKnowledge = (files: KnowledgeFile[]): string => {
    if (files.length === 0) return '';

    let combined = '\n\n=== KNOWLEDGE BASE ===\n';
    combined += 'The following information is available from uploaded files:\n\n';

    files.forEach((file) => {
        combined += `--- ${file.name} (${file.type}) ---\n`;
        combined += file.content + '\n\n';
    });

    combined += '=== END KNOWLEDGE BASE ===\n\n';

    return combined;
};

// Calculate total size of knowledge base
export const calculateTotalSize = (files: KnowledgeFile[]): number => {
    return files.reduce((total, file) => total + file.size, 0);
};
