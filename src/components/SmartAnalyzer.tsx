import { useState } from 'react';
import { X, Sparkles, AlertTriangle, CheckCircle2, Loader2, Zap, ChevronDown, ChevronUp, Play } from 'lucide-react';
import { analyzePromptSmart } from '../services/smartAnalyzer';
import type { SmartAnalysisResult, Suggestion } from '../services/smartAnalyzer';

interface SmartAnalyzerProps {
    prompt: string;
    apiKey: string;
    onApplySuggestion: (content: string, title: string) => void;
    onClose: () => void;
}

export const SmartAnalyzer = ({ prompt, apiKey, onApplySuggestion, onClose }: SmartAnalyzerProps) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<SmartAnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null);
    const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());

    const handleAnalyze = async () => {
        if (!apiKey) {
            setError('API Key bulunamadı. Lütfen önce API Key giriniz.');
            return;
        }

        setIsAnalyzing(true);
        setError(null);

        try {
            const analysis = await analyzePromptSmart(prompt, apiKey);
            setResult(analysis);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleApply = (suggestion: Suggestion) => {
        onApplySuggestion(suggestion.contentToAdd, suggestion.title);
        setAppliedSuggestions(prev => new Set(prev).add(suggestion.id));
    };

    const handleApplyAll = () => {
        if (!result) return;

        // Apply critical first, then important, then recommended
        const sorted = [...result.suggestions].sort((a, b) => {
            const severityOrder = { critical: 0, important: 1, recommended: 2 };
            return severityOrder[a.severity] - severityOrder[b.severity];
        });

        sorted.forEach(suggestion => {
            if (!appliedSuggestions.has(suggestion.id)) {
                handleApply(suggestion);
            }
        });
    };

    const getSeverityColor = (severity: Suggestion['severity']) => {
        switch (severity) {
            case 'critical':
                return 'text-red-400 bg-red-900/20 border-red-500/30';
            case 'important':
                return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
            case 'recommended':
                return 'text-green-400 bg-green-900/20 border-green-500/30';
        }
    };

    const getSeverityIcon = (severity: Suggestion['severity']) => {
        switch (severity) {
            case 'critical':
                return '🔴';
            case 'important':
                return '🟡';
            case 'recommended':
                return '🟢';
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        if (score >= 40) return 'text-orange-400';
        return 'text-red-400';
    };

    const getScoreBar = (score: number) => {
        const percentage = score;
        let color = 'bg-green-500';
        if (score < 80) color = 'bg-yellow-500';
        if (score < 60) color = 'bg-orange-500';
        if (score < 40) color = 'bg-red-500';

        return (
            <div className="flex-1 bg-gray-700 rounded-full h-2">
                <div
                    className={`${color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden border border-purple-500/30 flex flex-col shadow-2xl">
                {/* Header */}
                <div className="p-5 border-b border-gray-800 bg-gradient-to-r from-purple-900/30 to-pink-900/30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Sparkles size={28} className="text-purple-400" />
                            <div>
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Smart Analyze
                                </h2>
                                <p className="text-sm text-gray-400">AI-Powered Prompt Analysis & Suggestions</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {!result && !isAnalyzing && (
                        <div className="text-center py-16">
                            <Sparkles size={72} className="mx-auto mb-6 text-purple-400 animate-pulse" />
                            <h3 className="text-2xl font-bold mb-3">Prompt'unu Derinlemesine Analiz Et</h3>
                            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                                AI, prompt'unu 10 kategoride detaylı analiz edecek, sektörünü tespit edecek ve
                                <strong> sana özel, isabetli öneriler</strong> sunacak. Tek tıkla uygula!
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
                                <div className="bg-gray-800/50 rounded-lg p-4">
                                    <div className="text-2xl mb-2">🎯</div>
                                    <div className="text-sm font-medium">Context Detection</div>
                                    <div className="text-xs text-gray-400">Sektör & Tip</div>
                                </div>
                                <div className="bg-gray-800/50 rounded-lg p-4">
                                    <div className="text-2xl mb-2">📊</div>
                                    <div className="text-sm font-medium">10 Kategori</div>
                                    <div className="text-xs text-gray-400">0-1000 Puan</div>
                                </div>
                                <div className="bg-gray-800/50 rounded-lg p-4">
                                    <div className="text-2xl mb-2">💡</div>
                                    <div className="text-sm font-medium">Smart Suggestions</div>
                                    <div className="text-xs text-gray-400">Tek Tıkla Uygula</div>
                                </div>
                            </div>
                            <button
                                onClick={handleAnalyze}
                                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl hover:shadow-purple-600/50 hover:scale-105"
                            >
                                <span className="flex items-center gap-2">
                                    <Sparkles size={20} />
                                    Analizi Başlat
                                </span>
                            </button>
                        </div>
                    )}

                    {isAnalyzing && (
                        <div className="text-center py-16">
                            <Loader2 size={72} className="mx-auto mb-6 text-purple-400 animate-spin" />
                            <h3 className="text-xl font-semibold mb-3">Derin Analiz Yapılıyor...</h3>
                            <p className="text-gray-400">Context tespit ediliyor, puanlanıyor, öneriler oluşturuluyor...</p>
                            <p className="text-sm text-gray-500 mt-2">Bu 20-40 saniye sürebilir.</p>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-16">
                            <AlertTriangle size={72} className="mx-auto mb-6 text-red-400" />
                            <h3 className="text-xl font-semibold mb-3 text-red-400">Hata Oluştu</h3>
                            <p className="text-gray-400 mb-6">{error}</p>
                            <button
                                onClick={handleAnalyze}
                                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                            >
                                Tekrar Dene
                            </button>
                        </div>
                    )}

                    {result && (
                        <div className="space-y-6">
                            {/* Context Card */}
                            <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-lg p-5">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">Context Detection</h3>
                                        <p className="text-sm text-gray-400">AI tespit etti</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                            {result.scores.total}/1000
                                        </div>
                                        <div className="text-sm text-gray-400">Toplam Skor</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div className="bg-gray-800/50 rounded p-3">
                                        <div className="text-xs text-gray-400">Sektör</div>
                                        <div className="font-semibold">{result.context.industry}</div>
                                    </div>
                                    <div className="bg-gray-800/50 rounded p-3">
                                        <div className="text-xs text-gray-400">Bot Türü</div>
                                        <div className="font-semibold">{result.context.botType}</div>
                                    </div>
                                    <div className="bg-gray-800/50 rounded p-3">
                                        <div className="text-xs text-gray-400">Dil</div>
                                        <div className="font-semibold">{result.context.language}</div>
                                    </div>
                                    <div className="bg-gray-800/50 rounded p-3">
                                        <div className="text-xs text-gray-400">Karmaşıklık</div>
                                        <div className="font-semibold">{result.context.complexity}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Scores */}
                            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-5">
                                <h3 className="text-lg font-bold mb-4">📊 Detaylı Skorlar</h3>
                                <div className="space-y-3">
                                    {Object.entries(result.scores).filter(([key]) => key !== 'total').map(([key, score]) => {
                                        const labels: Record<string, string> = {
                                            identity: '🤖 Kimlik Netliği',
                                            tasks: '🎯 Görev Tanımı',
                                            rules: '📋 Kurallar',
                                            tone: '💬 İletişim Tarzı',
                                            errorHandling: '⚠️ Hata Yönetimi',
                                            examples: '📌 Örnekler',
                                            security: '🔒 Güvenlik',
                                            readability: '📖 Okunabilirlik',
                                            consistency: '🔄 Tutarlılık',
                                            completeness: '✅ Tamlık'
                                        };

                                        return (
                                            <div key={key} className="flex items-center gap-3">
                                                <div className="w-40 text-sm">{labels[key]}</div>
                                                {getScoreBar(score as number)}
                                                <div className={`w-12 text-right font-semibold ${getScoreColor(score as number)}`}>
                                                    {score}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Suggestions */}
                            {result.suggestions.length > 0 && (
                                <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold">💡 Akıllı Öneriler ({result.suggestions.length})</h3>
                                        <button
                                            onClick={handleApplyAll}
                                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                                        >
                                            <Play size={16} />
                                            Tümünü Uygula
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {result.suggestions.map((suggestion) => {
                                            const isExpanded = expandedSuggestion === suggestion.id;
                                            const isApplied = appliedSuggestions.has(suggestion.id);

                                            return (
                                                <div
                                                    key={suggestion.id}
                                                    className={`border rounded-lg p-4 transition-all ${getSeverityColor(suggestion.severity)}`}
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span>{getSeverityIcon(suggestion.severity)}</span>
                                                                <span className="font-semibold">{suggestion.title}</span>
                                                                {isApplied && (
                                                                    <span className="text-xs bg-green-600 px-2 py-0.5 rounded">
                                                                        Uygulandı ✓
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-gray-400 mb-2">{suggestion.reasoning}</p>

                                                            {isExpanded && (
                                                                <div className="mt-3 p-3 bg-gray-900/50 rounded text-sm font-mono text-gray-300 whitespace-pre-wrap">
                                                                    {suggestion.contentToAdd}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => setExpandedSuggestion(isExpanded ? null : suggestion.id)}
                                                                className="p-2 hover:bg-gray-700 rounded transition-colors"
                                                                title={isExpanded ? "Gizle" : "Önizle"}
                                                            >
                                                                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                            </button>
                                                            <button
                                                                onClick={() => handleApply(suggestion)}
                                                                disabled={isApplied}
                                                                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${isApplied
                                                                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                                                    : 'bg-purple-600 hover:bg-purple-700'
                                                                    }`}
                                                            >
                                                                <Zap size={16} />
                                                                {isApplied ? 'Uygulandı' : 'Uygula'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Gaps & Strengths */}
                            <div className="grid md:grid-cols-2 gap-4">
                                {result.gaps.length > 0 && (
                                    <div className="bg-red-900/10 border border-red-500/30 rounded-lg p-4">
                                        <h4 className="font-semibold mb-2 flex items-center gap-2 text-red-400">
                                            <AlertTriangle size={18} />
                                            Eksikler ({result.gaps.length})
                                        </h4>
                                        <ul className="text-sm text-gray-300 space-y-1">
                                            {result.gaps.map((gap, idx) => (
                                                <li key={idx}>• {gap}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {result.strengths.length > 0 && (
                                    <div className="bg-green-900/10 border border-green-500/30 rounded-lg p-4">
                                        <h4 className="font-semibold mb-2 flex items-center gap-2 text-green-400">
                                            <CheckCircle2 size={18} />
                                            Güçlü Yanlar ({result.strengths.length})
                                        </h4>
                                        <ul className="text-sm text-gray-300 space-y-1">
                                            {result.strengths.map((strength, idx) => (
                                                <li key={idx}>• {strength}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {result && (
                    <div className="p-4 border-t border-gray-800 bg-gray-800/30 flex items-center justify-between">
                        <p className="text-sm text-gray-400">
                            {appliedSuggestions.size > 0
                                ? `${appliedSuggestions.size} öneri uygulandı`
                                : 'Önerileri uygulayarak prompt\'unu geliştir'}
                        </p>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                            Kapat
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
