import { X } from 'lucide-react';
import { useState } from 'react';
import { PROMPT_TEMPLATES, TEMPLATE_CATEGORIES } from '../constants/templates';
import { useStore } from '../store';

interface TemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const TemplateModal = ({ isOpen, onClose }: TemplateModalProps) => {
    const { setPrompt, clearMessages } = useStore();
    const [selectedCategory, setSelectedCategory] = useState('all');

    if (!isOpen) return null;

    const filteredTemplates =
        selectedCategory === 'all'
            ? PROMPT_TEMPLATES
            : PROMPT_TEMPLATES.filter((t) => t.category === selectedCategory);

    const handleSelectTemplate = (promptContent: string, templateName: string) => {
        setPrompt(promptContent, `Template yüklendi: ${templateName}`);
        clearMessages();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-blue-400">Prompt Templates</h2>
                        <p className="text-sm text-gray-400 mt-1">Hazır system prompt şablonları seç ve özelleştir</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Category Filter */}
                <div className="p-4 border-b border-gray-800">
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-4 py-2 rounded-lg transition-colors ${selectedCategory === 'all'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                                }`}
                        >
                            Tümü
                        </button>
                        {TEMPLATE_CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${selectedCategory === cat.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                                    }`}
                            >
                                <span>{cat.icon}</span>
                                <span>{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Templates Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredTemplates.map((template) => (
                            <div
                                key={template.id}
                                className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer"
                                onClick={() => handleSelectTemplate(template.prompt, template.name)}
                            >
                                <div className="flex items-start gap-3">
                                    <span className="text-3xl">{template.icon}</span>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                                        <p className="text-sm text-gray-400 mb-3">{template.description}</p>
                                        <div className="bg-gray-900 rounded p-3 text-xs text-gray-300 font-mono line-clamp-3">
                                            {template.prompt.substring(0, 150)}...
                                        </div>
                                    </div>
                                </div>
                                <button className="mt-3 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
                                    Bu Template'i Kullan
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
