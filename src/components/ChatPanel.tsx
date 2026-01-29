import { useState } from 'react';
import { Send, Loader2, Trash2 } from 'lucide-react';
import { useStore } from '../store';
import { sendMessage, initializeAI } from '../services/ai';
import { MessageItem } from './MessageItem';
import { QuickTest } from './QuickTest';
import { getCombinedKnowledge } from '../utils/knowledgeStorage';

export const ChatPanel = () => {
    const { messages, addMessage, clearMessages, apiKey, currentPrompt, knowledgeFiles } = useStore();
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || !apiKey) return;

        const userMessage = input.trim();
        setInput('');
        addMessage({ role: 'user', content: userMessage });
        setIsLoading(true);

        try {
            initializeAI(apiKey);

            // Build conversation history
            const history = messages.map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            // Add knowledge base to prompt
            const knowledge = getCombinedKnowledge(knowledgeFiles);
            const enrichedPrompt = knowledge ? currentPrompt + '\n\n' + knowledge : currentPrompt;

            const aiResponse = await sendMessage(userMessage, enrichedPrompt, history);
            addMessage({ role: 'ai', content: aiResponse });
        } catch (error) {
            console.error('Error:', error);
            addMessage({
                role: 'ai',
                content: `❌ Hata: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearChat = () => {
        if (messages.length === 0) return;

        const confirmed = window.confirm(
            'Tüm sohbet geçmişi silinecek. Emin misiniz?'
        );

        if (confirmed) {
            clearMessages();
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-900">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-blue-400">Test Chat</h2>
                    <p className="text-sm text-gray-400">AI ile konuşarak system prompt'u test et</p>
                </div>
                <button
                    onClick={handleClearChat}
                    disabled={messages.length === 0}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-red-500/30"
                    title="Clear Chat"
                >
                    <Trash2 size={16} />
                    Clear
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                            <p className="text-lg">👋 Merhaba!</p>
                            <p className="text-sm mt-2">AI ile konuşmaya başla</p>
                        </div>
                    </div>
                ) : (
                    messages.map((message) => (
                        <MessageItem key={message.id} message={message} />
                    ))
                )}
                {isLoading && (
                    <div className="flex items-center gap-2 text-gray-400">
                        <Loader2 size={16} className="animate-spin" />
                        <span className="text-sm">AI düşünüyor...</span>
                    </div>
                )}
            </div>

            {/* Input - Unified Design */}
            <div className="p-4 border-t border-gray-800">
                <div className="flex gap-2">
                    {/* Quick Test - Left */}
                    <QuickTest onSendMessage={(msg) => {
                        addMessage({ role: 'user', content: msg });
                        setIsLoading(true);
                        initializeAI(apiKey);
                        const history = messages.map(m => ({ role: m.role, content: m.content }));
                        const knowledge = getCombinedKnowledge(knowledgeFiles);
                        const enrichedPrompt = knowledge ? currentPrompt + '\n\n' + knowledge : currentPrompt;
                        sendMessage(msg, enrichedPrompt, history)
                            .then(aiResponse => addMessage({ role: 'ai', content: aiResponse }))
                            .catch(error => addMessage({ role: 'ai', content: `❌ Hata: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}` }))
                            .finally(() => setIsLoading(false));
                    }} disabled={!apiKey || isLoading} />

                    {/* Input Container - Right */}
                    <div className="flex-1 flex items-center bg-gray-800 border border-gray-700 rounded-lg overflow-hidden focus-within:border-blue-500 transition-colors">
                        {/* Input Field */}
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                            placeholder={apiKey ? "Mesajınızı yazın..." : "Önce API key giriniz..."}
                            disabled={!apiKey || isLoading}
                            className="flex-1 px-4 py-3 bg-transparent border-0 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        />

                        {/* Separator */}
                        <div className="w-px h-8 bg-gray-700" />

                        {/* Send Button */}
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || !apiKey || isLoading}
                            className="px-5 py-3 bg-blue-600/10 hover:bg-blue-600 disabled:bg-transparent disabled:cursor-not-allowed transition-colors flex items-center gap-2 disabled:opacity-50"
                            title="Gönder (Enter)"
                        >
                            <Send size={18} />
                            <span className="text-sm font-medium">Gönder</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
