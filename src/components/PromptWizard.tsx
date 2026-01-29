import { useState, useEffect } from 'react';
import {
    X, ChevronRight, ChevronLeft, Sparkles, Wand2,
    MessageSquare, Briefcase, User, Zap, Layout, CheckCircle
} from 'lucide-react'; // CheckCircle is used here
import { useStore } from '../store';
import { INDUSTRY_TEMPLATES, BOT_TYPES, TONE_OPTIONS, PLATFORM_OPTIONS, FEATURE_OPTIONS } from '../constants/industryTemplates';
import { generateWizardPrompt, WizardState } from '../services/promptGeneration';

interface PromptWizardProps {
    onClose: () => void;
}

const STEPS = [
    { id: 1, title: 'Sektör', icon: Briefcase },
    { id: 2, title: 'Bot Türü', icon: User },
    { id: 3, title: 'Tonalite', icon: MessageSquare },
    { id: 4, title: 'Özellikler', icon: Zap },
    { id: 5, title: 'Önizleme', icon: Layout },
];

export const PromptWizard = ({ onClose }: PromptWizardProps) => {
    const { setPrompt, clearMessages } = useStore();
    const [step, setStep] = useState(1);
    const [selections, setSelections] = useState<WizardState>({
        industry: '',
        botType: '',
        tone: '',
        platforms: [],
        features: [],
        customRequirements: ''
    });

    const [previewPrompt, setPreviewPrompt] = useState('');

    // Update preview whenever selections change
    useEffect(() => {
        if (selections.industry) {
            const generated = generateWizardPrompt(selections);
            setPreviewPrompt(generated);
        }
    }, [selections]);

    const handleNext = () => {
        if (step < STEPS.length) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleApply = () => {
        setPrompt(previewPrompt, 'Wizard ile oluşturuldu');
        clearMessages();
        onClose();
    };

    const toggleSelection = (field: 'platforms' | 'features', value: string) => {
        setSelections(prev => {
            const current = prev[field];
            const updated = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [field]: updated };
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-gray-900 w-full max-w-6xl h-[90vh] rounded-2xl border border-gray-700 shadow-2xl flex flex-col overflow-hidden">

                {/* Header */}
                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Wand2 className="text-blue-400" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Prompt Oluşturucu</h2>
                            <p className="text-sm text-gray-400">Adım adım profesyonel asistan oluşturun</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                        <X className="text-gray-400" />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Left: Steps & Form */}
                    <div className="w-[60%] flex flex-col border-r border-gray-800">
                        {/* Progress Bar */}
                        <div className="px-8 pt-8 pb-4">
                            <div className="flex justify-between relative mb-8">
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -z-10 rounded-full" />
                                <div
                                    className="absolute top-1/2 left-0 h-1 bg-blue-600 transition-all duration-300 rounded-full -z-10"
                                    style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
                                />
                                {STEPS.map((s) => (
                                    <div
                                        key={s.id}
                                        className={`flex flex-col items-center gap-2 cursor-pointer ${step >= s.id ? 'text-blue-400' : 'text-gray-600'}`}
                                        onClick={() => step > s.id && setStep(s.id)}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${step === s.id ? 'bg-blue-600 border-blue-600 params-glow text-white' :
                                                step > s.id ? 'bg-blue-900/50 border-blue-600 text-blue-400' :
                                                    'bg-gray-900 border-gray-700 text-gray-600'
                                            }`}>
                                            <s.icon size={14} />
                                        </div>
                                        <span className="text-xs font-medium">{s.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Step Content */}
                        <div className="flex-1 overflow-y-auto px-8 py-4">

                            {/* Step 1: Industry */}
                            {step === 1 && (
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                        Hangi sektör için bot hazırlıyorsunuz?
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {Object.values(INDUSTRY_TEMPLATES).map((ind) => (
                                            <button
                                                key={ind.id}
                                                onClick={() => setSelections({ ...selections, industry: ind.id })}
                                                className={`p-4 rounded-xl border text-left transition-all hover:scale-[1.02] ${selections.industry === ind.id
                                                        ? 'bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/20'
                                                        : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                                                    }`}
                                            >
                                                <div className="text-3xl mb-3">{ind.icon}</div>
                                                <div className="font-semibold text-white">{ind.name}</div>
                                                <div className="text-sm text-gray-400 mt-1">{ind.description}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Bot Type */}
                            {step === 2 && (
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-bold text-white">Botunuzun ana görevi ne olacak?</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {Object.values(BOT_TYPES).map((type) => (
                                            <button
                                                key={type.id}
                                                onClick={() => setSelections({ ...selections, botType: type.id })}
                                                className={`p-4 rounded-xl border text-left transition-all hover:scale-[1.02] ${selections.botType === type.id
                                                        ? 'bg-purple-600/20 border-purple-500 shadow-lg shadow-purple-500/20'
                                                        : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                                                    }`}
                                            >
                                                <div className="text-3xl mb-3">{type.icon}</div>
                                                <div className="font-semibold text-white">{type.name}</div>
                                                <div className="text-sm text-gray-400 mt-1">{type.description}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Tone & Style */}
                            {step === 3 && (
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-bold text-white">İletişim dili nasıl olmalı?</h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        {Object.values(TONE_OPTIONS).map((tone) => (
                                            <button
                                                key={tone.id}
                                                onClick={() => setSelections({ ...selections, tone: tone.id })}
                                                className={`p-4 rounded-xl border text-left transition-all ${selections.tone === tone.id
                                                        ? 'bg-green-600/20 border-green-500 ring-1 ring-green-500'
                                                        : 'bg-gray-800/50 border-gray-700'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-2xl">{tone.icon}</span>
                                                    <span className="font-semibold text-white">{tone.name}</span>
                                                </div>
                                                <div className="text-sm text-gray-400 italic">"{tone.example}"</div>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Platformlar</h4>
                                        <div className="flex flex-wrap gap-3">
                                            {PLATFORM_OPTIONS.map((plat) => (
                                                <button
                                                    key={plat.id}
                                                    onClick={() => toggleSelection('platforms', plat.id)}
                                                    className={`px-4 py-2 rounded-full border text-sm transition-all flex items-center gap-2 ${selections.platforms.includes(plat.id)
                                                            ? 'bg-blue-600 border-blue-500 text-white'
                                                            : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                                                        }`}
                                                >
                                                    <span>{plat.icon}</span>
                                                    {plat.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Features */}
                            {step === 4 && (
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-bold text-white">Hangi özelliklere ihtiyacı var?</h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        {FEATURE_OPTIONS.map((feat) => (
                                            <button
                                                key={feat.id}
                                                onClick={() => toggleSelection('features', feat.id)}
                                                className={`p-4 rounded-xl border text-left transition-all flex items-start gap-4 ${selections.features.includes(feat.id)
                                                        ? 'bg-indigo-600/20 border-indigo-500'
                                                        : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                                                    }`}
                                            >
                                                <div className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center ${selections.features.includes(feat.id)
                                                        ? 'bg-indigo-500 border-indigo-500'
                                                        : 'border-gray-600'
                                                    }`}>
                                                    {selections.features.includes(feat.id) && <CheckCircle size={12} className="text-white" />}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-white">{feat.name}</div>
                                                    <div className="text-sm text-gray-400">{feat.description}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Özel Gereksinimler (Opsiyonel)</label>
                                        <textarea
                                            value={selections.customRequirements}
                                            onChange={(e) => setSelections({ ...selections, customRequirements: e.target.value })}
                                            placeholder="Örn: Müşterilere her zaman ismiyle hitap et, sadece İstanbul içi hizmet veriyoruz..."
                                            className="w-full h-32 bg-gray-800 border border-gray-700 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 5: Review */}
                            {step === 5 && (
                                <div className="space-y-8 flex flex-col items-center justify-center h-full text-center">
                                    <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 animate-pulse">
                                        <CheckCircle size={48} className="text-white" />
                                    </div>
                                    <div className="space-y-4 max-w-lg">
                                        <h3 className="text-3xl font-bold text-white">Her şey hazır!</h3>
                                        <p className="text-gray-400 text-lg">
                                            Seçimlerinize göre profesyonel bir sistem promptu oluşturuldu. Sağ taraftaki panelden önizleyebilir veya doğrudan kullanmaya başlayabilirsiniz.
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleApply}
                                        className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-lg text-white shadow-xl hover:scale-105 transition-all"
                                    >
                                        <span className="flex items-center gap-3">
                                            <Sparkles className="animate-spin-slow" />
                                            Prompt'u Uygula & Başla
                                            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Footer Navigation */}
                        <div className="p-6 border-t border-gray-800 flex justify-between bg-gray-900">
                            <button
                                onClick={handleBack}
                                disabled={step === 1}
                                className={`px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                    }`}
                            >
                                <ChevronLeft size={18} /> Geri
                            </button>

                            {step < 5 && (
                                <button
                                    onClick={handleNext}
                                    disabled={
                                        (step === 1 && !selections.industry) ||
                                        (step === 2 && !selections.botType) ||
                                        (step === 3 && !selections.tone)
                                    }
                                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-blue-600/20 flex items-center gap-2"
                                >
                                    Sonraki <ChevronRight size={18} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right: Live Preview */}
                    <div className="w-[40%] bg-gray-950 flex flex-col">
                        <div className="p-4 border-b border-gray-800 bg-gray-900/50 flex justify-between items-center">
                            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <Layout size={14} /> Canlı Önizleme
                            </span>
                            <div className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded border border-blue-500/20">
                                Otomatik Güncellenir
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 font-mono text-sm">
                            {previewPrompt ? (
                                <div className="space-y-4 animate-fadeIn">
                                    {previewPrompt.split('\n').map((line, i) => (
                                        <div key={i} className={`${line.startsWith('# ') ? 'text-2xl font-bold text-blue-400 pb-2 border-b border-gray-800 mt-4' :
                                                line.startsWith('## ') ? 'text-xl font-bold text-purple-400 mt-6 mb-2' :
                                                    line.startsWith('- ') ? 'text-gray-300 pl-4' :
                                                        line.startsWith('**') ? 'text-white' :
                                                            'text-gray-400'
                                            }`}>
                                            {line}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
                                    <Wand2 size={48} className="opacity-20" />
                                    <p>Seçim yapmaya başladığınızda<br />prompt burada belirecek...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
