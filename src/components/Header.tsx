import { Key, FileText, Wand2, Database, Layers } from 'lucide-react';
import { useStore } from '../store';
import { useState } from 'react';
import { TemplateModal } from './TemplateModal';
import { PromptGenerator } from './PromptGenerator';
import { KnowledgePanel } from './KnowledgePanel';
import { ComponentLibrary } from './ComponentLibrary';

export const Header = () => {
    const { apiKey, setApiKey, setPrompt, clearMessages, currentPrompt } = useStore();
    const [showApiInput, setShowApiInput] = useState(!apiKey);
    const [tempKey, setTempKey] = useState('');
    const [showTemplates, setShowTemplates] = useState(false);
    const [showGenerator, setShowGenerator] = useState(false);
    const [showKnowledgeBase, setShowKnowledgeBase] = useState(false);
    const [showComponentLibrary, setShowComponentLibrary] = useState(false);

    const handleSaveKey = () => {
        if (tempKey.trim()) {
            setApiKey(tempKey.trim());
            setShowApiInput(false);
        }
    };

    const handleGeneratedPrompt = (prompt: string) => {
        setPrompt(prompt, 'AI Generated');
        clearMessages();
    };

    return (
        <>
            <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700/50 p-4 shadow-xl">
                <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                            System Prompt Geliştirici
                        </h1>
                        <p className="text-sm text-gray-400 mt-1">
                            AI Agent System Prompt'larını Optimize Et ✨
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowGenerator(true)}
                            className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 rounded-lg transition-all shadow-lg hover:shadow-xl hover:shadow-green-600/30 hover:scale-105"
                            title="AI Prompt Generator"
                        >
                            <Wand2 size={18} className="group-hover:rotate-12 transition-transform" />
                            <span className="text-sm font-medium">Generate Prompt</span>
                        </button>

                        <button
                            onClick={() => setShowKnowledgeBase(true)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-lg transition-all shadow-md hover:shadow-lg hover:shadow-blue-600/20"
                            title="Knowledge Base"
                        >
                            <Database size={18} />
                            <span className="text-sm font-medium">Knowledge Base</span>
                        </button>

                        <button
                            onClick={() => setShowComponentLibrary(true)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 rounded-lg transition-all shadow-md hover:shadow-lg hover:shadow-indigo-600/20"
                            title="Component Library"
                        >
                            <Layers size={18} />
                            <span className="text-sm font-medium">Components</span>
                        </button>

                        <button
                            onClick={() => setShowTemplates(true)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 rounded-lg transition-all shadow-md hover:shadow-lg hover:shadow-purple-600/20"
                            title="Prompt Templates"
                        >
                            <FileText size={18} />
                            <span className="text-sm font-medium">Templates</span>
                        </button>

                        {apiKey && !showApiInput ? (
                            <button
                                onClick={() => setShowApiInput(true)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-gray-800/80 hover:bg-gray-700 rounded-lg transition-all border border-gray-700/50"
                            >
                                <Key size={18} />
                                <span className="text-sm">API Key: ••••••</span>
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <input
                                    type="password"
                                    value={tempKey}
                                    onChange={(e) => setTempKey(e.target.value)}
                                    placeholder="Gemini API Key"
                                    className="px-3 py-2 bg-gray-800/80 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition-all"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSaveKey()}
                                />
                                <button
                                    onClick={handleSaveKey}
                                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg"
                                >
                                    Kaydet
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <TemplateModal isOpen={showTemplates} onClose={() => setShowTemplates(false)} />
            <PromptGenerator
                onGenerated={handleGeneratedPrompt}
                onClose={() => setShowGenerator(false)}
                isOpen={showGenerator}
            />

            {/* Knowledge Base Modal */}
            {showKnowledgeBase && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[85vh] overflow-hidden border border-blue-500/30">
                        <KnowledgePanel onClose={() => setShowKnowledgeBase(false)} />
                    </div>
                </div>
            )}

            {/* Component Library Modal */}
            {showComponentLibrary && (
                <ComponentLibrary
                    onInsert={(content) => {/* Will be handled in PromptPanel */ }}
                    onClose={() => setShowComponentLibrary(false)}
                />
            )}
        </>
    );
};
