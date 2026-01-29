import { useState } from 'react';
import { X, Wand2, ArrowRight, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import type { GeneratorAnswers } from '../constants/templates';
import { generatePromptFromAnswers } from '../services/promptGeneration';
import { useStore } from '../store';

interface PromptGeneratorProps {
    onGenerated: (prompt: string) => void;
    onClose: () => void;
    isOpen: boolean;
}

export const PromptGenerator = ({ onGenerated, onClose, isOpen }: PromptGeneratorProps) => {
    const { apiKey } = useStore();
    const [step, setStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedPrompt, setGeneratedPrompt] = useState('');

    const [answers, setAnswers] = useState<GeneratorAnswers>({
        botType: '',
        industry: '',
        mainGoals: '',
        tone: '',
        constraints: '',
        additionalInfo: '',
    });

    const totalSteps = 6;

    const handleNext = () => {
        if (step < totalSteps) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleGenerate = async () => {
        if (!apiKey) {
            alert('API key gerekli!');
            return;
        }

        setIsGenerating(true);
        try {
            const prompt = await generatePromptFromAnswers(answers, apiKey);
            setGeneratedPrompt(prompt);
            setStep(totalSteps + 1); // Go to preview step
        } catch (error) {
            console.error('Generation error:', error);
            alert(`Hata: ${error instanceof Error ? error.message : 'Bilinmeyen hata'} `);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAccept = () => {
        onGenerated(generatedPrompt);
        onClose();
    };

    const progress = (step / totalSteps) * 100;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-green-500/30">
                {/* Header */}
                <div className="p-6 border-b border-gray-800">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-green-400 flex items-center gap-2">
                                <Wand2 size={28} />
                                AI Prompt Generator
                            </h2>
                            <p className="text-sm text-gray-400 mt-1">Answer questions, get professional prompt</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Progress Bar */}
                    {step <= totalSteps && (
                        <div>
                            <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                                <span>Step {step} of {totalSteps}</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}% ` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {step === 1 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-200">Ne tür bir chatbot yapıyorsunuz?</h3>
                            <select
                                value={answers.botType}
                                onChange={(e) => setAnswers({ ...answers, botType: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500"
                            >
                                <option value="">Seçin...</option>
                                <option value="WhatsApp Müşteri Hizmetleri">WhatsApp Müşteri Hizmetleri</option>
                                <option value="Telegram Destek Botu">Telegram Destek Botu</option>
                                <option value="Satış Asistanı">Satış Asistanı</option>
                                <option value="Randevu Sistemi">Randevu Sistemi</option>
                                <option value="Lead Generation">Lead Generation</option>
                                <option value="FAQ Bot">FAQ Bot</option>
                                <option value="Diğer">Diğer</option>
                            </select>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-200">Hangi sektörde çalışıyorsunuz?</h3>
                            <input
                                type="text"
                                value={answers.industry}
                                onChange={(e) => setAnswers({ ...answers, industry: e.target.value })}
                                placeholder="Örnek: E-ticaret, Sağlık, Eğitim, Finans..."
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500"
                            />
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-200">Ana görevleri neler? (3-5 madde)</h3>
                            <textarea
                                value={answers.mainGoals}
                                onChange={(e) => setAnswers({ ...answers, mainGoals: e.target.value })}
                                placeholder={"Örnek:\n- Ürün bilgisi vermek\n- Sipariş durumu sorgulamak\n- İade sürecini yönetmek"}
                                rows={6}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 resize-none"
                            />
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-200">Tonalite nasıl olsun?</h3>
                            <select
                                value={answers.tone}
                                onChange={(e) => setAnswers({ ...answers, tone: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500"
                            >
                                <option value="">Seçin...</option>
                                <option value="Samimi ve arkadaş canlısı">Samimi ve arkadaş canlısı</option>
                                <option value="Profesyonel ve resmi">Profesyonel ve resmi</option>
                                <option value="Empatik ve anlayışlı">Empatik ve anlayışlı</option>
                                <option value="Enerjik ve coşkulu">Enerjik ve coşkulu</option>
                            </select>
                        </div>
                    )}

                    {step === 5 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-200">Kısıtlamalar neler? (Yapmaması gerekenler)</h3>
                            <textarea
                                value={answers.constraints}
                                onChange={(e) => setAnswers({ ...answers, constraints: e.target.value })}
                                placeholder={"Örnek:\n- Fiyat taahhüdü vermeme\n- Siyasi konulara girmeme\n- Her zaman Türkçe konuşma"}
                                rows={6}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 resize-none"
                            />
                        </div>
                    )}

                    {step === 6 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-200">Ek bilgi var mı? (Opsiyonel)</h3>
                            <textarea
                                value={answers.additionalInfo}
                                onChange={(e) => setAnswers({ ...answers, additionalInfo: e.target.value })}
                                placeholder="Örneğin: Şirket adı, özel kurallar, emoji kullanımı vb."
                                rows={5}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 resize-none"
                            />
                        </div>
                    )}

                    {step === totalSteps + 1 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-green-400 mb-4">
                                <CheckCircle size={24} />
                                <h3 className="text-lg font-semibold">Prompt Oluşturuldu!</h3>
                            </div>
                            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto">
                                <pre className="text-sm text-gray-300 whitespace-pre-wrap">{generatedPrompt}</pre>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-800 bg-gray-800/50">
                    {step <= totalSteps && (
                        <div className="flex items-center justify-between gap-3">
                            <button
                                onClick={handleBack}
                                disabled={step === 1}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                            >
                                <ArrowLeft size={18} />
                                Back
                            </button>

                            {step < totalSteps ? (
                                <button
                                    onClick={handleNext}
                                    disabled={!answers[Object.keys(answers)[step - 1] as keyof GeneratorAnswers]}
                                    className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
                                >
                                    Next
                                    <ArrowRight size={18} />
                                </button>
                            ) : (
                                <button
                                    onClick={handleGenerate}
                                    disabled={isGenerating}
                                    className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg transition-colors font-medium"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Wand2 size={18} />
                                            Generate Prompt
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    )}

                    {step === totalSteps + 1 && (
                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(1)}
                                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                            >
                                Restart
                            </button>
                            <button
                                onClick={handleAccept}
                                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors font-medium"
                            >
                                Use This Prompt
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
