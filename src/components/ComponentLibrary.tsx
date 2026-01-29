import { useState } from 'react';
import { X, Search, Plus, Layers } from 'lucide-react';
import { getComponentsByCategory, getCategoryLabel } from '../constants/promptComponents';
import type { PromptComponent } from '../constants/promptComponents';

interface ComponentLibraryProps {
    onInsert: (content: string) => void;
    onClose: () => void;
}

export const ComponentLibrary = ({ onInsert, onClose }: ComponentLibraryProps) => {
    const [selectedCategory, setSelectedCategory] = useState<PromptComponent['category']>('identity');
    const [searchQuery, setSearchQuery] = useState('');

    const categories: PromptComponent['category'][] = ['identity', 'tone', 'constraints', 'errorHandling', 'examples'];

    const filteredComponents = getComponentsByCategory(selectedCategory).filter(component =>
        searchQuery === '' ||
        component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        component.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleInsert = (component: PromptComponent) => {
        onInsert('\n\n' + component.content + '\n');
        // Don't close automatically - user might want to add more
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-blue-500/30">
                {/* Header */}
                <div className="p-6 border-b border-gray-800">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-blue-400 flex items-center gap-2">
                                <Layers size={28} />
                                Component Library
                            </h2>
                            <p className="text-sm text-gray-400 mt-1">Click to insert proven building blocks</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search components..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Categories Sidebar */}
                    <div className="w-64 border-r border-gray-800 overflow-y-auto bg-gray-800/30">
                        <div className="p-2">
                            {categories.map((category) => {
                                const count = getComponentsByCategory(category).length;
                                return (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors mb-1 ${selectedCategory === category
                                            ? 'bg-blue-600 text-white'
                                            : 'hover:bg-gray-800 text-gray-300'
                                            }`}
                                    >
                                        <div className="font-medium text-sm">{getCategoryLabel(category)}</div>
                                        <div className="text-xs text-gray-400 mt-1">{count} components</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Components List */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {filteredComponents.length === 0 ? (
                            <div className="text-center text-gray-500 mt-8">
                                <Search size={48} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No components found</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {filteredComponents.map((component) => (
                                    <div
                                        key={component.id}
                                        className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-blue-500 transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-200">{component.name}</h3>
                                                <p className="text-xs text-gray-400 mt-1">{component.description}</p>
                                            </div>
                                            <button
                                                onClick={() => handleInsert(component)}
                                                className="ml-4 flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors flex-shrink-0"
                                            >
                                                <Plus size={16} />
                                                Insert
                                            </button>
                                        </div>

                                        {/* Preview */}
                                        <div className="mt-3 p-3 bg-gray-900 rounded border border-gray-700">
                                            <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono">
                                                {component.content}
                                            </pre>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-800 bg-gray-800/50">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-400">
                            💡 Tip: Combine multiple components for best results
                        </p>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
