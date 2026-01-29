import { Message, PromptVersion } from '../store';

const STORAGE_KEYS = {
    API_KEY: 'system-prompt-dev-api-key',
    CURRENT_PROMPT: 'system-prompt-dev-current-prompt',
    MESSAGES: 'system-prompt-dev-messages',
    PROMPT_VERSIONS: 'system-prompt-dev-prompt-versions',
};

// Save data to localStorage
export const saveToStorage = <T>(key: string, data: T): void => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
};

// Load data from localStorage
export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return defaultValue;
    }
};

// Clear specific key
export const clearStorage = (key: string): void => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error clearing localStorage:', error);
    }
};

// API Key
export const saveApiKey = (apiKey: string): void => {
    saveToStorage(STORAGE_KEYS.API_KEY, apiKey);
};

export const loadApiKey = (): string => {
    return loadFromStorage(STORAGE_KEYS.API_KEY, '');
};

// Current Prompt
export const saveCurrentPrompt = (prompt: string): void => {
    saveToStorage(STORAGE_KEYS.CURRENT_PROMPT, prompt);
};

export const loadCurrentPrompt = (): string | null => {
    return loadFromStorage(STORAGE_KEYS.CURRENT_PROMPT, null);
};

// Messages
export const saveMessages = (messages: Message[]): void => {
    saveToStorage(STORAGE_KEYS.MESSAGES, messages);
};

export const loadMessages = (): Message[] => {
    const messages = loadFromStorage<Message[]>(STORAGE_KEYS.MESSAGES, []);
    // Convert timestamp strings back to Date objects
    return messages.map((msg) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
    }));
};

// Prompt Versions
export const savePromptVersions = (versions: PromptVersion[]): void => {
    saveToStorage(STORAGE_KEYS.PROMPT_VERSIONS, versions);
};

export const loadPromptVersions = (): PromptVersion[] => {
    const versions = loadFromStorage<PromptVersion[]>(STORAGE_KEYS.PROMPT_VERSIONS, []);
    // Convert timestamp strings back to Date objects
    return versions.map((v) => ({
        ...v,
        timestamp: new Date(v.timestamp),
    }));
};

// Clear all app data
export const clearAllStorage = (): void => {
    Object.values(STORAGE_KEYS).forEach(clearStorage);
};
