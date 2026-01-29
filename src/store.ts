import { create } from 'zustand';
import {
    saveApiKey,
    saveCurrentPrompt,
    saveMessages,
    savePromptVersions,
    loadApiKey,
    loadCurrentPrompt,
    loadMessages,
    loadPromptVersions
} from './utils/storage';
import { KnowledgeFile } from './types/knowledge';
import { saveKnowledgeFiles, loadKnowledgeFiles } from './utils/knowledgeStorage';

export interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp: Date;
    feedback?: 'good' | 'bad';
    annotation?: string;
}

export interface PromptVersion {
    id: string;
    content: string;
    timestamp: Date;
    reason?: string;
}

interface AppState {
    // Chat state
    messages: Message[];
    isLoading: boolean;
    addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
    setMessageFeedback: (messageId: string, feedback: 'good' | 'bad', annotation?: string) => void;
    clearMessages: () => void;

    // System prompt state
    currentPrompt: string;
    promptVersions: PromptVersion[];
    setPrompt: (content: string, reason?: string) => void;
    revertToVersion: (versionId: string) => void;

    // AI API key
    apiKey: string;
    setApiKey: (key: string) => void;

    // UI state
    isOptimizing: boolean;
    setOptimizing: (value: boolean) => void;
    pendingOptimization: string | null;
    setPendingOptimization: (content: string | null) => void;

    // Knowledge Base
    knowledgeFiles: KnowledgeFile[];
    addKnowledgeFile: (file: KnowledgeFile) => void;
    removeKnowledgeFile: (fileId: string) => void;
    clearKnowledgeFiles: () => void;
}

// Load initial state from localStorage
const initialApiKey = loadApiKey() || 'AIzaSyD29LJEi8YGBPpfOG0bvuV_po_b6DVbccA';
const initialPrompt = loadCurrentPrompt() || `Sen yardımcı bir AI asistanısın. Kullanıcının sorularını net ve açıklayıcı bir şekilde yanıtla.`;
const initialMessages = loadMessages();
const initialVersions = loadPromptVersions();
const initialKnowledgeFiles = loadKnowledgeFiles();

export const useStore = create<AppState>((set) => ({
    // Chat state
    messages: initialMessages,
    isLoading: false,
    addMessage: (message) =>
        set((state) => {
            const newMessages = [
                ...state.messages,
                {
                    ...message,
                    id: crypto.randomUUID(),
                    timestamp: new Date(),
                },
            ];
            saveMessages(newMessages);
            return { messages: newMessages };
        }),
    setMessageFeedback: (messageId, feedback, annotation) =>
        set((state) => {
            const newMessages = state.messages.map((msg) =>
                msg.id === messageId ? { ...msg, feedback, annotation } : msg
            );
            saveMessages(newMessages);
            return { messages: newMessages };
        }),
    clearMessages: () => {
        saveMessages([]);
        return set({ messages: [] });
    },

    // System prompt state
    currentPrompt: initialPrompt,
    promptVersions: initialVersions,
    setPrompt: (content, reason) =>
        set((state) => {
            const newVersion: PromptVersion = {
                id: crypto.randomUUID(),
                content,
                timestamp: new Date(),
                reason,
            };
            let newVersions = [...state.promptVersions, newVersion];

            // Keep only last 10 versions
            if (newVersions.length > 10) {
                newVersions = newVersions.slice(-10);
            }

            saveCurrentPrompt(content);
            savePromptVersions(newVersions);
            return {
                currentPrompt: content,
                promptVersions: newVersions,
            };
        }),
    revertToVersion: (versionId) =>
        set((state) => {
            const version = state.promptVersions.find((v) => v.id === versionId);
            if (version) {
                saveCurrentPrompt(version.content);
                return { currentPrompt: version.content };
            }
            return state;
        }),

    // API key
    apiKey: initialApiKey,
    setApiKey: (key) => {
        saveApiKey(key);
        return set({ apiKey: key });
    },

    // UI state
    isOptimizing: false,
    setOptimizing: (value) => set({ isOptimizing: value }),
    pendingOptimization: null,
    setPendingOptimization: (content) => set({ pendingOptimization: content }),

    // Knowledge Base
    knowledgeFiles: initialKnowledgeFiles,
    addKnowledgeFile: (file) =>
        set((state) => {
            const newFiles = [...state.knowledgeFiles, file];
            saveKnowledgeFiles(newFiles);
            return { knowledgeFiles: newFiles };
        }),
    removeKnowledgeFile: (fileId) =>
        set((state) => {
            const newFiles = state.knowledgeFiles.filter((f) => f.id !== fileId);
            saveKnowledgeFiles(newFiles);
            return { knowledgeFiles: newFiles };
        }),
    clearKnowledgeFiles: () => {
        saveKnowledgeFiles([]);
        return set({ knowledgeFiles: [] });
    },
}));
