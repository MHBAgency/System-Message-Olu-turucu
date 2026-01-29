import { useState, useEffect } from 'react';
import { Save, Copy, CheckCircle, History, Sparkles, X, Check, Download, ChevronDown, Award, Layers } from 'lucide-react';
import { useStore } from '../store';
import { downloadMarkdown, downloadJSON, downloadN8NFormat } from '../utils/export';
import { SmartAnalyzer } from './SmartAnalyzer';
import { ComponentLibrary } from './ComponentLibrary';
import { PromptOrganizer } from './PromptOrganizer';

const ExportDropdown = () => {
    const { currentPrompt, promptVersions, messages } = useStore();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors"
                title="Export"
            >
                <Download size={18} />
                <span className="text-sm">Export</span>
                <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20">
                        <button
                            onClick={() => {
                                downloadMarkdown(currentPrompt, promptVersions);
                                setIsOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors rounded-t-lg text-sm"
                        >
                            📄 Markdown (.md)
                        </button>
                        <button
                            onClick={() => {
                                downloadJSON(currentPrompt, promptVersions, messages);
                                setIsOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors text-sm"
                        >
                            📋 JSON (.json)
                        </button>
                        <button
                            onClick={() => {
                                downloadN8NFormat(currentPrompt);
                                setIsOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors rounded-b-lg text-sm"
                        >
                            🔗 N8N Format (.txt)
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export const PromptPanel = () => {
    const {
        currentPrompt,
        setPrompt,
        promptVersions,
        revertToVersion,
        pendingOptimization,
        setPendingOptimization,
        apiKey,
        isOptimizing,
        clearMessages
    } = useStore();

    const [editedPrompt, setEditedPrompt] = useState(currentPrompt);
    const [showVersions, setShowVersions] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showOptimization, setShowOptimization] = useState(false);
    const [showSmartAnalyzer, setShowSmartAnalyzer] = useState(false);
    const [showOrganizer, setShowOrganizer] = useState(false);
    const [optimizationData, setOptimizationData] = useState<{
        optimizedPrompt: string;
        explanation: string;
    } | null>(null);

    useEffect(() => {
        setEditedPrompt(currentPrompt);
    }, [currentPrompt]);

    useEffect(() => {
        if (pendingOptimization) {
            try {
                const data = JSON.parse(pendingOptimization);
                setOptimizationData(data);
                setShowOptimization(true);
            } catch (error) {
                console.error('Failed to parse optimization:', error);
            }
        }
    }, [pendingOptimization]);

    const handleSave = () => {
        setPrompt(editedPrompt, 'Manuel düzenleme');
        clearMessages(); // Clear chat when prompt changes
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(currentPrompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleAcceptOptimization = () => {
        if (optimizationData) {
            setPrompt(optimizationData.optimizedPrompt, optimizationData.explanation);
            setEditedPrompt(optimizationData.optimizedPrompt);
            setShowOptimization(false);
            setPendingOptimization(null);
            setOptimizationData(null);
            clearMessages(); // Clear chat when accepting optimization
        }
    };

    const handleRejectOptimization = () => {
        setShowOptimization(false);
        setPendingOptimization(null);
        setOptimizationData(null);
    };

    const handleRevert = (versionId: string) => {
        revertToVersion(versionId);
        setShowVersions(false);
        clearMessages(); // Clear chat when reverting
    };

    const handleComponentInsert = (content: string) => {
        setEditedPrompt(prev => prev + content);
    };

    const isModified = editedPrompt !== currentPrompt;
    const charCount = editedPrompt.length;

    return (
        <div className="flex flex-col h-full bg-gray-900">
            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-purple-400">System Prompt</h2>
                    <p className="text-sm text-gray-400">{charCount} karakter</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowVersions(!showVersions)}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors relative"
                        title="Versiyon Geçmişi"
                    >
                        <History size={18} />
                        {promptVersions.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-blue-600 text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                {promptVersions.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setShowOrganizer(true)}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors bg-cyan-600/20 border border-cyan-500/30"
                        title="Smart Organize"
                    >
                        <Sparkles size={18} className="text-cyan-400" />
                        <span className="text-sm text-cyan-300">Organize</span>
                    </button>
                    <button
                        onClick={() => setShowSmartAnalyzer(true)}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors bg-purple-600/20 border border-purple-500/30"
                        title="Smart Analyze"
                    >
                        <Award size={18} className="text-purple-400" />
                        <span className="text-sm text-purple-300">Analyze</span>
                    </button>
                    <ExportDropdown />
                    <button
                        onClick={handleCopy}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                        title={copied ? 'Kopyalandı!' : 'Prompt\'u Kopyala'}
                    >
                        {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                    </button>
                </div>
            </div>

            {/* Version History */}
            {showVersions && (
                <div className="p-4 bg-gray-800 border-b border-gray-700 max-h-48 overflow-y-auto">
                    <h3 className="text-sm font-semibold mb-2">Versiyon Geçmişi</h3>
                    {promptVersions.length === 0 ? (
                        <p className="text-sm text-gray-500">Henüz versiyon yok</p>
                    ) : (
                        <div className="space-y-2">
                            {[...promptVersions].reverse().map((version) => (
                                <div
                                    key={version.id}
                                    className="p-2 bg-gray-900 rounded border border-gray-700 hover:border-blue-500 cursor-pointer transition-colors"
                                    onClick={() => handleRevert(version.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-400">
                                            {new Date(version.timestamp).toLocaleString('tr-TR')}
                                        </span>
                                    </div>
                                    {version.reason && (
                                        <p className="text-sm text-gray-300 mt-1">{version.reason}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Optimization Suggestion */}
            {showOptimization && optimizationData && (
                <div className="p-4 bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-b border-purple-700">
                    <div className="flex items-start gap-2 mb-3">
                        <Sparkles size={18} className="text-purple-400 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-purple-300 mb-1">AI Önerisi</h3>
                            <p className="text-sm text-gray-300">{optimizationData.explanation}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleAcceptOptimization}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors"
                        >
                            <Check size={16} />
                            Kabul Et
                        </button>
                        <button
                            onClick={handleRejectOptimization}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                        >
                            <X size={16} />
                            Reddet
                        </button>
                    </div>
                </div>
            )}

            {/* Optimizing indicator */}
            {isOptimizing && (
                <div className="p-3 bg-purple-900/30 border-b border-purple-700 flex items-center gap-2">
                    <Sparkles size={16} className="text-purple-400 animate-pulse" />
                    <span className="text-sm text-purple-300">AI prompt'u optimize ediyor...</span>
                </div>
            )}

            {/* Editor */}
            <div className="flex-1 p-4 overflow-y-auto">
                <textarea
                    value={editedPrompt}
                    onChange={(e) => setEditedPrompt(e.target.value)}
                    className="w-full min-h-full bg-gray-800 border border-gray-700 rounded-lg p-4 focus:outline-none focus:border-purple-500 resize-none font-mono text-sm"
                    placeholder="System prompt'unuzu buraya yazın..."
                />
            </div>

            {/* Save Button - Sticky at bottom */}
            {isModified && (
                <div className="p-4 border-t border-gray-800 bg-gray-900">
                    <button
                        onClick={handleSave}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
                    >
                        <Save size={18} />
                        Kaydet ve Chat'i Sıfırla
                    </button>
                </div>
            )}

            {/* Quality Analyzer Modal */}
            {showSmartAnalyzer && (
                <SmartAnalyzer
                    prompt={currentPrompt}
                    apiKey={apiKey}
                    onApplySuggestion={(content, title) => {
                        // Smart insertion - append to end with spacing
                        const newPrompt = currentPrompt + '\n\n' + content;
                        setPrompt(newPrompt, `Applied: ${title}`);
                    }}
                    onClose={() => setShowSmartAnalyzer(false)}
                />
            )}

            {showOrganizer && (
                <PromptOrganizer
                    prompt={currentPrompt}
                    apiKey={apiKey}
                    onAccept={(organized) => setPrompt(organized, 'Smart Organize')}
                    onClose={() => setShowOrganizer(false)}
                />
            )}
        </div>
    );
};
