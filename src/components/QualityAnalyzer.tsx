import { X, CheckCircle, AlertCircle, TrendingUp, Award } from 'lucide-react';
import { analyzePromptQuality, getScoreColor, getTotalScoreColor, getScoreLabel } from '../utils/promptAnalyzer';

interface QualityAnalyzerProps {
    prompt: string;
    onClose: () => void;
}

export const QualityAnalyzer = ({ prompt, onClose }: QualityAnalyzerProps) => {
    const analysis = analyzePromptQuality(prompt);

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-purple-500/30">
                {/* Header */}
                <div className="p-6 border-b border-gray-800">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-purple-400 flex items-center gap-2">
                                <Award size={28} />
                                Prompt Quality Analysis
                            </h2>
                            <p className="text-sm text-gray-400 mt-1">AI-powered quality assessment</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Total Score */}
                    <div className="mt-6 text-center">
                        <div className={`text-6xl font-bold ${getTotalScoreColor(analysis.total)}`}>
                            {analysis.total}
                            <span className="text-3xl text-gray-500">/100</span>
                        </div>
                        <div className="text-xl text-gray-300 mt-2">
                            {getScoreLabel(analysis.total)}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Category Scores */}
                    <div className="space-y-4 mb-6">
                        <h3 className="text-lg font-semibold text-gray-200 mb-3">Category Breakdown</h3>

                        {Object.entries(analysis.categories).map(([key, category]) => {
                            const percentage = (category.score / category.max) * 100;
                            const labels: Record<string, string> = {
                                clarity: '🎯 Clarity (Netlik)',
                                completeness: '📋 Completeness (Tamlık)',
                                constraints: '🚫 Constraints (Kısıtlamalar)',
                                examples: '💬 Examples (Örnekler)',
                                errorHandling: '⚠️ Error Handling (Hata Yönetimi)',
                            };

                            return (
                                <div key={key} className="bg-gray-800 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-gray-200">{labels[key]}</span>
                                        <span className={`font-bold ${getScoreColor(category.score, category.max)}`}>
                                            {category.score}/{category.max}
                                        </span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                                        <div
                                            className={`h-2 rounded-full transition-all ${percentage >= 80 ? 'bg-green-500' :
                                                    percentage >= 60 ? 'bg-yellow-500' :
                                                        'bg-red-500'
                                                }`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>

                                    {/* Feedback */}
                                    {category.feedback.length > 0 && (
                                        <div className="mt-2 space-y-1">
                                            {category.feedback.map((feedback, idx) => (
                                                <div key={idx} className="text-xs text-gray-400 flex items-start gap-1">
                                                    <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                                                    <span>{feedback}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Strengths */}
                    {analysis.strengths.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
                                <CheckCircle size={20} />
                                Strengths
                            </h3>
                            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                                <ul className="space-y-2">
                                    {analysis.strengths.map((strength, idx) => (
                                        <li key={idx} className="text-sm text-green-300 flex items-start gap-2">
                                            <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                                            <span>{strength}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Recommendations */}
                    {analysis.recommendations.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                                <TrendingUp size={20} />
                                Recommendations
                            </h3>
                            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                                <ul className="space-y-2">
                                    {analysis.recommendations.map((recommendation, idx) => (
                                        <li key={idx} className="text-sm text-yellow-200 flex items-start gap-2">
                                            <TrendingUp size={16} className="mt-0.5 flex-shrink-0" />
                                            <span>{recommendation}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-800 bg-gray-800/50">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
                    >
                        Got it! Let's Improve
                    </button>
                </div>
            </div>
        </div>
    );
};
