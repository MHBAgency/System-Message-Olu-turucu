import { useState } from 'react';
import { Zap, ChevronDown } from 'lucide-react';
import { TEST_SCENARIOS } from '../constants/testScenarios';

interface QuickTestProps {
    onSendMessage: (message: string) => void;
    disabled: boolean;
}

export const QuickTest = ({ onSendMessage, disabled }: QuickTestProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleRunScenario = async (questions: string[]) => {
        setIsOpen(false);

        // Send questions one by one with delay
        for (let i = 0; i < questions.length; i++) {
            await new Promise((resolve) => setTimeout(resolve, i === 0 ? 0 : 3000));
            onSendMessage(questions[i]);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                title="Quick Test"
            >
                <Zap size={18} />
                <span className="text-sm font-medium">Quick Test</span>
                <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown - Opens UPWARD */}
                    <div className="absolute bottom-full left-0 mb-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20 max-h-96 overflow-y-auto">
                        <div className="p-3 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
                            <p className="text-sm font-semibold text-yellow-400">Test Senaryoları</p>
                            <p className="text-xs text-gray-400 mt-1">
                                Hazır test sorularını otomatik gönder
                            </p>
                        </div>

                        <div className="p-2">
                            {TEST_SCENARIOS.map((scenario) => (
                                <button
                                    key={scenario.id}
                                    onClick={() => handleRunScenario(scenario.questions)}
                                    className="w-full text-left p-3 hover:bg-gray-700 rounded-lg transition-colors mb-1"
                                >
                                    <div className="font-medium text-sm mb-1">{scenario.name}</div>
                                    <div className="text-xs text-gray-400">
                                        {scenario.questions.length} soru
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                                        {scenario.questions[0]}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
