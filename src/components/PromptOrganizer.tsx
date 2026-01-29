import { useState } from 'react';
import { X, Sparkles, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { organizePrompt } from '../services/promptOrganizer';

interface PromptOrganizerProps {
    prompt: string;
    apiKey: string;
    onAccept: (organizedPrompt: string) => void;
    onClose: () => void;
}

export const PromptOrganizer = ({ prompt, apiKey, onAccept, onClose }: PromptOrganizerProps) => {
    const [isOrganizing, setIsOrganizing] = useState(false);
    const [result, setResult] = useState<{
        organized: string;
        changes: string[];
        conflicts: string[];
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleOrganize = async () => {
        if (!apiKey) {
            setError('API Key bulunamadı. Lütfen önce API Key giriniz.');
            return;
        }

        setIsOrganizing(true);
        setError(null);

        try {
            const organizationResult = await organizePrompt(prompt, apiKey);
            setResult(organizationResult);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu');
        } finally {
            setIsOrganizing(false);
        }
    };

    const handleAccept = () => {
        if (result) {
            onAccept(result.organized);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden border border-cyan-500/30 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gradient-to-r from-cyan-900/20 to-cyan-800/20">
                    <div className="flex items-center gap-3">
                        <Sparkles size={24} className="text-cyan-400" />
                        <div>
                            <h2 className="text-xl font-semibold text-cyan-400">Smart Organize</h2>
                            <p className="text-sm text-gray-400">Prompt'u düzenle - içeriği değiştirmeden!</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {!result && !isOrganizing && (
                        <div className="text-center py-12">
                            <Sparkles size={64} className="mx-auto mb-4 text-cyan-400" />
                            <h3 className="text-lg font-semibold mb-2">Prompt'u Akıllıca Düzenle</h3>
                            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                                AI, prompt'unuzu profesyonelce organize edecek. <strong>İçerik değiştirilmeyecek</strong>, sadece yapı mükemmelleştirilecek!
                            </p>
                            <div className="bg-gray-800/50 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <CheckCircle size={18} className="text-green-400" />
                                    Yapılacak Aksiyonlar:
                                </h4>
                                <ul className="text-sm text-gray-300 space-y-1 text-left">
                                    <li>✅ Başlıklar ve emoji'ler ekle (🎯 📋 💬)</li>
                                    <li>✅ Placeholder'ları temizle (TODO, ...)</li>
                                    <li>✅ Tonalite tutarlılığı sağla (Sen/Siz)</li>
                                    <li>✅ Tekrar eden kuralları birleştir</li>
                                    <li>✅ Format standardize et (markdown, bullets)</li>
                                    <li>✅ İlgili kuralları grupla (semantic)</li>
                                    <li>✅ Öncelik sıralaması (kritik yukarı)</li>
                                    <li>✅ Çelişkileri ve eksikleri raporla</li>
                                </ul>
                            </div>
                            <button
                                onClick={handleOrganize}
                                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl hover:shadow-cyan-600/30"
                            >
                                Düzenlemeyi Başlat
                            </button>
                        </div>
                    )}

                    {isOrganizing && (
                        <div className="text-center py-12">
                            <Loader2 size={64} className="mx-auto mb-4 text-cyan-400 animate-spin" />
                            <h3 className="text-lg font-semibold mb-2">Düzenleniyor...</h3>
                            <p className="text-gray-400">AI prompt'unuzu organize ediyor. Bu 15-30 saniye sürebilir.</p>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-12">
                            <AlertTriangle size={64} className="mx-auto mb-4 text-red-400" />
                            <h3 className="text-lg font-semibold mb-2 text-red-400">Hata Oluştu</h3>
                            <p className="text-gray-400">{error}</p>
                            <button
                                onClick={handleOrganize}
                                className="mt-4 px-6 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors"
                            >
                                Tekrar Dene
                            </button>
                        </div>
                    )}

                    {result && (
                        <div className="space-y-4">
                            {/* Changes */}
                            {result.changes.length > 0 && (
                                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                                    <h3 className="font-semibold mb-2 flex items-center gap-2 text-green-400">
                                        <CheckCircle size={18} />
                                        Yapılan Değişiklikler ({result.changes.length})
                                    </h3>
                                    <ul className="text-sm text-gray-300 space-y-1">
                                        {result.changes.map((change, idx) => (
                                            <li key={idx}>• {change}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Conflicts */}
                            {result.conflicts.length > 0 && (
                                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                                    <h3 className="font-semibold mb-2 flex items-center gap-2 text-yellow-400">
                                        <AlertTriangle size={18} />
                                        Tespit Edilen Çelişkiler ({result.conflicts.length})
                                    </h3>
                                    <ul className="text-sm text-gray-300 space-y-1">
                                        {result.conflicts.map((conflict, idx) => (
                                            <li key={idx}>⚠️ {conflict}</li>
                                        ))}
                                    </ul>
                                    <p className="text-xs text-gray-400 mt-2">
                                        Not: Çelişkiler düzeltilmedi, sadece tespit edildi. Manuel kontrol gerekebilir.
                                    </p>
                                </div>
                            )}

                            {/* Organized Prompt Preview */}
                            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                                <h3 className="font-semibold mb-2 text-cyan-400">Düzenlenmiş Prompt (Önizleme)</h3>
                                <div className="bg-gray-900 rounded p-4 max-h-96 overflow-y-auto">
                                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                                        {result.organized}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {result && (
                    <div className="p-4 border-t border-gray-800 flex items-center justify-between bg-gray-800/50">
                        <p className="text-sm text-gray-400">
                            Düzenleme tamamlandı! Kabul etmek için "Kullan" butonuna tıklayın.
                        </p>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleAccept}
                                className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 rounded-lg font-medium transition-all shadow-lg"
                            >
                                Kullan
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
