import { Key, FileText, Wand2, Database, Layers } from 'lucide-react';
import { useStore } from '../store';
import { useState } from 'react';
import { TemplateModal } from './TemplateModal';
import { PromptWizard } from './PromptWizard';
import { KnowledgePanel } from './KnowledgePanel';
import { ComponentLibrary } from './ComponentLibrary';

export const Header = () => {
    const { apiKey, setApiKey, setPrompt, clearMessages, currentPrompt } = useStore();
    const [showTemplates, setShowTemplates] = useState(false);
    const [showWizard, setShowWizard] = useState(false);
    const [showKnowledgeBase, setShowKnowledgeBase] = useState(false);
    const [showComponentLibrary, setShowComponentLibrary] = useState(false);

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
                            onClick={() => setShowWizard(true)}
                            className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 rounded-lg transition-all shadow-lg hover:shadow-xl hover:shadow-green-600/30 hover:scale-105"
                            title="AI Prompt Wizard"
                        >
                            <Wand2 size={18} className="group-hover:rotate-12 transition-transform" />
                            <span className="text-sm font-medium">Sihirbaz ile Oluştur</span>
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
                            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 rounded-lg transition-all shadow-md hover:shadow-lg hover:shadow-purple-600/20"
                            title="Templates"
                        >
                            <Layers size={18} />
                            <span className="text-sm font-medium">Şablonlar</span>
                        </button>

                        <div className="h-8 w-px bg-gray-700 mx-2" />

                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative flex items-center bg-gray-900 rounded-lg p-1">
                                <div className="px-3 py-1.5 border-r border-gray-700">
                                    <Key size={14} className="text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="Gemini API Key..."
                                    className="bg-transparent border-none text-white text-sm focus:ring-0 w-40 placeholder-gray-600"
                                />
                            </div>
                        </div>
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
                    onInsert={() => {/* Will be handled in PromptPanel */ }}
                    onClose={() => setShowComponentLibrary(false)}
                />
            )}
        </>
    );
};
